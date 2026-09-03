/* =============================================================
   Embedded Systems Learning Tracker — client
   ============================================================= */
'use strict';

const S = {
  user: null,
  course: null,
  nodes: new Map(),      // nodeId -> node
  items: new Map(),      // itemId -> item (with chapter/topic attached)
  parent: new Map(),     // nodeId -> parent node
  progress: { items: {}, noteCounts: {}, stats: null },
  prefs: { scope: { mode: 'core', tracks: [] } },
  notes: [],
  view: 'course',
  nodeId: null,
  filter: 'all',
  coreOnly: false,
  query: '',
  noteFilter: 'all',
  noteQuery: '',
  activeNote: null,
  notePreview: false,
  historyOffset: 0,
  expanded: new Set(),
};

const $  = (s, r) => (r || document).querySelector(s);
const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const LS = {
  get: (k, d) => { try { const v = localStorage.getItem(k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } },
  set: (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} },
};

/* ---------------- api ---------------- */
async function api(path, opts) {
  opts = opts || {};
  // The GitHub Pages build has no backend; static-api.js answers the same routes.
  if (window.STATIC_API) return window.STATIC_API(path, opts);
  const res = await fetch(path, {
    method: opts.method || 'GET',
    headers: opts.body ? { 'Content-Type': 'application/json' } : undefined,
    body: opts.body ? JSON.stringify(opts.body) : undefined,
    credentials: 'same-origin',
  });
  let data = null;
  try { data = await res.json(); } catch (e) { data = {}; }
  if (!res.ok) {
    // Session expired or revoked while the app was open: drop back to the gate.
    if (res.status === 401 && S.user && path !== '/api/me') location.reload();
    const err = new Error(data.error || ('Request failed (' + res.status + ')'));
    err.status = res.status;
    throw err;
  }
  return data;
}

/* ---------------- toasts ---------------- */
function toast(msg, kind) {
  const el = document.createElement('div');
  el.className = 'toast' + (kind === 'err' ? ' err' : '');
  el.textContent = msg;
  $('#toasts').appendChild(el);
  setTimeout(() => {
    el.style.transition = 'opacity .25s, transform .25s';
    el.style.opacity = '0';
    el.style.transform = 'translateX(16px)';
    setTimeout(() => el.remove(), 260);
  }, 2600);
}

/* ---------------- theme ---------------- */
function applyTheme(t) {
  document.documentElement.setAttribute('data-theme', t);
  LS.set('es_theme', t);
  const b = $('#themeBtn');
  if (b) b.textContent = t === 'dark' ? '◑' : '◐';
}

/* =============================================================
   AUTH
   ============================================================= */
let authMode = 'login';

function setAuthMode(mode) {
  authMode = mode;
  $$('.tabs button').forEach((b) => b.classList.toggle('on', b.dataset.mode === mode));
  const reg = mode === 'register';
  $('#nameField').hidden = !reg;
  $('#authTitle').textContent = reg ? 'Create your account' : 'Welcome back';
  $('#authSub').textContent = reg
    ? 'One account per email address. Everything you tick and write is tied to it.'
    : 'Sign in to pick up your course where you left off.';
  $('#authSubmit').textContent = reg ? 'Create account' : 'Sign in';
  $('#au-pass').setAttribute('autocomplete', reg ? 'new-password' : 'current-password');
  $('#authMsg').classList.add('hidden');
}

function authMsg(text, kind) {
  const el = $('#authMsg');
  el.textContent = text;
  el.className = 'form-msg ' + (kind || 'err');
  el.classList.remove('hidden');
}

async function submitAuth(ev) {
  ev.preventDefault();
  const btn = $('#authSubmit');
  btn.disabled = true;
  const payload = {
    email: $('#au-email').value.trim(),
    password: $('#au-pass').value,
    displayName: $('#au-name').value.trim(),
  };
  try {
    const path = authMode === 'register' ? '/api/auth/register' : '/api/auth/login';
    const out = await api(path, { method: 'POST', body: payload });
    S.user = out.user;
    $('#authForm').reset();
    await boot();
  } catch (e) {
    authMsg(e.message);
  } finally {
    btn.disabled = false;
  }
}

async function logout() {
  await api('/api/auth/logout', { method: 'POST' });
  S.user = null;
  location.reload();
}

/* =============================================================
   COURSE INDEXING
   ============================================================= */
function indexCourse() {
  S.nodes.clear(); S.items.clear(); S.parent.clear();
  const walk = (node, chapter, parent) => {
    S.nodes.set(node.id, node);
    if (parent) S.parent.set(node.id, parent);
    node._chapter = chapter;
    for (const it of node.items) {
      it.chapter = chapter;
      it.nodeId = node.id;
      S.items.set(it.id, it);
    }
    for (const c of node.children) walk(c, chapter, node);
  };
  for (const s of S.course.sections) walk(s, s.title, null);
}

function descendantItems(node) {
  const out = [];
  const walk = (n) => { out.push.apply(out, n.items); n.children.forEach(walk); };
  walk(node);
  return out;
}

function nodeStats(node) {
  const items = descendantItems(node);
  let done = 0, wip = 0;
  for (const it of items) {
    const p = S.progress.items[it.id];
    if (!p) continue;
    if (p.status === 'done') done++; else wip++;
  }
  return { total: items.length, done: done, wip: wip, pct: items.length ? (done / items.length) * 100 : 0 };
}

function pathOf(nodeId) {
  const chain = [];
  let n = S.nodes.get(nodeId);
  while (n) { chain.unshift(n); n = S.parent.get(n.id); }
  return chain;
}

/* =============================================================
   SIDEBAR
   ============================================================= */
function scopeLabel() {
  const sc = (S.progress.prefs || S.prefs).scope;
  if (sc.mode === 'all') return 'counting everything';
  const n = sc.tracks.length;
  return 'core path' + (n ? ' + ' + n + ' track' + (n === 1 ? '' : 's') : ' · stages 0-6');
}

function renderSidebar() {
  const st = S.progress.stats || { percent: 0, done: 0, total: 0, streak: 0, completedToday: 0 };
  const rows = S.course.sections.map((s) => treeNodeHtml(s, 0)).join('');
  $('#sidebar').innerHTML =
    '<div class="side-progress">' +
      '<div class="row">' +
        '<div>' +
          '<div class="pct">' + st.percent + '%</div>' +
          '<div class="lbl">' + st.done + ' of ' + st.total + ' done</div>' +
        '</div>' +
        '<div class="streak">' +
          '<b>' + (st.streak || 0) + '&#128293;</b>' +
          '<div class="lbl">day streak</div>' +
        '</div>' +
      '</div>' +
      '<div class="progress-bar" style="margin-top:11px">' +
        '<i class="done" style="width:' + st.percent + '%"></i>' +
      '</div>' +
      '<button class="scope-btn" data-scope="1" title="Choose what progress counts">' +
        '&#9881; ' + scopeLabel() + '</button>' +
    '</div>' +
    '<div class="side-head">Curriculum' +
      '<span class="side-tools">' +
        '<button data-tree="expand" title="Expand all">&#9662;</button>' +
        '<button data-tree="collapse" title="Collapse all">&#9652;</button>' +
      '</span></div>' +
    '<div class="tree">' + rows + '</div>' +
    '<div class="side-head">Jump to</div>' +
    '<div class="tree"><div class="tree-node">' +
      '<button class="tree-row" data-jump="next"><span class="caret">&#9656;</span><span class="t">Continue learning</span></button>' +
      '<button class="tree-row" data-jump="wip"><span class="caret">&#9656;</span><span class="t">In progress</span>' +
        '<span class="n">' + (st.inProgress || 0) + '</span></button>' +
    '</div></div>';
}

function treeNodeHtml(node, depth) {
  const st = nodeStats(node);
  const open = S.expanded.has(node.id);
  const active = S.nodeId === node.id;
  const hasKids = node.children.length > 0;
  // The caret is a separate button: collapsing a branch must not navigate away
  // from what you are reading.
  const caret = hasKids
    ? '<button class="caret-btn' + (open ? ' open' : '') + '" data-toggle="' + node.id + '" ' +
      'aria-expanded="' + open + '" title="' + (open ? 'Collapse' : 'Expand') + ' ' +
      esc(node.title) + '">&#9656;</button>'
    : '<span class="caret-btn leaf">&#8226;</span>';

  let html =
    '<div class="tree-node">' +
      '<div class="tree-row-wrap' + (active ? ' on' : '') + '">' + caret +
        '<button class="tree-row" data-node="' + node.id + '">' +
          '<span class="t" title="' + esc(node.title) + '">' + esc(node.title) + '</span>' +
          (st.total
            ? '<span class="mini"><i style="width:' + st.pct.toFixed(0) + '%"></i></span>' +
              '<span class="n">' + st.done + '/' + st.total + '</span>'
            : '') +
        '</button>' +
      '</div>';
  if (hasKids && open) {
    html += '<div class="tree-kids">' + node.children.map((c) => treeNodeHtml(c, depth + 1)).join('') + '</div>';
  }
  return html + '</div>';
}

