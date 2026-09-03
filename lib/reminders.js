'use strict';
const { q, plain } = require('./db');
const config = require('./config');
const smtp = require('./smtp');
const whatsapp = require('./whatsapp');
const desktop = require('./desktop');

/* The browser reports Date.getTimezoneOffset() — minutes to ADD to local time
   to get UTC. Shifting "now" by it lets us read the user's wall clock with the
   UTC getters, with no timezone database. */
function localNow(tzOffsetMin) {
  return new Date(Date.now() - tzOffsetMin * 60000);
}
function localDayOf(d) {
  return d.getUTCFullYear() + '-' +
    String(d.getUTCMonth() + 1).padStart(2, '0') + '-' +
    String(d.getUTCDate()).padStart(2, '0');
}
function minutesOf(hhmm) {
  const m = /^(\d{1,2}):(\d{2})$/.exec(String(hhmm || '').trim());
  if (!m) return 19 * 60;
  return Math.min(23, Number(m[1])) * 60 + Math.min(59, Number(m[2]));
}

const DEFAULTS = {
  enabled: 0, at_time: '19:00', days: '1,2,3,4,5', tz_offset: 0,
  channels: 'browser', email_to: '', whatsapp_to: '',
  daily_goal: 1, skip_when_done: 1, last_fired_day: '',
};

function getSettings(userId, userEmail) {
  const row = q.reminder.get(userId);
  const r = row ? plain(row) : Object.assign({ user_id: userId }, DEFAULTS);
  return {
    enabled: !!r.enabled,
    time: r.at_time,
    days: String(r.days).split(',').filter(Boolean).map(Number),
    tzOffset: r.tz_offset,
    channels: String(r.channels).split(',').filter(Boolean),
    emailTo: r.email_to || userEmail || '',
    whatsappTo: r.whatsapp_to,
    dailyGoal: r.daily_goal,
    skipWhenDone: !!r.skip_when_done,
    lastFiredDay: r.last_fired_day,
  };
}

function saveSettings(userId, body, userEmail) {
  const days = (Array.isArray(body.days) ? body.days : String(body.days || '').split(','))
    .map(Number).filter((n) => Number.isInteger(n) && n >= 0 && n <= 6);
  const channels = (Array.isArray(body.channels) ? body.channels : String(body.channels || '').split(','))
    .map((s) => String(s).trim())
    .filter((c) => ['browser', 'desktop', 'email', 'whatsapp'].indexOf(c) !== -1);

  const t = /^(\d{1,2}):(\d{2})$/.exec(String(body.time || '').trim());
  const time = (t && Number(t[1]) <= 23 && Number(t[2]) <= 59)
    ? String(t[1]).padStart(2, '0') + ':' + t[2]
    : '19:00';

  q.upsertReminder.run(
    userId,
    body.enabled ? 1 : 0,
    time,
    (days.length ? days : [1, 2, 3, 4, 5]).join(','),
    Number.isFinite(Number(body.tzOffset)) ? Number(body.tzOffset) : 0,
    (channels.length ? channels : ['browser']).join(','),
    String(body.emailTo || userEmail || '').slice(0, 200),
    whatsapp.digits(body.whatsappTo).slice(0, 20),
    Math.max(1, Math.min(50, Number(body.dailyGoal) || 1)),
    body.skipWhenDone ? 1 : 0,
    new Date().toISOString());
  return getSettings(userId, userEmail);
}

