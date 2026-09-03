'use strict';
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

const { q, plain } = require('./lib/db');
const auth = require('./lib/auth');
const { build, resolveSource } = require('./lib/parseReadme');
const config = require('./lib/config');
const reminders = require('./lib/reminders');

const PORT = Number(process.env.PORT || 5178);
const HOST = process.env.HOST || '127.0.0.1';
const ROOT = __dirname;
const PUBLIC = path.join(ROOT, 'public');
const CURRICULUM = resolveSource(ROOT);

/* ---------- curriculum (re-read from README.md, hot-reloads on change) ---------- */
let course = null, itemIndex = new Map(), readmeMtime = 0;

function loadCourse(force) {
  const mtime = fs.statSync(CURRICULUM).mtimeMs;
  if (!force && course && mtime === readmeMtime) return course;
  readmeMtime = mtime;
  course = build(CURRICULUM);
  itemIndex = new Map();
  const walk = (node, chapter) => {
    for (const it of node.items) {
      itemIndex.set(it.id, {
        ...it,
        chapter,
        topic: it.path.length > 1 ? it.path[it.path.length - 1] : (it.path[0] || chapter),
      });
    }
    for (const c of node.children) walk(c, chapter);
  };
  for (const s of course.sections) walk(s, s.title);
  course.itemCount = itemIndex.size;
  fs.writeFileSync(path.join(ROOT, 'data', 'course.json'), JSON.stringify(course));
  console.log('[course] ' + path.basename(CURRICULUM) + ': ' + course.sections.length +
    ' chapters, ' + itemIndex.size + ' resources');
  return course;
}
loadCourse(true);

/* ---------- helpers ---------- */
function today(d) {
  d = d || new Date();
  const p = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
  return p.toISOString().slice(0, 10);
}

function send(res, status, body, headers) {
  const payload = typeof body === 'string' || Buffer.isBuffer(body) ? body : JSON.stringify(body);
  res.writeHead(status, Object.assign({
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
  }, headers || {}));
  res.end(payload);
}

function readBody(req, limit) {
  limit = limit || 1e6;
  return new Promise((resolve, reject) => {
    let data = '', size = 0;
    req.on('data', (c) => {
      size += c.length;
      if (size > limit) { reject(auth.httpError(413, 'Payload too large.')); req.destroy(); return; }
      data += c;
    });
    req.on('end', () => {
      if (!data) return resolve({});
      try { resolve(JSON.parse(data)); } catch (e) { reject(auth.httpError(400, 'Malformed JSON body.')); }
    });
    req.on('error', reject);
  });
}

function requireUser(req) {
  const u = auth.userFromRequest(req);
  if (!u) throw auth.httpError(401, 'Not signed in.');
  return u;
}

/* ---------- progress scope ----------
   The syllabus holds 711 resources but the course is the core path through
   stages 0-6. Counting everything makes real progress look like nothing, so a
   user chooses what the numbers are measured against. */
const DEFAULT_PREFS = { scope: { mode: 'core', tracks: [] } };

function getPrefs(userId) {
  const row = q.prefs.get(userId);
  if (!row) return JSON.parse(JSON.stringify(DEFAULT_PREFS));
  try {
    const p = JSON.parse(plain(row).data);
    return {
      scope: {
        mode: p.scope && p.scope.mode === 'all' ? 'all' : 'core',
        tracks: (p.scope && Array.isArray(p.scope.tracks)) ? p.scope.tracks : [],
      },
    };
  } catch (e) {
    return JSON.parse(JSON.stringify(DEFAULT_PREFS));
  }
}

function savePrefs(userId, body) {
  const cur = getPrefs(userId);
  const sc = body && body.scope ? body.scope : {};
  const next = {
    scope: {
      mode: sc.mode === 'all' ? 'all' : (sc.mode === 'core' ? 'core' : cur.scope.mode),
      tracks: Array.isArray(sc.tracks)
        ? sc.tracks.filter((t) => typeof t === 'string').slice(0, 12)
        : cur.scope.tracks,
    },
  };
  q.setPrefs.run(userId, JSON.stringify(next), new Date().toISOString());
  return next;
}