/* =============================================================
   COURSE VIEW
   ============================================================= */
const KIND_ICON = {
  Video: '▶', Playlist: '☰', Article: '☰', PDF: '☷', Blog: '☰',
  eBook: '☷', Textbook: '☷', Book: '☷', Website: '☁', Link: '☁', Project: '🎯', Gate: '✓',
};

function renderCourse() {
  const host = $('#view-course');

  if (S.query.trim()) return renderSearch(host);

  const node = S.nodes.get(S.nodeId) || S.course.sections[0];
  S.nodeId = node.id;
  const chain = pathOf(node.id);
  const st = nodeStats(node);
  const ids = descendantItems(node).map((i) => i.id);

  const head =
    '<div class="crumbs">' +
      chain.map((n, i) =>
        (i ? '<span>&rsaquo;</span>' : '') +
        '<b data-node="' + n.id + '" style="cursor:pointer">' + esc(n.title) + '</b>').join('') +
    '</div>' +
    '<div class="view-head">' +
      '<div>' +
        '<h1>' + esc(node.title) + '</h1>' +
        (node.blurb ? '<p class="blurb">' + esc(node.blurb) + '</p>' : '') +
        '<div class="meta">' + st.done + ' of ' + st.total + ' resources complete' +
          (st.wip ? ' &middot; <span style="color:var(--amber)">' + st.wip + ' in progress</span>' : '') +
          ' &middot; ' + node.children.length + ' sub-topic' + (node.children.length === 1 ? '' : 's') +
        '</div>' +
      '</div>' +
      '<div class="spacer"></div>' +
      '<div style="min-width:190px">' +
        '<div class="progress-bar">' +
          '<i class="done" style="width:' + st.pct.toFixed(1) + '%"></i>' +
          '<i class="wip" style="width:' + (st.total ? (st.wip / st.total) * 100 : 0).toFixed(1) + '%"></i>' +
        '</div>' +
        '<div style="text-align:right;font-size:11px;color:var(--text-3);margin-top:5px">' +
          st.pct.toFixed(0) + '% complete</div>' +
      '</div>' +
    '</div>' +
    '<div class="toolbar">' +
      '<div class="seg">' +
        ['all', 'todo', 'in_progress', 'done'].map((f) =>
          '<button data-filter="' + f + '"' + (S.filter === f ? ' class="on"' : '') + '>' +
          ({ all: 'All', todo: 'Not started', in_progress: 'In progress', done: 'Done' })[f] + '</button>').join('') +
      '</div>' +
      '<button class="btn sm' + (S.coreOnly ? ' primary' : '') + '" data-coreonly="1" ' +
        'title="Show only the course itself - hide alternatives (same lesson, different ' +
        'teacher) and optional depth">' +
        (S.coreOnly ? '&#9679; Core path' : '&#9675; Core path') + '</button>' +
      '<div class="spacer" style="flex:1"></div>' +
      '<button class="btn sm" data-bulk="done">&#10003; Mark all done</button>' +
      '<button class="btn sm" data-bulk="todo">&#8635; Reset topic</button>' +
    '</div>';

  const blocks = [];
  const walk = (n, depth) => {
    const list = filterItems(n.items);
    if (list.length) {
      const s = { total: n.items.length, done: n.items.filter((i) => isDone(i.id)).length };
      blocks.push(
        '<section class="topic" id="t-' + n.id + '">' +
          '<div class="topic-head">' +
            '<h2>' + esc(n.title) +
              (depth > 1
                ? '<span class="depth"> &nbsp;in ' +
                  esc(n.path.slice(node.path.length, -1).join(' › ')) + '</span>'
                : '') + '</h2>' +
            '<div class="spacer"></div>' +
            '<span class="frac">' + s.done + '/' + s.total + '</span>' +
          '</div>' +
          (n.blurb ? '<p class="blurb topic-blurb">' + esc(n.blurb) + '</p>' : '') +
          (n.brief ? '<div class="brief md-preview">' + MD.render(n.brief) + '</div>' : '') +
          '<div class="cards">' + list.map(cardHtml).join('') + '</div>' +
        '</section>');
    }
    n.children.forEach((c) => walk(c, depth + 1));
  };
  walk(node, 0);

  const body = blocks.length ? blocks.join('') : emptyHtml(
    '&#9744;', 'Nothing matches this filter',
    'Switch the filter back to “All” to see every resource in this topic.');

  host.innerHTML = head + body;
  host.dataset.ids = ids.join(',');
}

function isDone(id) { const p = S.progress.items[id]; return p && p.status === 'done'; }
function statusOf(id) { const p = S.progress.items[id]; return p ? p.status : 'todo'; }

function filterItems(items) {
  let out = items;
  // The core path is the course. [alt] is the same lesson from a different teacher,
  // [extra] is optional depth — neither belongs in a first pass.
  if (S.coreOnly) out = out.filter((i) => i.core !== false);
  if (S.filter !== 'all') out = out.filter((i) => statusOf(i.id) === S.filter);
  return out;
}

function cardHtml(item) {
  const st = statusOf(item.id);
  const noteN = S.progress.noteCounts[item.id] || 0;
  const isProject = item.kind === 'Project' || item.kind === 'Gate';
  const cls = ['card',
    st === 'done' ? 'done' : (st === 'in_progress' ? 'wip' : ''),
    isProject ? 'gate' : '',
    item.alt ? 'alt' : '',
    item.extra ? 'extra' : ''].filter(Boolean).join(' ');

  const thumb = isProject
    ? '<div class="thumb ph gate-ico">' + (item.kind === 'Gate' ? '&#10003;' : '&#127919;') + '</div>'
    : (item.videoId
      ? '<img class="thumb" loading="lazy" src="https://i.ytimg.com/vi/' + esc(item.videoId) + '/mqdefault.jpg" alt="">'
      : '<div class="thumb ph">' + (KIND_ICON[item.kind] || '☁') + '</div>');

  const title = item.url
    ? '<a class="card-title" href="' + esc(item.url) + '" target="_blank" rel="noopener">' + esc(item.title) + '</a>'
    : '<span class="card-title">' + esc(item.title) + '</span>';

  const tickGlyph = st === 'done' ? '&#10003;' : (st === 'in_progress' ? '&#9679;' : '');
  return '' +
    '<article class="' + cls + '" data-item="' + item.id + '">' +
      '<button class="tick ' + (st === 'done' ? 'done' : st === 'in_progress' ? 'wip' : '') + '" data-tick="' + item.id + '" ' +
        'title="Click to cycle: not started &rarr; in progress &rarr; done">' + tickGlyph + '</button>' +
      thumb +
      '<div class="card-body">' + title +
        '<div class="card-sub">' +
          '<span class="chip ' + (isProject ? 'amber' : (item.kind === 'Video' || item.kind === 'Playlist' ? 'accent' : 'violet')) + '">' +
            (KIND_ICON[item.kind] || '☁') + ' ' +
            esc(item.kind === 'Gate' ? 'Gate criterion' : (isProject ? 'Project gate' : item.kind)) + '</span>' +
          (item.level === 'beginner' ? '<span class="chip accent">start here</span>' : '') +
          (item.level === 'reference' ? '<span class="chip violet">deep reference</span>' : '') +
          (item.alt ? '<span class="chip amber" title="Covers the same ground as an item above ' +
            'it - pick one, skip the rest">&#8646; alternative</span>' : '') +
          (item.extra ? '<span class="chip">extra</span>' : '') +
          (item.optionalPaid ? '<span class="chip amber">optional &middot; paid</span>' : '') +
          (item.source ? '<span class="dot">&middot;</span><span>' + esc(item.source) + '</span>' : '') +
          (st === 'done' && S.progress.items[item.id].completedAt
            ? '<span class="dot">&middot;</span><span>done ' + relTime(S.progress.items[item.id].completedAt) + '</span>' : '') +
        '</div>' +
      '</div>' +
      '<div class="card-acts">' +
        '<button class="icon-btn' + (noteN ? ' has-note' : '') + '" data-note="' + item.id + '" ' +
          'title="' + (noteN ? noteN + ' note(s)' : 'Add a note') + '">&#9998;</button>' +
        (item.url ? '<a class="icon-btn" href="' + esc(item.url) + '" target="_blank" rel="noopener" title="Open resource">&#8599;</a>' : '') +
      '</div>' +
    '</article>';
}

