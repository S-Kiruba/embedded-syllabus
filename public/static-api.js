/* =============================================================
   Static build: stands in for the Node server.

   The GitHub Pages build has no backend, so this implements exactly the
   endpoints app.js calls, backed by IndexedDB in the visitor's own browser.
   app.js is unchanged apart from one delegation in api() — there is no fork.
   ============================================================= */
'use strict';

(function () {
  const DB_NAME = 'cellguard-tracker';
  const STORE = 'kv';
  const PROFILE_ID = 'local';

  /* ---------- a minimal key/value store on IndexedDB ---------- */
  let dbp = null;
  function open() {
    if (dbp) return dbp;
    dbp = new Promise((resolve, reject) => {
      const req = indexedDB.open(DB_NAME, 1);
      req.onupgradeneeded = () => req.result.createObjectStore(STORE);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
    return dbp;
  }

  async function kvGet(key, fallback) {
    try {
      const db = await open();
      return await new Promise((resolve, reject) => {
        const r = db.transaction(STORE, 'readonly').objectStore(STORE).get(key);
        r.onsuccess = () => resolve(r.result === undefined ? fallback : r.result);
        r.onerror = () => reject(r.error);
      });
    } catch (e) {
      // Private mode or storage disabled: run in memory for this session.
      return fallback;
    }
  }

  async function kvSet(key, value) {
    try {
      const db = await open();
      await new Promise((resolve, reject) => {
        const t = db.transaction(STORE, 'readwrite');
        t.objectStore(STORE).put(value, key);
        t.oncomplete = resolve;
        t.onerror = () => reject(t.error);
      });
    } catch (e) { /* nothing to do; the page still works for this session */ }
    return value;
  }

  /* ---------- course data, baked in at build time ---------- */
  const course = window.__COURSE__;
  const itemIndex = new Map();
  (function indexCourse() {
    const walk = (node, chapter) => {
      for (const it of node.items) {
        itemIndex.set(it.id, Object.assign({}, it, {
          chapter: chapter,
          topic: it.path.length > 1 ? it.path[it.path.length - 1] : (it.path[0] || chapter),
        }));
      }
      node.children.forEach((c) => walk(c, chapter));
    };
    course.sections.forEach((s) => walk(s, s.title));
  })();

  /* ---------- the same shapes the server returns ---------- */
  const nowIso = () => new Date().toISOString();
  function localDay(d) {
    d = d || new Date();
    return d.getFullYear() + '-' +
      String(d.getMonth() + 1).padStart(2, '0') + '-' +
      String(d.getDate()).padStart(2, '0');
  }

  const DEFAULT_PREFS = { scope: { mode: 'core', tracks: [] } };
  const chapterKind = (t) => /^Stage /.test(t) ? 'stage' : (/^Track /.test(t) ? 'track' : 'aside');

  function inScope(meta, prefs) {
    if (prefs.scope.mode === 'all') return true;
    if (meta.alt || meta.extra) return false;
    const kind = chapterKind(meta.chapter);
    if (kind === 'stage') return true;
    if (kind === 'track') return prefs.scope.tracks.indexOf(meta.chapter) !== -1;
    return false;
  }

  function streakFrom(descDays) {
    if (!descDays.length) return 0;
    const t = localDay();
    const y = localDay(new Date(Date.now() - 864e5));
    if (descDays[0] !== t && descDays[0] !== y) return 0;
    let streak = 1, cursor = new Date(descDays[0] + 'T00:00:00');
    for (let i = 1; i < descDays.length; i++) {
      const prev = localDay(new Date(cursor.getTime() - 864e5));
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

  function computeStats(state) {
    const prefs = state.prefs;
    let total = 0, done = 0, inProgress = 0, grandTotal = 0;
    const byChapter = {};
    course.sections.forEach((s) => {
      byChapter[s.title] = { total: 0, done: 0, inProgress: 0, kind: chapterKind(s.title), counted: false };
    });
    itemIndex.forEach((meta, id) => {
      grandTotal++;
      const counted = inScope(meta, prefs);
      const c = byChapter[meta.chapter];
      if (counted) { total++; if (c) { c.total++; c.counted = true; } }
      const p = state.progress[id];
      if (!p) return;
      if (p.status === 'done') { if (counted) { done++; if (c) c.done++; } }
      else if (counted) { inProgress++; if (c) c.inProgress++; }
    });

    const dayCounts = {};
    state.history.forEach((h) => {
      if (h.to_status === 'done') dayCounts[h.day] = (dayCounts[h.day] || 0) + 1;
    });
    const activity = Object.keys(dayCounts).sort().map((d) => ({ day: d, n: dayCounts[d] }));
    const doneDays = Object.keys(dayCounts).sort().reverse();

    return {
      total: total, grandTotal: grandTotal, scope: prefs.scope,
      done: done, inProgress: inProgress, remaining: total - done,
      percent: total ? Math.round((done / total) * 1000) / 10 : 0,
      byChapter: byChapter, activity: activity,
      streak: streakFrom(doneDays),
      bestStreak: bestStreakFrom(doneDays.slice().reverse()),
      activeDays: doneDays.length,
      completedToday: dayCounts[localDay()] || 0,
      lastActivity: doneDays[0] || null,
    };
  }

  /* ---------- in-memory state, mirrored to IndexedDB ---------- */
  const state = { progress: {}, history: [], notes: [], prefs: null, reminder: null, profile: null, alarms: [] };
  let loaded = false;

  async function load() {
    if (loaded) return;
    state.progress = await kvGet('progress', {});
    state.history = await kvGet('history', []);
    state.notes = await kvGet('notes', []);
    state.prefs = await kvGet('prefs', JSON.parse(JSON.stringify(DEFAULT_PREFS)));
    state.reminder = await kvGet('reminder', null);
    state.alarms = await kvGet('alarms', []);
    state.profile = await kvGet('profile', {
      id: PROFILE_ID, email: 'local', displayName: 'You', createdAt: nowIso(), lastLoginAt: nowIso(),
    });
    loaded = true;
  }

  const persist = (key) => kvSet(key, state[key]);

  function progressPayload() {
    const noteCounts = {};
    state.notes.forEach((n) => {
      if (n.scope === 'item') noteCounts[n.refId] = (noteCounts[n.refId] || 0) + 1;
    });
    return {
      items: state.progress,
      noteCounts: noteCounts,
      prefs: state.prefs,
      stats: computeStats(state),
    };
  }

  function setStatus(itemId, status) {
    const meta = itemIndex.get(itemId);
    if (!meta) return false;
    const from = state.progress[itemId] ? state.progress[itemId].status : 'todo';
    if (from === status) return false;
    if (status === 'todo') delete state.progress[itemId];
    else {
      state.progress[itemId] = {
        status: status,
        startedAt: (state.progress[itemId] || {}).startedAt || nowIso(),
        completedAt: status === 'done' ? nowIso() : null,
      };
    }
    state.history.push({
      id: state.history.length + 1, item_id: itemId, item_title: meta.title,
      chapter: meta.chapter, topic: meta.topic, from_status: from, to_status: status,
      at: nowIso(), day: localDay(),
    });
    return true;
  }

  const DEFAULT_REMINDER = {
    enabled: false, time: '19:00', days: [1, 2, 3, 4, 5], tzOffset: new Date().getTimezoneOffset(),
    channels: ['browser'], emailTo: '', whatsappTo: '', dailyGoal: 1, skipWhenDone: true, lastFiredDay: '',
  };

  const CAPS = {
    browser: true, desktop: false, email: false, whatsapp: false, whatsappProvider: 'none',
    reasons: {
      desktop: 'Not available on the hosted site — the Windows toast needs the local server.',
      email: 'Not available on the hosted site — sending email needs a server. Run the local app for this.',
      whatsapp: 'Not available on the hosted site — WhatsApp needs a server. Run the local app for this.',
    },
    configFile: '',
  };

  function composeAlarm() {
    const st = computeStats(state);
    const r = state.reminder || DEFAULT_REMINDER;
    const doneToday = st.completedToday;
    let next = null;
    for (const entry of itemIndex) {
      const meta = entry[1];
      if (!inScope(meta, state.prefs)) continue;
      const p = state.progress[entry[0]];
      if (p && p.status === 'in_progress') { next = meta; break; }
      if (!p && !next) next = meta;
    }
    const title = doneToday >= r.dailyGoal
      ? 'Daily goal met — ' + st.percent + '% of the course done'
      : 'Time to study: ' + doneToday + ' of ' + r.dailyGoal + ' done today';
    const body = [
      st.streak > 0 ? 'You are on a ' + st.streak + '-day streak.' : 'No streak yet today. One resource starts one.',
      'Progress: ' + st.done + ' / ' + st.total + ' resources (' + st.percent + '%).',
      doneToday + ' of ' + r.dailyGoal + ' done today.',
      next ? 'Next up: ' + next.title : '',
    ].filter(Boolean).join('\n');
    return { id: Date.now(), title: title, body: body, channel: 'browser', status: 'queued',
      kind: 'reminder', detail: '', created_at: nowIso(), day: localDay(), seen_at: null };
  }

  // The server ran a ticker; here the page checks whenever it is open.
  function tickReminder() {
    const r = state.reminder;
    if (!r || !r.enabled) return;
    const now = new Date();
    const day = localDay(now);
    if (r.lastFiredDay === day) return;
    if (r.days.indexOf(now.getDay()) === -1) return;
    const m = /^(\d{1,2}):(\d{2})$/.exec(r.time || '19:00');
    const due = m ? Number(m[1]) * 60 + Number(m[2]) : 19 * 60;
    if (now.getHours() * 60 + now.getMinutes() < due) return;

    r.lastFiredDay = day;
    persist('reminder');
    const doneToday = computeStats(state).completedToday;
    if (r.skipWhenDone && doneToday >= r.dailyGoal) return;
    state.alarms.push(composeAlarm());
    persist('alarms');
  }

  /* ---------- the router ---------- */
  const ROUTES = {
    'GET /api/me': async () => ({ user: state.profile }),

    'PATCH /api/me': async (b) => {
      if (typeof b.displayName === 'string' && b.displayName.trim())
        state.profile.displayName = b.displayName.trim().slice(0, 60);
      await persist('profile');
      return { user: state.profile };
    },

    'GET /api/course': async () => course,

    'GET /api/progress': async () => progressPayload(),

    'POST /api/progress': async (b) => {
      const ids = Array.isArray(b.itemIds) ? b.itemIds : [b.itemId];
      let changed = 0;
      for (const id of ids) if (setStatus(id, b.status)) changed++;
      await persist('progress');
      await persist('history');
      return Object.assign({ changed: changed }, progressPayload());
    },

    'POST /api/progress/reset': async (b) => {
      if (b.confirm !== 'RESET') throw httpErr(400, 'Confirmation phrase required.');
      state.progress = {};
      if (b.clearHistory) state.history = [];
      await persist('progress');
      await persist('history');
      return progressPayload();
    },

    'GET /api/prefs': async () => ({ prefs: state.prefs }),

    'PUT /api/prefs': async (b) => {
      const sc = (b && b.scope) || {};
      state.prefs = {
        scope: {
          mode: sc.mode === 'all' ? 'all' : 'core',
          tracks: Array.isArray(sc.tracks) ? sc.tracks.slice(0, 12) : state.prefs.scope.tracks,
        },
      };
      await persist('prefs');
      return progressPayload();
    },

    'GET /api/history': async (b, url) => {
      const limit = Math.min(Number(url.searchParams.get('limit') || 50), 500);
      const offset = Math.max(Number(url.searchParams.get('offset') || 0), 0);
      const all = state.history.slice().reverse();
      return {
        events: all.slice(offset, offset + limit).map((e) => {
          const meta = itemIndex.get(e.item_id);
          return Object.assign({}, e, { url: meta ? meta.url : '', kind: meta ? meta.kind : '' });
        }),
        total: all.length, limit: limit, offset: offset,
      };
    },

    'GET /api/notes': async (b, url) => {
      const scope = url.searchParams.get('scope');
      const ref = url.searchParams.get('ref');
      let rows = state.notes.slice();
      if (scope && ref !== null) rows = rows.filter((n) => n.scope === scope && n.refId === ref);
      rows.sort((a, b2) => (b2.pinned - a.pinned) || (a.updatedAt < b2.updatedAt ? 1 : -1));
      return { notes: rows };
    },

    'POST /api/notes': async (b) => {
      const now = nowIso();
      const tags = (Array.isArray(b.tags) ? b.tags : String(b.tags || '').split(','))
        .map((s) => String(s).trim()).filter(Boolean).slice(0, 12);
      let refLabel = String(b.refLabel || '').slice(0, 200);
      const refId = String(b.refId || '');
      if (b.scope === 'item' && itemIndex.has(refId)) refLabel = itemIndex.get(refId).title;

      if (b.id) {
        const n = state.notes.find((x) => x.id === b.id);
        if (!n) throw httpErr(404, 'Note not found.');
        Object.assign(n, {
          title: String(b.title || '').slice(0, 200),
          body: String(b.body || '').slice(0, 100000),
          tags: tags, pinned: !!b.pinned, refLabel: refLabel, updatedAt: now,
        });
        await persist('notes');
        return { note: n };
      }
      const note = {
        id: 'n_' + Math.random().toString(36).slice(2, 11),
        scope: ['item', 'topic', 'free'].indexOf(b.scope) !== -1 ? b.scope : 'free',
        refId: refId, refLabel: refLabel,
        title: String(b.title || '').slice(0, 200),
        body: String(b.body || '').slice(0, 100000),
        tags: tags, pinned: !!b.pinned, createdAt: now, updatedAt: now,
      };
      state.notes.push(note);
      await persist('notes');
      return { note: note };
    },

    'DELETE /api/notes': async (b, url) => {
      const id = url.searchParams.get('id');
      state.notes = state.notes.filter((n) => n.id !== id);
      await persist('notes');
      return { ok: true };
    },

    'GET /api/reminders': async () => ({
      settings: state.reminder || Object.assign({}, DEFAULT_REMINDER),
      capabilities: CAPS,
      log: state.alarms.slice(-25).reverse(),
    }),

    'PUT /api/reminders': async (b) => {
      const days = (Array.isArray(b.days) ? b.days : [])
        .map(Number).filter((n) => n >= 0 && n <= 6);
      const t = /^(\d{1,2}):(\d{2})$/.exec(String(b.time || '').trim());
      state.reminder = {
        enabled: !!b.enabled,
        time: (t && Number(t[1]) <= 23 && Number(t[2]) <= 59)
          ? String(t[1]).padStart(2, '0') + ':' + t[2] : '19:00',
        days: days.length ? days : [1, 2, 3, 4, 5],
        tzOffset: new Date().getTimezoneOffset(),
        channels: ['browser'],
        emailTo: '', whatsappTo: '',
        dailyGoal: Math.max(1, Math.min(50, Number(b.dailyGoal) || 1)),
        skipWhenDone: !!b.skipWhenDone,
        lastFiredDay: (state.reminder || {}).lastFiredDay || '',
      };
      await persist('reminder');
      return { settings: state.reminder, capabilities: CAPS };
    },

    'POST /api/reminders/test': async (b) => {
      if (b.channel !== 'browser')
        return { result: { channel: b.channel, ok: false, detail: CAPS.reasons[b.channel] }, log: state.alarms.slice(-25).reverse() };
      const a = composeAlarm();
      a.title = '[Test] ' + a.title;
      a.kind = 'test';
      state.alarms.push(a);
      await persist('alarms');
      return { result: { channel: 'browser', ok: true, detail: 'queued for this browser' },
        log: state.alarms.slice(-25).reverse() };
    },

    'GET /api/notifications/pending': async () => {
      tickReminder();
      return { alarms: state.alarms.filter((a) => !a.seen_at).slice(0, 20) };
    },

    'POST /api/notifications/seen': async () => {
      const now = nowIso();
      state.alarms.forEach((a) => { if (!a.seen_at) a.seen_at = now; });
      await persist('alarms');
      return { ok: true };
    },

    'POST /api/auth/logout': async () => ({ ok: true }),
  };

  function httpErr(status, message) {
    const e = new Error(message);
    e.status = status;
    return e;
  }

  window.STATIC_MODE = true;

  window.STATIC_API = async function (path, opts) {
    opts = opts || {};
    await load();
    const url = new URL(path, location.origin);
    const key = (opts.method || 'GET') + ' ' + url.pathname;
    const fn = ROUTES[key];
    if (!fn) throw httpErr(404, 'Not available in the hosted version.');
    return fn(opts.body || {}, url);
  };

  // Export has no server to stream from, so build the file here.
  window.STATIC_EXPORT = async function () {
    await load();
    const blob = new Blob([JSON.stringify({
      exportedAt: nowIso(), user: state.profile,
      progress: state.progress, history: state.history, notes: state.notes,
      prefs: state.prefs, reminder: state.reminder,
    }, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'embedded-tracker-export.json';
    document.body.appendChild(a);
    a.click();
    setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
  };
})();