// Which chapters can be counted, and what they are.
function chapterKind(title) {
  if (/^Stage /.test(title)) return 'stage';
  if (/^Track /.test(title)) return 'track';
  return 'aside';           // Reference Shelf, appendices
}

function inScope(meta, prefs) {
  if (prefs.scope.mode === 'all') return true;
  if (meta.alt || meta.extra) return false;
  const kind = chapterKind(meta.chapter);
  if (kind === 'stage') return true;
  if (kind === 'track') return prefs.scope.tracks.indexOf(meta.chapter) !== -1;
  return false;
}

/* ---------- progress + stats ---------- */
function progressPayload(userId) {
  const rows = q.progress.all(userId).map(plain);
  const map = {};
  for (const r of rows) map[r.item_id] = { status: r.status, startedAt: r.started_at, completedAt: r.completed_at };
  const notes = {};
  for (const r of q.noteCounts.all(userId).map(plain)) notes[r.ref_id] = r.n;
  const prefs = getPrefs(userId);
  return { items: map, noteCounts: notes, prefs: prefs, stats: computeStats(userId, map, prefs) };
}

function computeStats(userId, map, prefs) {
  prefs = prefs || getPrefs(userId);
  let total = 0, done = 0, inProgress = 0, grandTotal = 0;
  const byChapter = {};
  for (const s of course.sections) {
    byChapter[s.title] = { total: 0, done: 0, inProgress: 0, kind: chapterKind(s.title), counted: false };
  }
  for (const entry of itemIndex) {
    const id = entry[0], meta = entry[1];
    grandTotal++;
    const counted = inScope(meta, prefs);
    const c = byChapter[meta.chapter];
    if (counted) { total++; if (c) { c.total++; c.counted = true; } }
    const p = map[id];
    if (!p) continue;
    if (p.status === 'done') { if (counted) { done++; if (c) c.done++; } }
    else if (counted) { inProgress++; if (c) c.inProgress++; }
  }
  const days = q.historyDays.all(userId).map(plain);
  const doneDays = q.doneDays.all(userId).map((r) => r.day);
  const todayRow = days.find((d) => d.day === today());
  return {
    total: total,
    grandTotal: grandTotal,
    scope: prefs.scope,
    done: done,
    inProgress: inProgress,
    remaining: total - done,
    percent: total ? Math.round((done / total) * 1000) / 10 : 0,
    byChapter: byChapter,
    activity: days,
    streak: streakFrom(doneDays),
    bestStreak: bestStreakFrom(doneDays.slice().reverse()),
    activeDays: doneDays.length,
    completedToday: todayRow ? todayRow.n : 0,
    lastActivity: doneDays[0] || null,
  };
}

function streakFrom(descDays) {
  if (!descDays.length) return 0;
  const t = today();
  const yest = today(new Date(Date.now() - 864e5));
  if (descDays[0] !== t && descDays[0] !== yest) return 0;
  let streak = 1, cursor = new Date(descDays[0] + 'T00:00:00');
  for (let i = 1; i < descDays.length; i++) {
    const prev = today(new Date(cursor.getTime() - 864e5));
    if (descDays[i] === prev) { streak++; cursor = new Date(prev + 'T00:00:00'); } else break;
  }
  return streak;
}

function bestStreakFrom(ascDays) {
  let best = 0, run = 0, prev = null;
  for (const d of ascDays) {
    const cur = new Date(d + 'T00:00:00');
    run = prev && (cur - prev) === 864e5 ? run + 1 : 1;
    if (run > best) best = run;
    prev = cur;
  }
  return best;
}

function setStatus(userId, itemId, status) {
  const meta = itemIndex.get(itemId);
  if (!meta) throw auth.httpError(404, 'Unknown resource id.');
  const now = new Date().toISOString();
  const existing = q.progressOne.get(userId, itemId);
  const from = existing ? existing.status : 'todo';
  if (from === status) return false;

  if (status === 'todo') q.clearProgress.run(userId, itemId);
  else q.upsertProgress.run(userId, itemId, status, now, status === 'done' ? now : null, now);

  q.addHistory.run(userId, itemId, meta.title, meta.chapter, meta.topic, from, status, now, today());
  return true;
}