function renderSearch(host) {
  const qq = S.query.trim().toLowerCase();
  const hits = [];
  for (const it of S.items.values()) {
    const hay = (it.title + ' ' + it.source + ' ' + it.kind + ' ' + it.path.join(' ') + ' ' + it.chapter).toLowerCase();
    if (hay.indexOf(qq) !== -1) hits.push(it);
  }
  const noteHits = S.notes.filter((n) =>
    (n.title + ' ' + n.body + ' ' + n.refLabel + ' ' + n.tags.join(' ')).toLowerCase().indexOf(qq) !== -1);

  host.innerHTML =
    '<div class="view-head"><div><h1>Search</h1>' +
      '<div class="meta">' + hits.length + ' resource' + (hits.length === 1 ? '' : 's') +
      ' and ' + noteHits.length + ' note' + (noteHits.length === 1 ? '' : 's') +
      ' matching &ldquo;' + esc(S.query) + '&rdquo;</div></div>' +
      '<div class="spacer"></div><button class="btn sm" id="clearSearch">Clear</button></div>' +
    (hits.length
      ? '<div class="cards">' + hits.slice(0, 200).map((it) =>
          cardHtml(it).replace('<div class="card-sub">',
            '<div class="card-sub"><span style="color:var(--text-3)">' +
            esc(it.chapter) + ' &rsaquo; ' + esc(it.path[it.path.length - 1] || '') +
            '</span><span class="dot">&middot;</span>')).join('') + '</div>'
      : emptyHtml('&#9906;', 'No resources found', 'Try a shorter or different search term.')) +
    (noteHits.length
      ? '<h3 style="margin:26px 0 12px;font-size:13px">Notes</h3>' +
        noteHits.map((n) =>
          '<div class="event" data-opennote="' + n.id + '" style="cursor:pointer">' +
            '<span class="bullet done"></span>' +
            '<div class="txt"><b>' + esc(n.title || 'Untitled note') + '</b>' +
            '<div>' + esc(n.body.slice(0, 130)) + '</div></div>' +
            '<span class="when">' + relTime(n.updatedAt) + '</span>' +
          '</div>').join('')
      : '');
}

function emptyHtml(icon, title, text) {
  return '<div class="empty"><div class="big">' + icon + '</div><h3>' + title + '</h3><p>' + text + '</p></div>';
}

/* =============================================================
   DASHBOARD
   ============================================================= */
function renderDashboard() {
  const st = S.progress.stats;
  if (!st) return;
  const R = 40, C = 2 * Math.PI * R;
  const off = C * (1 - st.percent / 100);

  const chapterRows = S.course.sections.filter((s) => {
    const c = st.byChapter[s.title];
    return c && c.total > 0;
  }).map((s) => {
    const c = st.byChapter[s.title] || { total: 0, done: 0, inProgress: 0 };
    const pct = c.total ? (c.done / c.total) * 100 : 0;
    const wpct = c.total ? (c.inProgress / c.total) * 100 : 0;
    return '<div class="chapter-row" data-node="' + s.id + '">' +
      '<div><div class="cr-name">' + esc(s.title) + '</div>' +
        '<div class="progress-bar"><i class="done" style="width:' + pct.toFixed(1) + '%"></i>' +
        '<i class="wip" style="width:' + wpct.toFixed(1) + '%"></i></div></div>' +
      '<div class="cr-num">' + c.done + ' / ' + c.total + '</div></div>';
  }).join('');

  const next = nextUp();

  $('#view-dashboard').innerHTML =
    '<div class="view-head"><div><h1>Dashboard</h1>' +
      '<div class="meta">Signed in as ' + esc(S.user.email) + '</div></div></div>' +

    '<div class="grid-stats">' +
      '<div class="stat hero">' +
        '<div class="ring"><svg width="92" height="92">' +
          '<circle class="track" cx="46" cy="46" r="' + R + '" fill="none" stroke-width="8"/>' +
          '<circle class="fill" cx="46" cy="46" r="' + R + '" fill="none" stroke-width="8" ' +
            'stroke-dasharray="' + C.toFixed(1) + '" stroke-dashoffset="' + off.toFixed(1) + '"/>' +
        '</svg><div class="lbl">' + st.percent + '%</div></div>' +
        '<div><div class="k">Overall progress</div>' +
          '<div class="v">' + st.done + '<small> / ' + st.total + '</small></div>' +
          '<div class="d">' + st.remaining + ' remaining &middot; ' + scopeLabel() + '</div></div>' +
      '</div>' +
      statTile('Current streak', st.streak + ' 🔥', 'Best: ' + st.bestStreak + ' day' + (st.bestStreak === 1 ? '' : 's')) +
      statTile('Completed today', String(st.completedToday), st.completedToday ? 'Keep going.' : 'Nothing yet today.') +
      statTile('In progress', String(st.inProgress), 'Started but not finished') +
      statTile('Active days', String(st.activeDays), st.lastActivity ? 'Last: ' + st.lastActivity : 'No activity yet') +
    '</div>' +

    (next
      ? '<div class="panel"><h3>&#9654; Continue where you left off<span class="spacer"></span>' +
          '<small>' + esc(next.chapter) + '</small></h3>' +
          '<div class="cards">' + cardHtml(next) + '</div></div>'
      : '') +

    '<div class="panel"><h3>&#128200; Activity<span class="spacer"></span>' +
      '<small>completions over the last 26 weeks</small></h3>' + heatHtml(st.activity) + '</div>' +

    '<div class="panel"><h3>&#9635; Progress by chapter</h3>' + chapterRows + '</div>';
}

function statTile(k, v, d) {
  return '<div class="stat"><div class="k">' + k + '</div><div class="v">' + v + '</div><div class="d">' + esc(d) + '</div></div>';
}

function nextUp() {
  const wip = [];
  for (const it of S.items.values()) if (statusOf(it.id) === 'in_progress') wip.push(it);
  if (wip.length) return wip[0];
  for (const s of S.course.sections) {
    for (const it of descendantItems(s)) if (statusOf(it.id) === 'todo') return it;
  }
  return null;
}

// Local-calendar YYYY-MM-DD, matching the day buckets the server writes.
function dayKey(d) {
  return d.getFullYear() + '-' +
    String(d.getMonth() + 1).padStart(2, '0') + '-' +
    String(d.getDate()).padStart(2, '0');
}

function heatHtml(activity) {
  const byDay = {};
  (activity || []).forEach((a) => { byDay[a.day] = a.n; });
  const days = 182;
  const end = new Date(); end.setHours(12, 0, 0, 0);
  const start = new Date(end.getTime() - (days - 1) * 864e5);
  start.setDate(start.getDate() - start.getDay());

  const cols = [];
  let cur = new Date(start);
  while (cur <= end) {
    const cells = [];
    for (let d = 0; d < 7; d++) {
      const key = dayKey(cur);
      const n = byDay[key] || 0;
      const lvl = n === 0 ? 0 : n < 2 ? 1 : n < 4 ? 2 : n < 7 ? 3 : 4;
      cells.push(cur > end
        ? '<div class="heat-cell" style="visibility:hidden"></div>'
        : '<div class="heat-cell" data-l="' + lvl + '" title="' + key + ': ' + n + ' completed"></div>');
      cur = new Date(cur.getTime() + 864e5);
    }
    cols.push('<div class="heat-col">' + cells.join('') + '</div>');
  }
  return '<div class="heat">' + cols.join('') + '</div>' +
    '<div class="heat-legend">Less' +
      [0, 1, 2, 3, 4].map((l) => '<div class="heat-cell" data-l="' + l + '"></div>').join('') +
    'More</div>';
}

/* =============================================================
   HISTORY
   ============================================================= */