/* ---------------- message composition ---------------- */
function compose(deps, user, settings, doneToday) {
  const stats = deps.statsFor(user.id);
  const next = deps.nextUpFor(user.id);
  const appUrl = config.load().appUrl || deps.appUrl;
  const name = (user.display_name || user.email || '').split(' ')[0];
  const short = 175;

  const streakLine = stats.streak > 0
    ? 'You are on a ' + stats.streak + '-day streak' +
      (doneToday >= settings.dailyGoal ? '.' : ' — keep it alive.')
    : 'No streak yet today. One resource starts one.';

  const goalLine = doneToday + ' of ' + settings.dailyGoal + ' done today';

  const title = doneToday >= settings.dailyGoal
    ? 'Daily goal met — ' + stats.percent + '% of the course done'
    : 'Time to study: ' + goalLine;

  const lines = [
    (name ? 'Hi ' + name + ',' : 'Hi,'),
    '',
    streakLine,
    'Progress: ' + stats.done + ' / ' + stats.total + ' resources (' + stats.percent + '%).',
    goalLine + '.',
  ];
  if (next) {
    lines.push('', 'Next up: ' + next.title + (next.chapter ? '  [' + next.chapter + ']' : ''));
    if (next.url) lines.push(next.url);
  }
  if (appUrl) lines.push('', 'Open your tracker: ' + appUrl);

  const text = lines.join('\n');

  const esc = (s) => String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const bar = Math.round(stats.percent);
  const html =
    '<div style="font-family:-apple-system,Segoe UI,Roboto,sans-serif;max-width:520px;margin:0 auto;' +
    'background:#10161d;color:#e6edf3;border-radius:14px;padding:26px">' +
      '<div style="font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#6b7f92">Embedded Systems</div>' +
      '<h2 style="margin:6px 0 14px;font-size:19px;color:#e6edf3">' + esc(title) + '</h2>' +
      '<p style="margin:0 0 16px;color:#9fb0c0;line-height:1.6">' + esc(streakLine) + '</p>' +
      '<div style="background:#222e3b;border-radius:6px;height:9px;overflow:hidden;margin-bottom:8px">' +
        '<div style="background:#35d0ba;height:100%;width:' + bar + '%"></div></div>' +
      '<div style="font-size:12px;color:#6b7f92;margin-bottom:20px">' +
        stats.done + ' / ' + stats.total + ' resources &middot; ' + stats.percent + '% &middot; ' + esc(goalLine) + '</div>' +
      (next
        ? '<div style="background:#141c25;border:1px solid #24313f;border-radius:10px;padding:14px;margin-bottom:20px">' +
            '<div style="font-size:11px;color:#6b7f92;text-transform:uppercase;letter-spacing:.06em">Next up</div>' +
            '<div style="margin-top:5px;font-size:14px">' + esc(next.title.slice(0, short)) + '</div>' +
            '<div style="margin-top:3px;font-size:11px;color:#6b7f92">' + esc(next.chapter || '') + '</div>' +
            (next.url ? '<a href="' + esc(next.url) + '" style="display:inline-block;margin-top:10px;color:#35d0ba;' +
              'font-size:13px;text-decoration:none">Open resource &rarr;</a>' : '') +
          '</div>'
        : '') +
      (appUrl ? '<a href="' + esc(appUrl) + '" style="display:inline-block;background:#35d0ba;color:#04211d;' +
        'padding:10px 18px;border-radius:8px;font-weight:600;font-size:13px;text-decoration:none">Open tracker</a>' : '') +
    '</div>';

  // WhatsApp has no HTML; keep it short and skimmable.
  const wa = [
    '*' + title + '*',
    streakLine,
    stats.done + '/' + stats.total + ' resources (' + stats.percent + '%)',
    next ? '\nNext: ' + next.title + (next.url ? '\n' + next.url : '') : '',
    appUrl ? '\n' + appUrl : '',
  ].filter(Boolean).join('\n');

  return { title: title, text: text, html: html, whatsapp: wa, stats: stats, next: next };
}