/* What the reminder scheduler needs to know about a user's course state. */
const deps = {
  appUrl: 'http://' + (HOST === '0.0.0.0' ? '127.0.0.1' : HOST) + ':' + PORT,
  statsFor: function (userId) {
    loadCourse(false);
    const map = {};
    for (const r of q.progress.all(userId).map(plain)) map[r.item_id] = { status: r.status };
    return computeStats(userId, map, getPrefs(userId));
  },
  nextUpFor: function (userId) {
    loadCourse(false);
    const prefs = getPrefs(userId);
    const map = {};
    for (const r of q.progress.all(userId).map(plain)) map[r.item_id] = r.status;
    let firstTodo = null;
    for (const entry of itemIndex) {
      const id = entry[0], meta = entry[1];
      if (!inScope(meta, prefs)) continue;
      if (map[id] === 'in_progress') return meta;
      if (!map[id] && !firstTodo) firstTodo = meta;
    }
    return firstTodo;
  },
};

function shapeNote(n) {
  return {
    id: n.id, scope: n.scope, refId: n.ref_id, refLabel: n.ref_label,
    title: n.title, body: n.body, pinned: !!n.pinned,
    tags: n.tags ? n.tags.split(',') : [],
    createdAt: n.created_at, updatedAt: n.updated_at,
  };
}