async function renderHistory() {
  const host = $('#view-history');
  host.innerHTML = '<div class="empty"><p>Loading history&hellip;</p></div>';
  const out = await api('/api/history?limit=100&offset=' + S.historyOffset);

  if (!out.events.length) {
    host.innerHTML = '<div class="view-head"><div><h1>History</h1>' +
      '<div class="meta">Every status change you make is recorded here.</div></div></div>' +
      emptyHtml('&#8635;', 'No history yet', 'Tick your first resource in the Course tab and it will show up here.');
    return;
  }

  const groups = {};
  out.events.forEach((e) => { (groups[e.day] = groups[e.day] || []).push(e); });

  const label = { done: 'Completed', in_progress: 'Started', todo: 'Reset' };
  const body = Object.keys(groups).sort().reverse().map((day) =>
    '<div class="day-group"><div class="day-label">' + dayLabel(day) +
      ' &middot; ' + groups[day].length + ' change' + (groups[day].length === 1 ? '' : 's') + '</div>' +
      groups[day].map((e) =>
        '<div class="event">' +
          '<span class="bullet ' + e.to_status + '"></span>' +
          '<div class="txt"><b>' + esc(e.item_title) + '</b>' +
            '<div>' + label[e.to_status] + ' &middot; ' + esc(e.chapter) +
            (e.topic && e.topic !== e.chapter ? ' &rsaquo; ' + esc(e.topic) : '') + '</div></div>' +
          '<span class="when">' + new Date(e.at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + '</span>' +
        '</div>').join('') +
    '</div>').join('');

  const more = out.total > S.historyOffset + out.events.length;
  host.innerHTML =
    '<div class="view-head"><div><h1>History</h1>' +
      '<div class="meta">' + out.total + ' recorded change' + (out.total === 1 ? '' : 's') +
      ' &middot; showing ' + (S.historyOffset + 1) + '&ndash;' + (S.historyOffset + out.events.length) + '</div></div>' +
      '<div class="spacer"></div>' +
      (S.historyOffset ? '<button class="btn sm" data-hist="prev">&larr; Newer</button>' : '') +
      (more ? '<button class="btn sm" data-hist="next">Older &rarr;</button>' : '') +
    '</div>' + body;
}

function dayLabel(day) {
  const d = new Date(day + 'T00:00:00');
  const t = new Date(); t.setHours(0, 0, 0, 0);
  const diff = Math.round((t - d) / 864e5);
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Yesterday';
  return d.toLocaleDateString([], { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
}

function relTime(iso) {
  if (!iso) return '';
  const s = (Date.now() - new Date(iso).getTime()) / 1000;
  if (s < 60) return 'just now';
  if (s < 3600) return Math.floor(s / 60) + 'm ago';
  if (s < 86400) return Math.floor(s / 3600) + 'h ago';
  if (s < 2592000) return Math.floor(s / 86400) + 'd ago';
  return new Date(iso).toLocaleDateString();
}

/* =============================================================
   NOTES
   ============================================================= */
function visibleNotes() {
  const q = S.noteQuery.trim().toLowerCase();
  return S.notes.filter((n) => {
    if (S.noteFilter === 'pinned' && !n.pinned) return false;
    if (S.noteFilter === 'linked' && n.scope !== 'item') return false;
    if (S.noteFilter === 'free' && n.scope !== 'free') return false;
    if (!q) return true;
    return (n.title + ' ' + n.body + ' ' + n.refLabel + ' ' + n.tags.join(' ')).toLowerCase().indexOf(q) !== -1;
  });
}

function renderNotes() {
  const list = visibleNotes();
  const n = S.activeNote;

  const listHtml = list.length ? list.map((x) =>
    '<div class="note-item' + (n && n.id === x.id ? ' on' : '') + '" data-opennote="' + x.id + '">' +
      '<div class="nt">' + (x.pinned ? '<span class="pin">&#9733;</span>' : '') +
        esc(x.title || 'Untitled note') + '</div>' +
      (x.body ? '<div class="nb">' + esc(x.body.slice(0, 160)) + '</div>' : '') +
      '<div class="nm">' +
        (x.scope === 'item' ? '<span class="chip accent">&#128279; ' + esc(x.refLabel.slice(0, 34)) + '</span>' : '<span class="chip">Standalone</span>') +
        x.tags.map((t) => '<span class="chip violet">#' + esc(t) + '</span>').join('') +
        '<span>' + relTime(x.updatedAt) + '</span>' +
      '</div>' +
    '</div>').join('')
    : '<div class="empty" style="padding:34px 12px"><p>No notes here yet.</p></div>';

  const editor = n
    ? '<div class="editor">' +
        '<div class="ed-head">' +
          (n.scope === 'item'
            ? '<span class="chip accent">&#128279; ' + esc(n.refLabel) + '</span>'
            : '<span class="chip">Standalone note</span>') +
          '<div class="spacer"></div>' +
          '<div class="seg"><button data-edmode="write"' + (S.notePreview ? '' : ' class="on"') + '>Write</button>' +
            '<button data-edmode="preview"' + (S.notePreview ? ' class="on"' : '') + '>Preview</button></div>' +
          '<button class="btn sm ghost" data-noteact="pin">' + (n.pinned ? '&#9733; Pinned' : '&#9734; Pin') + '</button>' +
          '<button class="btn sm danger" data-noteact="delete">Delete</button>' +
        '</div>' +
        '<div class="field"><input class="input" id="nTitle" placeholder="Note title" value="' + esc(n.title) + '"></div>' +
        (S.notePreview
          ? '<div class="md-preview">' + (n.body.trim()
              ? MD.render(n.body)
              : '<p style="color:var(--text-3)">Nothing written yet.</p>') + '</div>'
          : '<div class="field"><textarea class="input" id="nBody" placeholder="Markdown works here. Fence code with ``` for highlighted C:&#10;&#10;```c&#10;TIMER_A0->CTL |= TIMER_A_CTL_CLR;&#10;```">' + esc(n.body) + '</textarea></div>') +
        '<div class="field"><input class="input" id="nTags" placeholder="tags, comma separated" value="' + esc(n.tags.join(', ')) + '"></div>' +
        '<div class="ed-foot">' +
          '<span class="saved-tag" id="savedTag">Last saved ' + relTime(n.updatedAt) + '</span>' +
          '<div class="spacer"></div>' +
          '<button class="btn primary" data-noteact="save">Save note</button>' +
        '</div>' +
      '</div>'
    : '<div class="editor">' + emptyHtml('&#9998;', 'Your notebook',
        'Pick a note on the left, or hit “New note”. You can also attach a note to any resource from the Course tab.') + '</div>';

  $('#view-notes').innerHTML =
    '<div class="view-head"><div><h1>Notes</h1>' +
      '<div class="meta">' + S.notes.length + ' note' + (S.notes.length === 1 ? '' : 's') +
      ' &middot; ' + S.notes.filter((x) => x.scope === 'item').length + ' linked to a resource</div></div>' +
      '<div class="spacer"></div>' +
      '<button class="btn primary" id="newNote">+ New note</button>' +
    '</div>' +
    '<div class="toolbar">' +
      '<div class="seg">' +
        ['all', 'pinned', 'linked', 'free'].map((f) =>
          '<button data-nfilter="' + f + '"' + (S.noteFilter === f ? ' class="on"' : '') + '>' +
          ({ all: 'All', pinned: 'Pinned', linked: 'Linked', free: 'Standalone' })[f] + '</button>').join('') +
      '</div>' +
      '<input class="input" id="noteSearch" style="max-width:260px" placeholder="Filter notes&hellip;" value="' + esc(S.noteQuery) + '">' +
    '</div>' +
    '<div class="notes-layout"><div class="notes-list">' + listHtml + '</div>' + editor + '</div>';
}

async function saveActiveNote(silent) {
  const n = S.activeNote;
  if (!n) return;
  const payload = {
    id: n.id, scope: n.scope, refId: n.refId, refLabel: n.refLabel,
    title: ($('#nTitle') || {}).value != null ? $('#nTitle').value : n.title,
    body: ($('#nBody') || {}).value != null ? $('#nBody').value : n.body,   // preview mode: keep n.body
    tags: ($('#nTags') || {}).value != null ? $('#nTags').value : n.tags.join(','),
    pinned: n.pinned,
  };
  const out = await api('/api/notes', { method: 'POST', body: payload });
  S.activeNote = out.note;
  await loadNotes();
  if (!silent) toast('Note saved');
}

async function loadNotes() {
  const out = await api('/api/notes');
  S.notes = out.notes;
  $('#noteCount').textContent = S.notes.length;
  if (S.view === 'notes') renderNotes();
}

/* =============================================================
   COMMAND PALETTE
   ============================================================= */
let paletteIdx = 0, paletteRows = [];

function paletteSearch(q) {
  q = q.trim().toLowerCase();
  const rows = [];
  const push = (r) => { if (rows.length < 60) rows.push(r); };

  const hit = (hay) => {
    if (!q) return 0;
    const h = hay.toLowerCase();
    const i = h.indexOf(q);
    if (i === -1) return -1;
    return i === 0 ? 2 : 1;              // prefix beats a mid-string match
  };

  const scored = [];
  for (const node of S.nodes.values()) {
    const sc = hit(node.title);
    if (q && sc < 0) continue;
    scored.push({ score: sc + 3, kind: 'topic', title: node.title,
      sub: node.path.slice(0, -1).join(' › ') || 'chapter', nodeId: node.id });
  }
  for (const it of S.items.values()) {
    const sc = Math.max(hit(it.title), hit(it.source || ''));
    if (q && sc < 0) continue;
    scored.push({ score: sc, kind: it.kind === 'Gate' || it.kind === 'Project' ? 'gate' : 'resource',
      title: it.title, sub: it.chapter + (it.path.length ? ' › ' + it.path[it.path.length - 1] : ''),
      url: it.url, nodeId: it.nodeId, itemId: it.id });
  }
  for (const n of S.notes) {
    const sc = Math.max(hit(n.title), hit(n.body));
    if (q && sc < 0) continue;
    scored.push({ score: sc + 1, kind: 'note', title: n.title || 'Untitled note',
      sub: n.scope === 'item' ? n.refLabel : 'standalone note', noteId: n.id });
  }

  scored.sort((a, b) => b.score - a.score || a.title.length - b.title.length);
  scored.forEach(push);
  return rows;
}

const PAL_ICON = { topic: '&#9635;', resource: '&#9656;', gate: '&#127919;', note: '&#9998;' };

function drawPalette(q) {
  paletteRows = paletteSearch(q);
  if (paletteIdx >= paletteRows.length) paletteIdx = 0;
  const list = paletteRows.length
    ? paletteRows.map((r, i) =>
        '<div class="pal-row' + (i === paletteIdx ? ' on' : '') + '" data-pal="' + i + '">' +
          '<span class="pal-ico">' + (PAL_ICON[r.kind] || '') + '</span>' +
          '<span class="pal-t">' + esc(r.title) + '</span>' +
          '<span class="pal-s">' + esc(r.sub || '') + '</span>' +
        '</div>').join('')
    : '<div class="pal-empty">Nothing matches.</div>';
  const box = $('#palList');
  if (box) {
    box.innerHTML = list;
    const on = box.querySelector('.pal-row.on');
    if (on) on.scrollIntoView({ block: 'nearest' });
  }
}

function openPalette() {
  paletteIdx = 0;
  $('#overlayRoot').innerHTML =
    '<div class="overlay pal-overlay" data-overlay><div class="palette">' +
      '<input id="palInput" placeholder="Jump to a stage, topic, resource or note\u2026" autocomplete="off">' +
      '<div id="palList" class="pal-list"></div>' +
      '<div class="pal-foot"><span><kbd>&uarr;</kbd><kbd>&darr;</kbd> move</span>' +
        '<span><kbd>&crarr;</kbd> open</span><span><kbd>esc</kbd> close</span></div>' +
    '</div></div>';
  drawPalette('');
  const input = $('#palInput');
  input.focus();
  input.addEventListener('input', () => { paletteIdx = 0; drawPalette(input.value); });
  input.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); paletteIdx = Math.min(paletteIdx + 1, paletteRows.length - 1); drawPalette(input.value); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); paletteIdx = Math.max(paletteIdx - 1, 0); drawPalette(input.value); }
    else if (e.key === 'Enter') { e.preventDefault(); runPalette(paletteRows[paletteIdx]); }
  });
  $('#palList').addEventListener('click', (e) => {
    const row = e.target.closest('[data-pal]');
    if (row) runPalette(paletteRows[Number(row.dataset.pal)]);
  });
}

