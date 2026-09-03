'use strict';
const { DatabaseSync } = require('node:sqlite');
const fs = require('node:fs');
const path = require('node:path');

const DATA_DIR = path.join(__dirname, '..', 'data');
fs.mkdirSync(DATA_DIR, { recursive: true });
const db = new DatabaseSync(path.join(DATA_DIR, 'tracker.db'));

db.exec(`
PRAGMA journal_mode = WAL;
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS users (
  id            TEXT PRIMARY KEY,
  email         TEXT NOT NULL UNIQUE,
  email_lc      TEXT NOT NULL UNIQUE,
  display_name  TEXT NOT NULL,
  pw_hash       TEXT NOT NULL,
  pw_salt       TEXT NOT NULL,
  created_at    TEXT NOT NULL,
  last_login_at TEXT
);

CREATE TABLE IF NOT EXISTS sessions (
  token      TEXT PRIMARY KEY,
  user_id    TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TEXT NOT NULL,
  expires_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);

-- One row per (user, resource). Absent row == "not started".
CREATE TABLE IF NOT EXISTS progress (
  user_id      TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  item_id      TEXT NOT NULL,
  status       TEXT NOT NULL CHECK (status IN ('in_progress','done')),
  started_at   TEXT,
  completed_at TEXT,
  updated_at   TEXT NOT NULL,
  PRIMARY KEY (user_id, item_id)
);

-- Append-only audit trail: every status change ever made.
CREATE TABLE IF NOT EXISTS history (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id    TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  item_id    TEXT NOT NULL,
  item_title TEXT NOT NULL,
  chapter    TEXT NOT NULL DEFAULT '',
  topic      TEXT NOT NULL DEFAULT '',
  from_status TEXT NOT NULL,
  to_status   TEXT NOT NULL,
  at         TEXT NOT NULL,
  day        TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_history_user_at ON history(user_id, at DESC);
CREATE INDEX IF NOT EXISTS idx_history_user_day ON history(user_id, day);

CREATE TABLE IF NOT EXISTS notes (
  id         TEXT PRIMARY KEY,
  user_id    TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  scope      TEXT NOT NULL CHECK (scope IN ('item','topic','free')),
  ref_id     TEXT NOT NULL DEFAULT '',
  ref_label  TEXT NOT NULL DEFAULT '',
  title      TEXT NOT NULL DEFAULT '',
  body       TEXT NOT NULL DEFAULT '',
  tags       TEXT NOT NULL DEFAULT '',
  pinned     INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_notes_user ON notes(user_id, updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_notes_ref ON notes(user_id, scope, ref_id);

-- Per-user reminder schedule. tz_offset is minutes west of UTC as reported by
-- the browser (Date.getTimezoneOffset), so the server can fire at the user's
-- local wall-clock time without guessing a timezone.
CREATE TABLE IF NOT EXISTS reminders (
  user_id        TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  enabled        INTEGER NOT NULL DEFAULT 0,
  at_time        TEXT    NOT NULL DEFAULT '19:00',
  days           TEXT    NOT NULL DEFAULT '1,2,3,4,5',
  tz_offset      INTEGER NOT NULL DEFAULT 0,
  channels       TEXT    NOT NULL DEFAULT 'browser',
  email_to       TEXT    NOT NULL DEFAULT '',
  whatsapp_to    TEXT    NOT NULL DEFAULT '',
  daily_goal     INTEGER NOT NULL DEFAULT 1,
  skip_when_done INTEGER NOT NULL DEFAULT 1,
  last_fired_day TEXT    NOT NULL DEFAULT '',
  updated_at     TEXT    NOT NULL
);

-- Outbox + delivery log. Browser/desktop alarms are picked up from here.
CREATE TABLE IF NOT EXISTS notifications (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id    TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  channel    TEXT NOT NULL,
  kind       TEXT NOT NULL DEFAULT 'reminder',
  status     TEXT NOT NULL,
  title      TEXT NOT NULL DEFAULT '',
  body       TEXT NOT NULL DEFAULT '',
  detail     TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL,
  day        TEXT NOT NULL,
  seen_at    TEXT
);
CREATE INDEX IF NOT EXISTS idx_notif_user ON notifications(user_id, id DESC);

-- Per-user UI preferences (currently: what progress counts).
CREATE TABLE IF NOT EXISTS prefs (
  user_id    TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  data       TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_notif_pending ON notifications(user_id, channel, seen_at);
`);