/* ---------- routes ---------- */
const routes = {
  'POST /api/auth/register': async function (req, res) {
    const b = await readBody(req);
    const user = auth.register({ email: b.email, password: b.password, displayName: b.displayName });
    const s = auth.startSession(user.id);
    q.touchLogin.run(new Date().toISOString(), user.id);
    send(res, 201, { user: auth.publicUser(plain(q.userById.get(user.id))) },
      { 'Set-Cookie': auth.cookieHeader(s.token, s.expires) });
  },

  'POST /api/auth/login': async function (req, res) {
    const b = await readBody(req);
    const user = auth.login({ email: b.email, password: b.password });
    const s = auth.startSession(user.id);
    send(res, 200, { user: auth.publicUser(user) },
      { 'Set-Cookie': auth.cookieHeader(s.token, s.expires) });
  },

  'POST /api/auth/logout': async function (req, res) {
    const u = auth.userFromRequest(req);
    if (u) q.killSession.run(u._token);
    send(res, 200, { ok: true }, { 'Set-Cookie': auth.clearCookieHeader() });
  },

  'GET /api/me': async function (req, res) {
    const u = auth.userFromRequest(req);
    send(res, 200, { user: u ? auth.publicUser(u) : null });
  },

  'PATCH /api/me': async function (req, res) {
    const u = requireUser(req);
    const b = await readBody(req);
    if (typeof b.displayName === 'string' && b.displayName.trim())
      q.renameUser.run(b.displayName.trim().slice(0, 60), u.id);
    if (b.newPassword) {
      if (!auth.verify(String(b.currentPassword || ''), u))
        throw auth.httpError(400, 'Current password is incorrect.');
      if (String(b.newPassword).length < 8)
        throw auth.httpError(400, 'New password must be at least 8 characters.');
      const salt = crypto.randomBytes(16).toString('hex');
      q.setPassword.run(auth.hash(b.newPassword, salt), salt, u.id);
      q.killUserSessions.run(u.id);
      const s = auth.startSession(u.id);
      return send(res, 200,
        { user: auth.publicUser(plain(q.userById.get(u.id))), passwordChanged: true },
        { 'Set-Cookie': auth.cookieHeader(s.token, s.expires) });
    }
    send(res, 200, { user: auth.publicUser(plain(q.userById.get(u.id))) });
  },

  'GET /api/prefs': async function (req, res) {
    const u = requireUser(req);
    send(res, 200, { prefs: getPrefs(u.id) });
  },

  'PUT /api/prefs': async function (req, res) {
    const u = requireUser(req);
    const b = await readBody(req);
    savePrefs(u.id, b);
    loadCourse(false);
    send(res, 200, progressPayload(u.id));
  },

  'GET /api/course': async function (req, res) {
    send(res, 200, loadCourse(false));
  },

  'GET /api/progress': async function (req, res) {
    const u = requireUser(req);
    loadCourse(false);
    send(res, 200, progressPayload(u.id));
  },

  'POST /api/progress': async function (req, res) {
    const u = requireUser(req);
    const b = await readBody(req);
    const status = b.status;
    if (['todo', 'in_progress', 'done'].indexOf(status) === -1) throw auth.httpError(400, 'Invalid status.');
    const ids = Array.isArray(b.itemIds) ? b.itemIds : [b.itemId];
    let changed = 0;
    for (const id of ids) if (itemIndex.has(id) && setStatus(u.id, id, status)) changed++;
    send(res, 200, Object.assign({ changed: changed }, progressPayload(u.id)));
  },

  'POST /api/progress/reset': async function (req, res) {
    const u = requireUser(req);
    const b = await readBody(req);
    if (b.confirm !== 'RESET') throw auth.httpError(400, 'Confirmation phrase required.');
    q.wipeProgress.run(u.id);
    if (b.clearHistory) q.wipeHistory.run(u.id);
    send(res, 200, progressPayload(u.id));
  },

  'GET /api/history': async function (req, res, url) {
    const u = requireUser(req);
    const limit = Math.min(Number(url.searchParams.get('limit') || 50), 500);
    const offset = Math.max(Number(url.searchParams.get('offset') || 0), 0);
    const rows = q.history.all(u.id, limit, offset).map(plain).map((r) => {
      const meta = itemIndex.get(r.item_id);
      return Object.assign({}, r, { url: meta ? meta.url : '', kind: meta ? meta.kind : '' });
    });
    send(res, 200, { events: rows, total: plain(q.historyCount.get(u.id)).n, limit: limit, offset: offset });
  },

  'GET /api/notes': async function (req, res, url) {
    const u = requireUser(req);
    const scope = url.searchParams.get('scope');
    const ref = url.searchParams.get('ref');
    const rows = (scope && ref !== null ? q.notesFor.all(u.id, scope, ref) : q.notesAll.all(u.id)).map(plain);
    send(res, 200, { notes: rows.map(shapeNote) });
  },

  'POST /api/notes': async function (req, res) {
    const u = requireUser(req);
    const b = await readBody(req);
    const now = new Date().toISOString();
    const scope = ['item', 'topic', 'free'].indexOf(b.scope) !== -1 ? b.scope : 'free';
    const title = String(b.title || '').slice(0, 200);
    const body = String(b.body || '').slice(0, 100000);
    const tags = (Array.isArray(b.tags) ? b.tags : String(b.tags || '').split(','))
      .map((s) => String(s).trim()).filter(Boolean).slice(0, 12).join(',');
    const pinned = b.pinned ? 1 : 0;
    const refId = String(b.refId || '');
    let refLabel = String(b.refLabel || '').slice(0, 200);
    if (scope === 'item' && itemIndex.has(refId)) refLabel = itemIndex.get(refId).title;

    if (b.id) {
      if (!q.noteById.get(b.id, u.id)) throw auth.httpError(404, 'Note not found.');
      q.updateNote.run(title, body, tags, pinned, refLabel, now, b.id, u.id);
      return send(res, 200, { note: shapeNote(plain(q.noteById.get(b.id, u.id))) });
    }
    const id = 'n_' + crypto.randomBytes(9).toString('base64url');
    q.insertNote.run(id, u.id, scope, refId, refLabel, title, body, tags, pinned, now, now);
    send(res, 201, { note: shapeNote(plain(q.noteById.get(id, u.id))) });
  },

  'DELETE /api/notes': async function (req, res, url) {
    const u = requireUser(req);
    const id = url.searchParams.get('id');
    if (!id) throw auth.httpError(400, 'Missing note id.');
    q.deleteNote.run(id, u.id);
    send(res, 200, { ok: true });
  },

  /* ---------- reminders ---------- */
  'GET /api/reminders': async function (req, res) {
    const u = requireUser(req);
    send(res, 200, {
      settings: reminders.getSettings(u.id, u.email),
      capabilities: config.capabilities(),
      log: q.notificationLog.all(u.id, 25).map(plain),
    });
  },

  'PUT /api/reminders': async function (req, res) {
    const u = requireUser(req);
    const b = await readBody(req);
    const settings = reminders.saveSettings(u.id, b, u.email);
    send(res, 200, { settings: settings, capabilities: config.capabilities() });
  },

  'POST /api/reminders/test': async function (req, res) {
    const u = requireUser(req);
    const b = await readBody(req);
    const channel = b.channel;
    if (['browser', 'desktop', 'email', 'whatsapp'].indexOf(channel) === -1)
      throw auth.httpError(400, 'Unknown channel.');
    // A refused delivery is a successful request with a failed result — the
    // client needs the reason and the updated log either way.
    const out = await reminders.sendTest(deps, u, channel);
    send(res, 200, {
      result: out,
      log: q.notificationLog.all(u.id, 25).map(plain),
    });
  },

  'GET /api/notifications/pending': async function (req, res) {
    const u = requireUser(req);
    send(res, 200, { alarms: q.pendingAlarms.all(u.id).map(plain) });
  },

  'POST /api/notifications/seen': async function (req, res) {
    const u = requireUser(req);
    const b = await readBody(req);
    const now = new Date().toISOString();
    if (b.id) q.seeNotification.run(now, b.id, u.id);
    else q.seeAllNotifications.run(now, u.id);
    send(res, 200, { ok: true });
  },

  'GET /api/export': async function (req, res) {
    const u = requireUser(req);
    loadCourse(false);
    const payload = {
      exportedAt: new Date().toISOString(),
      user: auth.publicUser(u),
      progress: q.progress.all(u.id).map(plain),
      history: q.history.all(u.id, 100000, 0).map(plain),
      notes: q.notesAll.all(u.id).map(plain).map(shapeNote),
    };
    send(res, 200, payload, {
      'Content-Disposition': 'attachment; filename="embedded-tracker-' + u.id + '.json"',
    });
  },
};