function runPalette(row) {
  if (!row) return;
  closeModal();
  if (row.kind === 'note') {
    S.activeNote = S.notes.find((n) => n.id === row.noteId) || null;
    return setView('notes');
  }
  S.query = ''; $('#search').value = '';
  selectNode(row.nodeId);
  if (row.itemId) {
    // Land on the item, not just its topic.
    setTimeout(() => {
      const el = document.querySelector('.card[data-item="' + row.itemId + '"]');
      if (el) { el.scrollIntoView({ block: 'center', behavior: 'smooth' }); el.classList.add('flash'); }
    }, 120);
  }
}

/* =============================================================
   MODALS
   ============================================================= */
function closeModal() { $('#overlayRoot').innerHTML = ''; }

function openModal(html) {
  $('#overlayRoot').innerHTML = '<div class="overlay" data-overlay><div class="modal">' + html + '</div></div>';
}

async function openItemNote(itemId) {
  const item = S.items.get(itemId);
  const out = await api('/api/notes?scope=item&ref=' + encodeURIComponent(itemId));
  const existing = out.notes[0];
  openModal(
    '<h2>Note</h2>' +
    '<p class="sub">' + esc(item.chapter) + ' &rsaquo; ' + esc(item.title) + '</p>' +
    '<div class="field"><label>Title</label>' +
      '<input class="input" id="mTitle" value="' + esc(existing ? existing.title : item.title) + '"></div>' +
    '<div class="field"><label>Note <span style="font-weight:400;color:var(--text-3)">' +
      '&middot; markdown, ``` for code</span>' +
      '<button type="button" class="btn sm ghost" id="mPrev" style="float:right;padding:2px 8px">Preview</button>' +
      '</label>' +
      '<textarea class="input" id="mBody" style="min-height:200px" placeholder="What did you learn? Anything to revisit?">' +
      esc(existing ? existing.body : '') + '</textarea>' +
      '<div class="md-preview hidden" id="mPrevBox"></div></div>' +
    '<div class="field"><label>Tags</label>' +
      '<input class="input" id="mTags" placeholder="msp430, i2c" value="' + esc(existing ? existing.tags.join(', ') : '') + '"></div>' +
    '<div class="modal-foot">' +
      (existing ? '<button class="btn danger" id="mDel">Delete</button>' : '') +
      '<div style="flex:1"></div>' +
      '<button class="btn" data-close>Cancel</button>' +
      '<button class="btn primary" id="mSave">Save note</button>' +
    '</div>');

  $('#mPrev').onclick = () => {
    const box = $('#mPrevBox'), ta = $('#mBody');
    const showing = !box.classList.contains('hidden');
    if (showing) { box.classList.add('hidden'); ta.classList.remove('hidden'); $('#mPrev').textContent = 'Preview'; }
    else {
      box.innerHTML = ta.value.trim() ? MD.render(ta.value)
        : '<p style="color:var(--text-3)">Nothing written yet.</p>';
      box.classList.remove('hidden'); ta.classList.add('hidden'); $('#mPrev').textContent = 'Write';
    }
  };

  $('#mSave').onclick = async () => {
    await api('/api/notes', { method: 'POST', body: {
      id: existing ? existing.id : undefined,
      scope: 'item', refId: itemId, refLabel: item.title,
      title: $('#mTitle').value, body: $('#mBody').value, tags: $('#mTags').value,
    } });
    closeModal();
    await refreshProgress();
    await loadNotes();
    renderAll();
    toast('Note saved');
  };
  if (existing) $('#mDel').onclick = async () => {
    await api('/api/notes?id=' + existing.id, { method: 'DELETE' });
    closeModal();
    await refreshProgress();
    await loadNotes();
    renderAll();
    toast('Note deleted');
  };
}

/* =============================================================
   REMINDERS + ALARMS
   ============================================================= */
const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const CHANNELS = [
  { key: 'browser',  name: 'In-app alarm',    hint: 'Pops up here, with a chime and a desktop notification. Needs the tracker open in a tab.' },
  { key: 'desktop',  name: 'Windows toast',   hint: 'Fired by the server, so it reaches you even with the browser closed.' },
  { key: 'email',    name: 'Email',           hint: 'Sent over SMTP from the server.' },
  { key: 'whatsapp', name: 'WhatsApp',        hint: 'Sent via the WhatsApp Cloud API or Twilio.' },
];

let remState = null;

async function openReminders() {
  const data = await api('/api/reminders');
  remState = data.settings;
  remState._caps = data.capabilities;
  remState._log = data.log;
  remState.tzOffset = new Date().getTimezoneOffset();
  drawReminders();
}