/* ---------------- delivery ---------------- */
async function deliver(deps, user, settings, channel, msg, kind) {
  const cfg = config.load();
  const now = new Date().toISOString();
  const day = localDayOf(localNow(settings.tzOffset));
  const log = (status, detail) =>
    q.addNotification.run(user.id, channel, kind || 'reminder', status,
      msg.title, channel === 'whatsapp' ? msg.whatsapp : msg.text, String(detail || ''), now, day);

  try {
    if (channel === 'browser') { log('queued', ''); return { channel, ok: true, detail: 'queued for the browser' }; }

    if (channel === 'desktop') {
      const r = await desktop.notify(msg.title, msg.text.split('\n').filter(Boolean).slice(1, 4).join(' · '));
      log('sent', r.via);
      return { channel, ok: true, detail: 'shown (' + r.via + ')' };
    }

    if (channel === 'email') {
      if (!cfg.smtp.enabled || !cfg.smtp.host) throw new Error('SMTP is not configured in data/config.json.');
      const to = settings.emailTo || user.email;
      const r = await smtp.sendMail(cfg.smtp, { to, subject: msg.title, text: msg.text, html: msg.html });
      log('sent', to + ' — ' + r.response);
      return { channel, ok: true, detail: 'sent to ' + to };
    }

    if (channel === 'whatsapp') {
      if (!cfg.whatsapp.enabled) throw new Error('WhatsApp is not configured in data/config.json.');
      const r = await whatsapp.send(cfg.whatsapp, settings.whatsappTo, msg.whatsapp);
      log('sent', r.provider + ' ' + r.id);
      return { channel, ok: true, detail: 'sent to +' + settings.whatsappTo + ' via ' + r.provider };
    }

    throw new Error('Unknown channel: ' + channel);
  } catch (e) {
    log('failed', e.message);
    return { channel, ok: false, detail: e.message };
  }
}

async function fireFor(deps, userRow, settings, doneToday, kind) {
  const msg = compose(deps, userRow, settings, doneToday);
  const results = [];
  for (const ch of settings.channels) results.push(await deliver(deps, userRow, settings, ch, msg, kind));
  return { message: msg, results };
}

async function sendTest(deps, userRow, channel) {
  const settings = getSettings(userRow.id, userRow.email);
  const day = localDayOf(localNow(settings.tzOffset));
  const doneToday = plain(q.doneOnDay.get(userRow.id, day)).n;
  const msg = compose(deps, userRow, settings, doneToday);
  msg.title = '[Test] ' + msg.title;
  return deliver(deps, userRow, settings, channel, msg, 'test');
}

/* ---------------- ticker ---------------- */
function start(deps) {
  const tick = async () => {
    let due;
    try { due = q.allReminders.all().map(plain); } catch (e) { return; }
    for (const r of due) {
      try {
        const now = localNow(r.tz_offset);
        const day = localDayOf(now);
        if (r.last_fired_day === day) continue;
        if (String(r.days).split(',').map(Number).indexOf(now.getUTCDay()) === -1) continue;
        if (now.getUTCHours() * 60 + now.getUTCMinutes() < minutesOf(r.at_time)) continue;

        const doneToday = plain(q.doneOnDay.get(r.user_id, day)).n;
        q.markFired.run(day, r.user_id);
        if (r.skip_when_done && doneToday >= r.daily_goal) continue;

        const settings = getSettings(r.user_id, r.email);
        const out = await fireFor(deps, { id: r.user_id, email: r.email, display_name: r.display_name },
          settings, doneToday, 'reminder');
        const failed = out.results.filter((x) => !x.ok);
        console.log('[reminder] ' + r.email + ' -> ' + out.results.map((x) => x.channel + (x.ok ? '' : '!')).join(',') +
          (failed.length ? '  (' + failed.map((f) => f.channel + ': ' + f.detail).join('; ') + ')' : ''));
      } catch (e) {
        console.error('[reminder] ' + r.user_id + ': ' + e.message);
      }
    }
  };
  tick();
  const handle = setInterval(tick, 60000);
  handle.unref && handle.unref();
  return { tick, stop: () => clearInterval(handle) };
}

module.exports = {
  start, getSettings, saveSettings, sendTest, fireFor, compose,
  localNow, localDayOf, minutesOf,
};