/* ---------- static files ---------- */
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.png': 'image/png',
};

function serveStatic(req, res, pathname) {
  const rel = pathname === '/' ? 'index.html' : pathname.replace(/^\/+/, '');
  const file = path.join(PUBLIC, rel);
  if (file.indexOf(PUBLIC) !== 0) return send(res, 403, { error: 'Forbidden' });
  fs.readFile(file, (err, buf) => {
    if (err) {
      return fs.readFile(path.join(PUBLIC, 'index.html'), (e2, html) =>
        e2 ? send(res, 404, { error: 'Not found' })
           : send(res, 200, html, { 'Content-Type': MIME['.html'] }));
    }
    send(res, 200, buf, { 'Content-Type': MIME[path.extname(file)] || 'application/octet-stream' });
  });
}

/* ---------- server ---------- */
const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://' + (req.headers.host || 'localhost'));
  const key = req.method + ' ' + url.pathname;
  try {
    if (routes[key]) return await routes[key](req, res, url);
    if (url.pathname.indexOf('/api/') === 0) return send(res, 404, { error: 'No such endpoint.' });
    if (req.method !== 'GET') return send(res, 405, { error: 'Method not allowed.' });
    serveStatic(req, res, url.pathname);
  } catch (err) {
    const status = err.status || 500;
    if (status >= 500) console.error(err);
    send(res, status, { error: err.message || 'Server error.' });
  }
});

server.listen(PORT, HOST, () => {
  config.writeExample();
  const caps = config.capabilities();
  const on = ['browser'].concat(['desktop', 'email', 'whatsapp'].filter((k) => caps[k]));
  reminders.start(deps);
  console.log('\n  Embedded Systems Learning Tracker');
  console.log('  -> http://' + HOST + ':' + PORT);
  console.log('  reminder channels ready: ' + on.join(', '));
  if (!caps.email || !caps.whatsapp)
    console.log('  (configure the rest in ' + config.FILE + ' — see config.example.json)');
  console.log('');
});