function drawReminders() {
  const s = remState, caps = s._caps;
  const tzName = Intl.DateTimeFormat().resolvedOptions().timeZone || 'local time';

  const channelRows = CHANNELS.map((c) => {
    const usable = caps[c.key];
    const on = s.channels.indexOf(c.key) !== -1;
    const why = usable ? c.hint
      : ((caps.reasons || {})[c.key] || 'Not configured yet — see config.example.json.');
    return '<label class="chan' + (usable ? '' : ' off') + '">' +
      '<input type="checkbox" data-chan="' + c.key + '"' + (on ? ' checked' : '') + (usable ? '' : ' disabled') + '>' +
      '<span class="ci"><b>' + c.name + (c.key === 'whatsapp' && usable ? ' <span class="chip accent">' +
        esc(caps.whatsappProvider) + '</span>' : '') + '</b><span>' + esc(why) + '</span></span>' +
      (usable ? '<button type="button" class="btn sm" data-test="' + c.key + '">Test</button>' : '') +
      '</label>';
  }).join('');

  openModal(
    '<h2>Reminders &amp; alarms</h2>' +
    '<p class="sub">A nudge when you have not studied, on whichever channels you turn on.</p>' +

    '<div class="switch">' +
      '<button type="button" class="toggle' + (s.enabled ? ' on' : '') + '" id="remToggle" ' +
        'aria-pressed="' + !!s.enabled + '"></button>' +
      '<span class="sw-txt"><b>Daily reminder</b>' +
        '<span>Scheduled in your local time (' + esc(tzName) + ')</span></span>' +
    '</div>' +

    '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">' +
      '<div class="field"><label for="remTime">Remind me at</label>' +
        '<input class="input" id="remTime" type="time" value="' + esc(s.time) + '"></div>' +
      '<div class="field"><label for="remGoal">Daily goal (resources)</label>' +
        '<input class="input" id="remGoal" type="number" min="1" max="50" value="' + s.dailyGoal + '"></div>' +
    '</div>' +

    '<div class="field"><label>On these days</label><div class="daypick">' +
      DAY_NAMES.map((d, i) => '<button type="button" data-day="' + i + '"' +
        (s.days.indexOf(i) !== -1 ? ' class="on"' : '') + '>' + d + '</button>').join('') +
    '</div></div>' +

    '<label style="display:flex;gap:9px;align-items:center;font-size:13px;color:var(--text-2);margin-bottom:20px">' +
      '<input type="checkbox" id="remSkip"' + (s.skipWhenDone ? ' checked' : '') +
        ' style="width:16px;height:16px;accent-color:var(--accent)"> ' +
      'Stay quiet on days I already hit the goal</label>' +

    '<div class="field"><label>Channels</label>' + channelRows + '</div>' +

    '<div class="field"><label for="remEmail">Send email to</label>' +
      '<input class="input" id="remEmail" type="email" placeholder="' + esc(S.user.email) + '" value="' + esc(s.emailTo) + '"></div>' +
    '<div class="field"><label for="remWa">WhatsApp number (country code, digits only)</label>' +
      '<input class="input" id="remWa" inputmode="numeric" placeholder="919876543210" value="' + esc(s.whatsappTo) + '"></div>' +

    '<div style="border-top:1px solid var(--line-soft);margin:18px 0 12px"></div>' +
    '<div style="font-size:11px;text-transform:uppercase;letter-spacing:.07em;color:var(--text-3);' +
      'font-weight:700;margin-bottom:6px">Recent deliveries</div>' +
    '<div id="remLog">' + logRowsHtml(s._log) + '</div>' +

    '<div id="remMsg" class="form-msg hidden" style="margin-top:14px"></div>' +
    '<div class="modal-foot"><button class="btn" data-close>Close</button>' +
      '<button class="btn primary" id="remSave">Save reminder</button></div>');

  const modal = $('.overlay .modal');

  $('#remToggle').onclick = async () => {
    remState.enabled = !remState.enabled;
    $('#remToggle').classList.toggle('on', remState.enabled);
    if (remState.enabled) await ensureNotificationPermission();
  };

  modal.addEventListener('click', async (e) => {
    const d = e.target.closest('[data-day]');
    if (d) {
      const n = Number(d.dataset.day);
      const i = remState.days.indexOf(n);
      if (i === -1) remState.days.push(n); else remState.days.splice(i, 1);
      d.classList.toggle('on', i === -1);
      return;
    }
    const t = e.target.closest('[data-test]');
    if (t) {
      const ch = t.dataset.test;
      t.disabled = true; t.textContent = 'Sending…';
      try {
        collectReminderForm();
        await api('/api/reminders', { method: 'PUT', body: remState });
        if (ch === 'browser') await ensureNotificationPermission();
        const out = await api('/api/reminders/test', { method: 'POST', body: { channel: ch } });
        remState._log = out.log;
        if ($('#remLog')) $('#remLog').innerHTML = logRowsHtml(out.log);
        remMsg(out.result.ok ? 'Test ' + ch + ': ' + out.result.detail : out.result.detail, out.result.ok ? 'ok' : 'err');
        if (ch === 'browser') pollAlarms();
      } catch (err) {
        remMsg(err.message, 'err');
      } finally { t.disabled = false; t.textContent = 'Test'; }
      return;
    }
    const c = e.target.closest('[data-chan]');
    if (c && c.checked && c.dataset.chan === 'browser') await ensureNotificationPermission();
  });

  $('#remSave').onclick = async () => {
    try {
      collectReminderForm();
      if (remState.channels.indexOf('whatsapp') !== -1 && !remState.whatsappTo)
        return remMsg('Add a WhatsApp number first.', 'err');
      const out = await api('/api/reminders', { method: 'PUT', body: remState });
      remState = Object.assign(out.settings, { _caps: out.capabilities, _log: remState._log });
      closeModal();
      paintBell();
      toast(out.settings.enabled
        ? 'Reminder set for ' + out.settings.time + ' on ' + out.settings.days.map((d) => DAY_NAMES[d]).join(', ')
        : 'Reminders turned off');
    } catch (e) { remMsg(e.message, 'err'); }
  };
}

function logRowsHtml(log) {
  if (!log || !log.length)
    return '<div style="font-size:12px;color:var(--text-3);padding:6px 0">Nothing sent yet.</div>';
  return log.slice(0, 8).map((l) =>
    '<div class="log-row"><span class="st ' + esc(l.status) + '">' + esc(l.status) + '</span>' +
      '<span class="lt">' + esc(l.channel) + (l.detail ? ' — ' + esc(l.detail) : '') + '</span>' +
      '<span class="lw">' + relTime(l.created_at) + '</span></div>').join('');
}

function collectReminderForm() {
  remState.time = $('#remTime').value || '19:00';
  remState.dailyGoal = Number($('#remGoal').value) || 1;
  remState.skipWhenDone = $('#remSkip').checked;
  remState.emailTo = $('#remEmail').value.trim();
  remState.whatsappTo = $('#remWa').value.replace(/[^\d]/g, '');
  remState.tzOffset = new Date().getTimezoneOffset();
  remState.channels = $$('[data-chan]').filter((c) => c.checked).map((c) => c.dataset.chan);
  if (!remState.channels.length) remState.channels = ['browser'];
  if (!remState.days.length) remState.days = [1, 2, 3, 4, 5];
}

function remMsg(text, kind) {
  const el = $('#remMsg');
  if (!el) return toast(text, kind === 'err' ? 'err' : undefined);
  el.textContent = text;
  el.className = 'form-msg ' + (kind === 'ok' ? 'ok' : 'err');
  el.classList.remove('hidden');
}

function paintBell() {
  const armed = remState && remState.enabled;
  $('#bellBtn').classList.toggle('armed', !!armed);
  $('#bellBtn').title = armed
    ? 'Reminder at ' + remState.time + ' on ' + remState.days.map((d) => DAY_NAMES[d]).join(', ')
    : 'Reminders (off)';
}

async function ensureNotificationPermission() {
  if (!('Notification' in window)) return false;
  if (Notification.permission === 'granted') return true;
  if (Notification.permission === 'denied') return false;
  try { return (await Notification.requestPermission()) === 'granted'; } catch (e) { return false; }
}

/* A short two-tone chime, synthesised — no audio file to ship. */
function chime() {
  try {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    [[880, 0], [1320, 0.16]].forEach(([freq, at]) => {
      const osc = ctx.createOscillator(), gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.0001, ctx.currentTime + at);
      gain.gain.exponentialRampToValueAtTime(0.22, ctx.currentTime + at + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + at + 0.42);
      osc.connect(gain).connect(ctx.destination);
      osc.start(ctx.currentTime + at);
      osc.stop(ctx.currentTime + at + 0.45);
    });
    setTimeout(() => ctx.close(), 1400);
  } catch (e) { /* autoplay policy — the banner still shows */ }
}

function showAlarm(a) {
  const host = document.createElement('div');
  host.className = 'alarm';
  host.innerHTML =
    '<div class="ah"><span style="font-size:17px">&#9200;</span><b>' + esc(a.title) + '</b>' +
      '<button class="icon-btn" data-dismiss style="width:26px;height:26px">&times;</button></div>' +
    '<p>' + esc(String(a.body || '').split('\n').filter(Boolean).slice(1, 6).join('\n')) + '</p>' +
    '<div class="af"><button class="btn primary sm" data-go>Start studying</button>' +
      '<button class="btn sm" data-dismiss>Later</button></div>';
  document.body.appendChild(host);
  host.addEventListener('click', (e) => {
    if (e.target.closest('[data-go]')) {
      const n = nextUp();
      if (n) { S.filter = 'all'; S.query = ''; $('#search').value = ''; selectNode(n.nodeId); }
      host.remove();
    } else if (e.target.closest('[data-dismiss]')) host.remove();
  });
  setTimeout(() => host.remove(), 45000);

  if ('Notification' in window && Notification.permission === 'granted') {
    try {
      const n = new Notification(a.title, { body: String(a.body || '').split('\n').filter(Boolean).slice(1, 4).join('\n'), tag: 'es-reminder-' + a.id });
      n.onclick = () => { window.focus(); n.close(); };
    } catch (e) {}
  }
  chime();
}

let alarmTimer = null;
async function pollAlarms() {
  try {
    const out = await api('/api/notifications/pending');
    if (!out.alarms.length) return;
    for (const a of out.alarms) showAlarm(a);
    await api('/api/notifications/seen', { method: 'POST', body: {} });
    $('#bellDot').classList.remove('hidden');
  } catch (e) { /* offline or signed out — the next tick retries */ }
}