const plain = (r) => (r ? { ...r } : r);
const q = {
  createUser: db.prepare(`INSERT INTO users (id,email,email_lc,display_name,pw_hash,pw_salt,created_at)
                          VALUES (?,?,?,?,?,?,?)`),
  userByEmail: db.prepare(`SELECT * FROM users WHERE email_lc = ?`),
  userById: db.prepare(`SELECT * FROM users WHERE id = ?`),
  touchLogin: db.prepare(`UPDATE users SET last_login_at = ? WHERE id = ?`),
  renameUser: db.prepare(`UPDATE users SET display_name = ? WHERE id = ?`),
  setPassword: db.prepare(`UPDATE users SET pw_hash = ?, pw_salt = ? WHERE id = ?`),

  createSession: db.prepare(`INSERT INTO sessions (token,user_id,created_at,expires_at) VALUES (?,?,?,?)`),
  session: db.prepare(`SELECT * FROM sessions WHERE token = ?`),
  killSession: db.prepare(`DELETE FROM sessions WHERE token = ?`),
  killUserSessions: db.prepare(`DELETE FROM sessions WHERE user_id = ?`),
  reapSessions: db.prepare(`DELETE FROM sessions WHERE expires_at < ?`),

  progress: db.prepare(`SELECT item_id,status,started_at,completed_at,updated_at FROM progress WHERE user_id = ?`),
  progressOne: db.prepare(`SELECT * FROM progress WHERE user_id = ? AND item_id = ?`),
  upsertProgress: db.prepare(`
    INSERT INTO progress (user_id,item_id,status,started_at,completed_at,updated_at)
    VALUES (?,?,?,?,?,?)
    ON CONFLICT(user_id,item_id) DO UPDATE SET
      status = excluded.status,
      started_at = COALESCE(progress.started_at, excluded.started_at),
      completed_at = excluded.completed_at,
      updated_at = excluded.updated_at`),
  clearProgress: db.prepare(`DELETE FROM progress WHERE user_id = ? AND item_id = ?`),
  wipeProgress: db.prepare(`DELETE FROM progress WHERE user_id = ?`),

  addHistory: db.prepare(`INSERT INTO history (user_id,item_id,item_title,chapter,topic,from_status,to_status,at,day)
                          VALUES (?,?,?,?,?,?,?,?,?)`),
  history: db.prepare(`SELECT * FROM history WHERE user_id = ? ORDER BY id DESC LIMIT ? OFFSET ?`),
  historyCount: db.prepare(`SELECT COUNT(*) AS n FROM history WHERE user_id = ?`),
  historyDays: db.prepare(`SELECT day, COUNT(*) AS n FROM history
                           WHERE user_id = ? AND to_status = 'done' GROUP BY day ORDER BY day`),
  doneDays: db.prepare(`SELECT DISTINCT day FROM history WHERE user_id = ? AND to_status='done' ORDER BY day DESC`),
  wipeHistory: db.prepare(`DELETE FROM history WHERE user_id = ?`),

  notesAll: db.prepare(`SELECT * FROM notes WHERE user_id = ? ORDER BY pinned DESC, updated_at DESC`),
  notesFor: db.prepare(`SELECT * FROM notes WHERE user_id = ? AND scope = ? AND ref_id = ? ORDER BY updated_at DESC`),
  noteById: db.prepare(`SELECT * FROM notes WHERE id = ? AND user_id = ?`),
  insertNote: db.prepare(`INSERT INTO notes (id,user_id,scope,ref_id,ref_label,title,body,tags,pinned,created_at,updated_at)
                          VALUES (?,?,?,?,?,?,?,?,?,?,?)`),
  updateNote: db.prepare(`UPDATE notes SET title=?, body=?, tags=?, pinned=?, ref_label=?, updated_at=?
                          WHERE id=? AND user_id=?`),
  deleteNote: db.prepare(`DELETE FROM notes WHERE id=? AND user_id=?`),
  noteCounts: db.prepare(`SELECT ref_id, COUNT(*) AS n FROM notes WHERE user_id=? AND scope='item' GROUP BY ref_id`),

  reminder: db.prepare(`SELECT * FROM reminders WHERE user_id = ?`),
  allReminders: db.prepare(`SELECT r.*, u.email, u.display_name FROM reminders r
                            JOIN users u ON u.id = r.user_id WHERE r.enabled = 1`),
  upsertReminder: db.prepare(`
    INSERT INTO reminders (user_id,enabled,at_time,days,tz_offset,channels,email_to,whatsapp_to,
                           daily_goal,skip_when_done,updated_at)
    VALUES (?,?,?,?,?,?,?,?,?,?,?)
    ON CONFLICT(user_id) DO UPDATE SET
      enabled=excluded.enabled, at_time=excluded.at_time, days=excluded.days,
      tz_offset=excluded.tz_offset, channels=excluded.channels, email_to=excluded.email_to,
      whatsapp_to=excluded.whatsapp_to, daily_goal=excluded.daily_goal,
      skip_when_done=excluded.skip_when_done, updated_at=excluded.updated_at`),
  markFired: db.prepare(`UPDATE reminders SET last_fired_day = ? WHERE user_id = ?`),

  addNotification: db.prepare(`INSERT INTO notifications (user_id,channel,kind,status,title,body,detail,created_at,day)
                               VALUES (?,?,?,?,?,?,?,?,?)`),
  pendingAlarms: db.prepare(`SELECT * FROM notifications
                             WHERE user_id = ? AND channel = 'browser' AND seen_at IS NULL
                             ORDER BY id ASC LIMIT 20`),
  seeNotification: db.prepare(`UPDATE notifications SET seen_at = ? WHERE id = ? AND user_id = ?`),
  seeAllNotifications: db.prepare(`UPDATE notifications SET seen_at = ? WHERE user_id = ? AND seen_at IS NULL`),
  notificationLog: db.prepare(`SELECT * FROM notifications WHERE user_id = ? ORDER BY id DESC LIMIT ?`),
  prefs: db.prepare(`SELECT data FROM prefs WHERE user_id = ?`),
  setPrefs: db.prepare(`INSERT INTO prefs (user_id,data,updated_at) VALUES (?,?,?)
                        ON CONFLICT(user_id) DO UPDATE SET data=excluded.data, updated_at=excluded.updated_at`),

  doneOnDay: db.prepare(`SELECT COUNT(*) AS n FROM history
                         WHERE user_id = ? AND day = ? AND to_status = 'done'`),
};

module.exports = { db, q, plain };