function openScope() {
  const sc = JSON.parse(JSON.stringify((S.progress.prefs || S.prefs).scope));
  const tracks = S.course.sections.filter((x) => /^Track /.test(x.title));

  const draw = () => {
    openModal(
      '<h2>What should progress count?</h2>' +
      '<p class="sub">The syllabus holds ' + (S.progress.stats.grandTotal || 0) + ' resources, but the ' +
        'course is the core path. Counting everything makes real progress look like nothing.</p>' +

      '<div class="field"><label>Measure against</label>' +
        '<div class="seg" style="width:100%">' +
          '<button data-mode="core"' + (sc.mode === 'core' ? ' class="on"' : '') +
            ' style="flex:1">The course</button>' +
          '<button data-mode="all"' + (sc.mode === 'all' ? ' class="on"' : '') +
            ' style="flex:1">Everything</button>' +
        '</div>' +
        '<p class="blurb" style="margin-top:8px">' + (sc.mode === 'core'
          ? 'Core items in Stages 0-6, plus any tracks you switch on. Reference Shelf, ' +
            '[alt] and [extra] are excluded.'
          : 'All ' + (S.progress.stats.grandTotal || 0) + ' resources, including the Reference Shelf, ' +
            'alternatives and optional depth.') + '</p>' +
      '</div>' +

      (sc.mode === 'core'
        ? '<div class="field"><label>Also count these elective tracks</label>' +
            tracks.map((t) => '<label class="chan">' +
              '<input type="checkbox" data-track="' + esc(t.title) + '"' +
                (sc.tracks.indexOf(t.title) !== -1 ? ' checked' : '') + '>' +
              '<span class="ci"><b>' + esc(t.title) + '</b>' +
              '<span>' + t.itemCount + ' resources</span></span></label>').join('') +
          '</div>'
        : '') +

      '<div class="modal-foot"><button class="btn" data-close>Cancel</button>' +
        '<button class="btn primary" id="scopeSave">Save</button></div>');

    const modal = $('.overlay .modal');
    modal.addEventListener('click', (e) => {
      const m = e.target.closest('[data-mode]');
      if (m) { sc.mode = m.dataset.mode; return draw(); }
      const t = e.target.closest('[data-track]');
      if (t) {
        const title = t.dataset.track;
        const i = sc.tracks.indexOf(title);
        if (i === -1) sc.tracks.push(title); else sc.tracks.splice(i, 1);
      }
    });
    $('#scopeSave').onclick = async () => {
      const out = await api('/api/prefs', { method: 'PUT', body: { scope: sc } });
      S.progress = out;
      S.prefs = out.prefs;
      closeModal();
      renderAll();
      toast('Now counting ' + out.stats.total + ' resources');
    };
  };
  draw();
}

function openProfile() {
  openModal(
    '<h2>Account settings</h2>' +
    '<p class="sub">' + (window.STATIC_MODE
      ? 'Everything you tick and write is stored in this browser only. Export regularly.'
      : esc(S.user.email) + ' &middot; <code>' + esc(S.user.id) + '</code>') + '</p>' +
    '<div class="field"><label>Display name</label>' +
      '<input class="input" id="pName" value="' + esc(S.user.displayName) + '"></div>' +
    (window.STATIC_MODE ? '' :
      '<div style="border-top:1px solid var(--line-soft);margin:18px 0 16px"></div>' +
      '<div class="field"><label>Current password</label>' +
        '<input class="input" id="pCur" type="password" autocomplete="current-password"></div>' +
      '<div class="field"><label>New password (leave blank to keep)</label>' +
        '<input class="input" id="pNew" type="password" autocomplete="new-password" minlength="8"></div>') +
    '<div id="pMsg" class="form-msg hidden"></div>' +
    '<div class="modal-foot"><button class="btn" data-close>Cancel</button>' +
      '<button class="btn primary" id="pSave">Save changes</button></div>');

  $('#pSave').onclick = async () => {
    try {
      const body = { displayName: $('#pName').value };
      const np = $('#pNew');
      if (np && np.value) { body.currentPassword = $('#pCur').value; body.newPassword = np.value; }
      const out = await api('/api/me', { method: 'PATCH', body: body });
      S.user = out.user;
      closeModal();
      paintUser();
      toast(out.passwordChanged ? 'Password updated' : 'Profile updated');
    } catch (e) {
      const m = $('#pMsg'); m.textContent = e.message; m.className = 'form-msg err';
    }
  };
}

function openReset() {
  openModal(
    '<h2>Reset all progress</h2>' +
    '<p class="sub">This clears every tick for <b>' + esc(S.user.email) + '</b>. Notes are kept.</p>' +
    '<div class="field"><label>Type RESET to confirm</label><input class="input" id="rWord" placeholder="RESET"></div>' +
    '<label style="display:flex;gap:8px;align-items:center;font-size:13px;color:var(--text-2)">' +
      '<input type="checkbox" id="rHist"> Also erase my completion history</label>' +
    '<div class="modal-foot"><button class="btn" data-close>Cancel</button>' +
      '<button class="btn danger" id="rGo">Reset progress</button></div>');

  $('#rGo').onclick = async () => {
    try {
      const out = await api('/api/progress/reset', { method: 'POST',
        body: { confirm: $('#rWord').value.trim(), clearHistory: $('#rHist').checked } });
      S.progress = out;
      closeModal();
      renderAll();
      toast('Progress reset');
    } catch (e) { toast(e.message, 'err'); }
  };
}

/* =============================================================
   ACTIONS
   ============================================================= */
const CYCLE = { todo: 'in_progress', in_progress: 'done', done: 'todo' };

async function cycleItem(itemId, el) {
  const next = CYCLE[statusOf(itemId)];
  try {
    const out = await api('/api/progress', { method: 'POST', body: { itemId: itemId, status: next } });
    S.progress = out;
    renderAll();
    if (next === 'done') {
      const fresh = document.querySelector('.card[data-item="' + itemId + '"]');
      if (fresh) fresh.classList.add('flash');
      toast('✓ ' + (S.items.get(itemId) || {}).title);
    }
  } catch (e) { toast(e.message, 'err'); }
}

async function bulk(status) {
  const node = S.nodes.get(S.nodeId);
  const ids = descendantItems(node).map((i) => i.id);
  if (!ids.length) return;
  const out = await api('/api/progress', { method: 'POST', body: { itemIds: ids, status: status } });
  S.progress = out;
  renderAll();
  toast(out.changed + ' resource' + (out.changed === 1 ? '' : 's') +
    (status === 'done' ? ' marked done' : ' reset'));
}

async function refreshProgress() {
  S.progress = await api('/api/progress');
}

/* =============================================================
   VIEW SWITCHING / RENDER
   ============================================================= */
function setView(v) {
  S.view = v;
  LS.set('es_view', v);
  $$('#nav button').forEach((b) => b.classList.toggle('on', b.dataset.view === v));
  ['course', 'dashboard', 'history', 'notes'].forEach((k) =>
    $('#view-' + k).classList.toggle('hidden', k !== v));
  if (v === 'history') { S.historyOffset = 0; renderHistory(); }
  if (v === 'dashboard') renderDashboard();
  if (v === 'notes') renderNotes();
  if (v === 'course') renderCourse();
}

function renderAll() {
  renderSidebar();
  if (S.view === 'course') renderCourse();
  if (S.view === 'dashboard') renderDashboard();
  if (S.view === 'notes') renderNotes();
}

function paintUser() {
  const initials = (S.user.displayName || S.user.email).trim().slice(0, 2).toUpperCase();
  $('#avatar').textContent = initials;
  $('#menuName').textContent = S.user.displayName;
  $('#menuEmail').textContent = window.STATIC_MODE
    ? 'stored in this browser only' : S.user.email;
  $('#menuId').textContent = window.STATIC_MODE ? 'no account needed' : S.user.id;
  if (window.STATIC_MODE) {
    const out = document.querySelector('#userMenu [data-act="logout"]');
    if (out) out.classList.add('hidden');
  }
}

function saveExpanded() {
  LS.set('es_expanded', Array.from(S.expanded));
}

function selectNode(id) {
  S.nodeId = id;
  LS.set('es_node', id);
  // Open the ancestors so the selection is actually visible in the tree.
  pathOf(id).forEach((n) => S.expanded.add(n.id));
  saveExpanded();
  if (S.view !== 'course') setView('course'); else renderAll();
  $('#sidebar').classList.remove('open');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* =============================================================
   EVENTS
   ============================================================= */
function wire() {
  /* auth — absent entirely in the static build */
  $$('.tabs button').forEach((b) => b.addEventListener('click', () => setAuthMode(b.dataset.mode)));
  const authForm = $('#authForm');
  if (authForm) authForm.addEventListener('submit', submitAuth);

  /* nav */
  $('#nav').addEventListener('click', (e) => {
    const b = e.target.closest('button[data-view]');
    if (b) setView(b.dataset.view);
  });

  $('#themeBtn').addEventListener('click', () =>
    applyTheme(document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'));

  $('#bellBtn').addEventListener('click', () => {
    $('#bellDot').classList.add('hidden');
    openReminders();
  });

  $('#avatar').addEventListener('click', (e) => {
    e.stopPropagation();
    $('#userMenu').classList.toggle('hidden');
  });
  document.addEventListener('click', () => $('#userMenu').classList.add('hidden'));
  $('#userMenu').addEventListener('click', (e) => {
    e.stopPropagation();
    const b = e.target.closest('button[data-act]');
    if (!b) return;
    $('#userMenu').classList.add('hidden');
    const act = b.dataset.act;
    if (act === 'logout') logout();
    if (act === 'reminders') openReminders();
    if (act === 'profile') openProfile();
    if (act === 'reset') openReset();
    if (act === 'export') {
      if (window.STATIC_EXPORT) window.STATIC_EXPORT();
      else window.open('/api/export', '_blank');
    }
  });

  /* search */
  let sTimer;
  $('#search').addEventListener('input', (e) => {
    clearTimeout(sTimer);
    sTimer = setTimeout(() => {
      S.query = e.target.value;
      if (S.view !== 'course') setView('course'); else renderCourse();
    }, 160);
  });

  /* sidebar */
  $('#sidebar').addEventListener('click', (e) => {
    const jump = e.target.closest('[data-jump]');
    if (jump) {
      if (jump.dataset.jump === 'next') {
        const n = nextUp();
        if (n) { S.filter = 'all'; S.query = ''; $('#search').value = ''; selectNode(n.nodeId); }
        else toast('Everything is complete. Nice work.');
      } else { S.filter = 'in_progress'; selectNode(S.nodeId || S.course.sections[0].id); }
      return;
    }
    if (e.target.closest('[data-scope]')) return openScope();

    const bulk = e.target.closest('[data-tree]');
    if (bulk) {
      S.expanded.clear();
      if (bulk.dataset.tree === 'expand') {
        const all = (n) => { if (n.children.length) { S.expanded.add(n.id); n.children.forEach(all); } };
        S.course.sections.forEach(all);
      }
      saveExpanded();
      return renderSidebar();
    }

    const tog = e.target.closest('[data-toggle]');
    if (tog) {
      const id = tog.dataset.toggle;
      S.expanded.has(id) ? S.expanded.delete(id) : S.expanded.add(id);
      saveExpanded();
      return renderSidebar();
    }

    const row = e.target.closest('[data-node]');
    if (!row) return;
    const id = row.dataset.node;
    const node = S.nodes.get(id);
    if (node && node.children.length) S.expanded.add(id);
    selectNode(id);
  });

  /* main pane */
  $('.main').addEventListener('click', async (e) => {
    const tick = e.target.closest('[data-tick]');
    if (tick) return cycleItem(tick.dataset.tick, tick);

    const note = e.target.closest('[data-note]');
    if (note) return openItemNote(note.dataset.note);

    const nodeBtn = e.target.closest('[data-node]');
    if (nodeBtn) return selectNode(nodeBtn.dataset.node);

    const f = e.target.closest('[data-filter]');
    if (f) { S.filter = f.dataset.filter; return renderCourse(); }

    if (e.target.closest('[data-coreonly]')) {
      S.coreOnly = !S.coreOnly;
      LS.set('es_coreonly', S.coreOnly);
      return renderCourse();
    }

    const bk = e.target.closest('[data-bulk]');
    if (bk) return bulk(bk.dataset.bulk);

    const cs = e.target.closest('#clearSearch');
    if (cs) { S.query = ''; $('#search').value = ''; return renderCourse(); }

    const h = e.target.closest('[data-hist]');
    if (h) {
      S.historyOffset = Math.max(0, S.historyOffset + (h.dataset.hist === 'next' ? 100 : -100));
      return renderHistory();
    }

    const on = e.target.closest('[data-opennote]');
    if (on) {
      S.activeNote = S.notes.find((x) => x.id === on.dataset.opennote) || null;
      return setView('notes');
    }

    const nf = e.target.closest('[data-nfilter]');
    if (nf) { S.noteFilter = nf.dataset.nfilter; return renderNotes(); }

    const em = e.target.closest('[data-edmode]');
    if (em) {
      // Flush whatever is in the textarea before swapping it for the preview.
      const ta = $('#nBody');
      if (ta && S.activeNote) S.activeNote.body = ta.value;
      S.notePreview = em.dataset.edmode === 'preview';
      if (ta && S.activeNote) await saveActiveNote(true);
      return renderNotes();
    }

    if (e.target.closest('#newNote')) {
      const out = await api('/api/notes', { method: 'POST',
        body: { scope: 'free', title: 'Untitled note', body: '' } });
      S.activeNote = out.note;
      await loadNotes();
      const t = $('#nTitle'); if (t) { t.focus(); t.select(); }
      return;
    }

    const na = e.target.closest('[data-noteact]');
    if (na) {
      const act = na.dataset.noteact;
      if (act === 'save') return saveActiveNote(false);
      if (act === 'pin') {
        S.activeNote.pinned = !S.activeNote.pinned;
        return saveActiveNote(true).then(() => renderNotes());
      }
      if (act === 'delete') {
        if (!confirm('Delete this note?')) return;
        await api('/api/notes?id=' + S.activeNote.id, { method: 'DELETE' });
        S.activeNote = null;
        await refreshProgress();
        await loadNotes();
        return toast('Note deleted');
      }
    }
  });

  /* notes: filter input + autosave */
  let nTimer;
  $('.main').addEventListener('input', (e) => {
    if (e.target.id === 'noteSearch') {
      clearTimeout(nTimer);
      const v = e.target.value;
      nTimer = setTimeout(() => {
        S.noteQuery = v;
        renderNotes();
        const f = $('#noteSearch');
        if (f) { f.focus(); f.setSelectionRange(v.length, v.length); }
      }, 220);
      return;
    }
    if (['nTitle', 'nBody', 'nTags'].indexOf(e.target.id) !== -1) {
      clearTimeout(nTimer);
      $('#savedTag').textContent = 'Unsaved changes…';
      nTimer = setTimeout(async () => {
        const focusId = document.activeElement && document.activeElement.id;
        const pos = document.activeElement && document.activeElement.selectionStart;
        await saveActiveNote(true);
        const el = focusId && $('#' + focusId);
        if (el) { el.focus(); try { el.setSelectionRange(pos, pos); } catch (err) {} }
        if ($('#savedTag')) $('#savedTag').textContent = 'Saved just now';
      }, 900);
    }
  });

  /* overlay */
  $('#overlayRoot').addEventListener('click', (e) => {
    if (e.target.hasAttribute('data-overlay') || e.target.closest('[data-close]')) closeModal();
  });

  /* mobile sidebar */
  $('#menuToggle').addEventListener('click', (e) => {
    e.stopPropagation();
    $('#sidebar').classList.toggle('open');
  });

  /* keyboard */
  document.addEventListener('keydown', (e) => {
    const typing = /^(INPUT|TEXTAREA)$/.test(document.activeElement.tagName);
    if (e.key === 'Escape') { closeModal(); $('#userMenu').classList.add('hidden'); }
    if (e.key === 'k' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); return openPalette(); }
    if (typing) return;
    if (e.key === '/') { e.preventDefault(); $('#search').focus(); }
    if (e.key === 'k' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); openPalette(); }
    const map = { '1': 'course', '2': 'dashboard', '3': 'history', '4': 'notes' };
    if (map[e.key]) setView(map[e.key]);
  });

  /* a handful of README videos are dead — fall back to the kind icon */
  document.addEventListener('error', (e) => {
    const img = e.target;
    if (img.tagName !== 'IMG' || !img.classList.contains('thumb')) return;
    const ph = document.createElement('div');
    ph.className = 'thumb ph';
    ph.textContent = '▶';
    ph.title = 'Preview unavailable';
    img.replaceWith(ph);
  }, true);

  /* keep the mobile menu button in sync with viewport width */
  const syncMenuBtn = () => $('#menuToggle').classList.toggle('hidden', window.innerWidth > 1000);
  window.addEventListener('resize', syncMenuBtn);
  syncMenuBtn();
}

/* =============================================================
   BOOT
   ============================================================= */
async function boot() {
  const gate = $('#auth');
  if (gate) gate.classList.add('hidden');
  $('#app').classList.remove('hidden');

  S.course = await api('/api/course');
  indexCourse();
  S.progress = await api('/api/progress');

  const savedNode = LS.get('es_node', null);
  S.nodeId = (savedNode && S.nodes.has(savedNode)) ? savedNode : S.course.sections[0].id;
  LS.get('es_expanded', []).forEach((id) => { if (S.nodes.has(id)) S.expanded.add(id); });
  pathOf(S.nodeId).forEach((n) => S.expanded.add(n.id));

  paintUser();
  await loadNotes();
  setView(LS.get('es_view', 'course'));
  renderSidebar();

  // Reminder state + the alarm poller. The server decides *when*; this just
  // collects whatever is waiting and rings it.
  try {
    const rem = await api('/api/reminders');
    remState = Object.assign(rem.settings, { _caps: rem.capabilities, _log: rem.log });
    paintBell();
    if (remState.enabled && remState.channels.indexOf('browser') !== -1) ensureNotificationPermission();
  } catch (e) { /* reminders are optional */ }

  pollAlarms();
  clearInterval(alarmTimer);
  alarmTimer = setInterval(pollAlarms, 30000);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) pollAlarms(); });
}

(async function init() {
  applyTheme(LS.get('es_theme', 'dark'));
  S.coreOnly = LS.get('es_coreonly', false);
  wire();
  try {
    const me = await api('/api/me');
    if (me.user) { S.user = me.user; await boot(); return; }
  } catch (e) { /* fall through to auth */ }
  if (window.STATIC_MODE) {
    // Nothing to sign in to; the data lives in this browser.
    S.user = { id: 'local', email: 'local', displayName: 'You' };
    await boot();
    return;
  }
  setAuthMode('login');
  $('#auth').classList.remove('hidden');
})();
