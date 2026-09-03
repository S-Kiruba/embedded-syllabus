'use strict';
/* Builds SYLLABUS.md from:
     sources/embedded-engineering-roadmap.md   (CC BY-SA 4.0, m3y54m)
     sources/original-resources.md             (the original resource list)
   using the editorial mapping in tools/syllabusMap.js.

   Run:  node tools/buildSyllabus.js          */

const fs = require('node:fs');
const path = require('node:path');
const { build: buildLegacy } = require('../lib/parseReadme');
const MAP = require('./syllabusMap');

const ROOT = path.join(__dirname, '..');
const ROADMAP = path.join(ROOT, 'sources', 'embedded-engineering-roadmap.md');
const README = path.join(ROOT, 'sources', 'original-resources.md');
const OUT = path.join(ROOT, 'SYLLABUS.md');

/* ---------- load the roadmap ---------- */
const PAID_HOSTS = ['udemy.com', 'oreilly.com', 'a.co', 'amazon.com', 'amazon.sg', 'packtpub.com',
  'link.springer.com', 'dl.acm.org', 'acm.org', 'ieee.org', 'manning.com', 'wiley.com',
  'informit.com', 'apress', 'routledge.com', 'pearson.com', 'deitel.com', 'nostarch.com',
  'mhprofessional.com', 'global.oup.com', 'mitpress.mit.edu', 'leanpub.com', 'audiobooks.com',
  'artofelectronics.net', 'stroustrup.com', 'iso.org', 'educative.io', 'pluralsight',
  'elsevier', 'taylorfrancis', 'scaler.com', 'coursera.org', 'edx.org'];

const stripEmoji = (s) => s
  .replace(/[\u{1F300}-\u{1FAFF}\u{2190}-\u{21FF}\u{2300}-\u{27BF}\u{2B00}-\u{2BFF}\u{FE0F}\u{200B}-\u{200D}\u{20E3}]/gu, '')
  .replace(/\s+/g, ' ').trim();
const hostOf = (u) => { try { return new URL(u).hostname.replace(/^www\./, ''); } catch (e) { return ''; } };
const isPaid = (u) => { const h = hostOf(u); return PAID_HOSTS.some((p) => h.includes(p)); };

const SOURCE_NAMES = {
  'youtube.com': 'YouTube', 'youtu.be': 'YouTube', 'github.com': 'GitHub',
  'interrupt.memfault.com': 'Memfault Interrupt', 'mu.microchip.com': 'Microchip University',
  'academy.nordicsemi.com': 'Nordic Academy', 'bootlin.com': 'Bootlin', 'freertos.org': 'FreeRTOS',
  'docs.zephyrproject.org': 'Zephyr', 'throwtheswitch.org': 'ThrowTheSwitch',
  'barrgroup.com': 'Barr Group', 'embeddedrelated.com': 'EmbeddedRelated', 'embedded.com': 'Embedded.com',
  'renode.io': 'Renode', 'qemu.org': 'QEMU', 'wokwi.com': 'Wokwi', 'docs.wokwi.com': 'Wokwi',
  'embeddedartistry.com': 'Embedded Artistry', 'beningo.com': 'Beningo',
  'allaboutcircuits.com': 'All About Circuits', 'sergioprado.blog': 'Sergio Prado',
  'docs.espressif.com': 'Espressif', 'lwn.net': 'LWN', 'man7.org': 'man7',
  'state-machine.com': 'Quantum Leaps', 'pigweed.dev': 'Pigweed', 'kernel.org': 'kernel.org',
  'docs.kernel.org': 'kernel.org', 'gnu.org': 'GNU', 'cmake.org': 'CMake', 'git-scm.com': 'Git',
  'learncpp.com': 'LearnCpp', 'en.cppreference.com': 'cppreference', 'doc.rust-lang.org': 'Rust Docs',
};
function sourceOf(u) {
  const h = hostOf(u);
  if (SOURCE_NAMES[h]) return SOURCE_NAMES[h];
  return h.replace(/^(docs|blog|learn|www|developer|wiki)\./, '')
          .replace(/\.(com|org|net|io|dev|blog|info|co|me|edu|gov)(\.[a-z]{2})?$/, '');
}
const typeOf = (raw) => raw.includes('📘') ? 'Book'
  : raw.includes('🎞') ? 'Video' : raw.includes('📝') ? 'Article' : 'Link';

function loadRoadmap() {
  const lines = fs.readFileSync(ROADMAP, 'utf8').split(/\r?\n/);
  const sections = [];
  let cur = null;
  const chain = [];
  for (const line of lines) {
    const h = /^(#{2,6})\s+(.*)$/.exec(line);
    if (h) {
      const depth = h[1].length;
      let title = h[2];
      let headingUrl = '';
      const asLink = /^\[(.+)\]\((https?:\/\/[^)\s]+)\)\s*$/.exec(title.trim());
      if (asLink) { title = asLink[1]; headingUrl = asLink[2]; }
      title = stripEmoji(title);
      chain.length = Math.max(0, depth - 2);
      chain[depth - 2] = title;
      cur = { key: chain.slice(0, depth - 1).filter(Boolean).join(' > '), items: [] };
      sections.push(cur);
      if (headingUrl) cur.items.push({
        title, url: headingUrl, type: 'Link', source: sourceOf(headingUrl),
        gem: false, beginner: false, paid: isPaid(headingUrl),
      });
      continue;
    }
    const it = /^\s*-\s*\[(.+?)\]\((https?:\/\/[^)\s]+)\)\s*$/.exec(line);
    if (it && cur && !it[2].includes('shields.io')) {
      cur.items.push({
        title: stripEmoji(it[1]), url: it[2], type: typeOf(it[1]), source: sourceOf(it[2]),
        gem: it[1].includes('💎'), beginner: it[1].includes('👶'), paid: isPaid(it[2]),
      });
    }
  }
  return sections;
}

/* ---------- load the original README ---------- */
function loadLegacy() {
  const tree = buildLegacy(README);
  const byPath = new Map();
  const walk = (n, ancestors) => {
    const p = ancestors.concat(n.title);
    byPath.set(p.join(' > '), n);
    n.children.forEach((c) => walk(c, p));
  };
  tree.sections.forEach((s) => walk(s, []));
  return byPath;
}

// Every README topic named anywhere in the map. A topic that pulls a parent node
// walks its children too — except the ones another topic has explicitly claimed,
// so "Serial Communication" does not swallow the UART/SPI/I2C sections below it.
const claimedLegacy = new Set();
for (const st of MAP.stages) for (const t of st.topics) (t.legacy || []).forEach((p) => claimedLegacy.add(p));

function legacyItems(node, rootPath) {
  const out = [];
  const walk = (n, p) => {
    if (p !== rootPath && claimedLegacy.has(p)) return;
    for (const i of n.items) out.push({
      title: i.title, url: i.url,
      type: i.kind === 'Playlist' ? 'Video' : (i.kind || 'Link'),
      source: i.source || sourceOf(i.url), gem: false, beginner: false, paid: isPaid(i.url),
    });
    n.children.forEach((c) => walk(c, p + ' > ' + c.title));
  };
  walk(node, rootPath);
  return out;
}

/* ---------- assemble ---------- */
const roadmap = loadRoadmap();
const legacy = loadLegacy();
const seen = new Set();
const stats = { kept: 0, core: 0, alt: 0, criteria: 0, reserved: 0, deadDropped: 0, paidDropped: 0, dupDropped: 0, fromRoadmap: 0, fromLegacy: 0, projects: 0 };
const missing = [];

// Identity key for de-duplication. YouTube needs care: the same video appears with
// different &list=/&index= tails, and every watch URL shares the same path — so key
// on the video/playlist id, not the whole URL.
function normUrl(u) {
  try {
    const x = new URL(String(u));
    const h = x.hostname.replace(/^www\./, '').toLowerCase();
    if (h === 'youtu.be') return 'yt:' + x.pathname.replace(/^\//, '');
    if (h.endsWith('youtube.com')) {
      const v = x.searchParams.get('v');
      if (v) return 'yt:' + v;
      const list = x.searchParams.get('list');
      if (list) return 'ytpl:' + list;
    }
    return (h + x.pathname.replace(/\/+$/, '') + x.search).toLowerCase();
  } catch (e) {
    return String(u || '').toLowerCase();
  }
}
const DEAD = new Set(MAP.deadLinks || []);
const isDead = (k) => DEAD.has(k) || DEAD.has(k.toLowerCase());
const allowedPaid = (t) => MAP.allowPaid.some((a) => t.toLowerCase().includes(a.toLowerCase()));

function pickRoad(keys) {
  const out = [];
  for (const want of keys) {
    const hits = roadmap.filter((s) => s.key === want || s.key.endsWith(' > ' + want));
    if (!hits.length) { missing.push('roadmap section not found: ' + want); continue; }
    for (const h of hits) out.push.apply(out, h.items);
  }
  return out;
}

function pickLegacy(keys) {
  const out = [];
  for (const want of keys) {
    const node = legacy.get(want);
    if (!node) { missing.push('README topic not found: ' + want); continue; }
    out.push.apply(out, legacyItems(node, want));
  }
  return out;
}

/* ---------------- curation ----------------
   A topic must offer ONE path, not five. Resources that cover the same ground are
   substitutes, not steps: keeping them all turns a two-hour topic into a month.
   Each topic gets at most one entry point, at most one comprehensive resource, and
   no near-duplicates. Everything else is demoted to "alternative". */

const COMPREHENSIVE = /\b(full course|complete course|complete guide|crash course|tutorial series|playlist|from scratch|the complete|masterclass|bootcamp|specialization|handbook|textbook|beginners guide|beginner guide|hands on tutorial|lectures|101)\b/i;
// Numbered parts are one resource split up: complements, never substitutes.
const SERIES = /\b(part\s*\d+|\d+\s*of\s*\d+|#\d+|episode\s*\d+|lesson\s*\d+|ep\.?\s*\d+|vol\.?\s*\d+)\b/i;

const STOP = new Set(['the', 'a', 'an', 'of', 'for', 'to', 'in', 'and', 'or', 'with', 'on', 'vs',
  'using', 'your', 'what', 'is', 'are', 'how', 'why', 'it', 'its', 'you', 'into', 'from', 'at',
  'by', 'be', 'this', 'that', 'part', 'intro', 'introduction', 'guide', 'tutorial', 'overview',
  'basics', 'explained', 'simple', 'pros', 'cons', 'embedded', 'systems', 'system', 'programming',
  'video', 'article', 'link', 'book', 'course', 'learn', 'understanding', 'getting', 'started',
  'fundamentals', 'beginners', 'beginner']);

const words = (t) => String(t).toLowerCase().replace(/[^a-z0-9+#\s]/g, ' ').split(/\s+/);

// The publisher name is in every title from that publisher ("Microchip University -
// X", "... | DigiKey"), so it must not count towards two titles looking alike.
function titleTokens(title, source) {
  const drop = new Set(words(source || ''));
  return new Set(words(title).filter((w) => w.length > 2 && !STOP.has(w) && !drop.has(w)));
}

function overlap(a, b) {
  if (!a.size || !b.size) return { score: 0, shared: 0 };
  let inter = 0;
  for (const x of a) if (b.has(x)) inter++;
  return { score: inter / (a.size + b.size - inter), shared: inter };
}

// Whether one resource covers the whole topic on its own. Format is the honest
// signal here, not phrasing: a book, a video playlist or a numbered "101" course
// is a month of work; a blog post is an afternoon.
const isComprehensive = (i) =>
  i.kind === 'Book' ||
  /playlist\?list=/.test(i.url || '') ||
  COMPREHENSIVE.test(i.title);

// Selection order: one entry point, then canonical references, then the rest.
const selectRank = (i) => (i.beginner ? 0 : (i.gem ? 1 : 2));
// Display order: easiest first, deep references last.
const rank = (i) => (i.beginner ? 0 : (i.gem ? 2 : 1));

function curate(items, topic) {
  const quota = topic.core || 4;
  const primary = topic.primary
    ? items.find((i) => i.title.toLowerCase().indexOf(topic.primary.toLowerCase()) !== -1)
    : null;

  const order = items.slice().sort((a, b) => {
    if (a === primary) return -1;
    if (b === primary) return 1;
    return selectRank(a) - selectRank(b);
  });

  const kept = [];
  for (const i of order) {
    const tk = titleTokens(i.title, i.source);
    const series = SERIES.test(i.title);
    // Two specific words in common AND a high ratio — one alone gives false twins.
    const twin = kept.find((k) => {
      if (series && k.series) return false;
      const o = overlap(k.tk, tk);
      return o.shared >= 2 && o.score >= 0.45;
    });
    const secondEntry = i.beginner && kept.some((k) => k.item.beginner);
    const secondBigOne = isComprehensive(i) && kept.some((k) => isComprehensive(k.item));

    if (i !== primary && (twin || secondEntry || secondBigOne)) {
      i.core = false; i.alt = true; stats.alt++;
    } else if (kept.length >= quota) {
      i.core = false; i.alt = false;
    } else {
      i.core = true; i.alt = false; stats.core++;
      kept.push({ item: i, tk: tk, series: series });
    }
  }
  return items.sort((a, b) => rank(a) - rank(b));
}

const reservedFor = new Map();
MAP.stages.forEach((st, si) => st.topics.forEach((t, ti) => {
  (t.plus || []).forEach((p) => reservedFor.set(normUrl(p.url), si + ':' + ti));
}));

function collect(topic, topicId) {
  let items = [];
  if (topic.road) { const r = pickRoad(topic.road); stats.fromRoadmap += r.length; items = items.concat(r); }
  if (topic.legacy) { const l = pickLegacy(topic.legacy); stats.fromLegacy += l.length; items = items.concat(l); }
  if (topic.plus) items = items.concat(topic.plus.map((p) => Object.assign({ gem: false, beginner: false, paid: false }, p)));

  const out = [];
  for (const i of items) {
    if (!i.url) continue;
    if (i.paid && !allowedPaid(i.title)) { stats.paidDropped++; continue; }
    const k = normUrl(i.url);
    if (isDead(k)) { stats.deadDropped++; continue; }
    if (reservedFor.has(k) && reservedFor.get(k) !== topicId) { stats.reserved++; continue; }
    if (seen.has(k)) { stats.dupDropped++; continue; }
    seen.add(k);
    out.push(i);
  }
  curate(out, topic);
  stats.kept += out.length;
  return out;
}

/* ---------- emit ---------- */
const esc = (s) => String(s).replace(/"/g, "'").replace(/\s+/g, ' ').trim();
function itemLine(i) {
  const badge = (i.beginner ? ' [beginner]' : (i.gem ? ' [reference]' : '')) +
    (i.core ? '' : (i.alt ? ' [alt]' : ' [extra]'));
  const src = i.source ? ', ' + esc(i.source) : '';
  return '- [ ] [' + i.type + ': "' + esc(i.title) + '"' + src + '](' + i.url + ')' + badge;
}
const lines = [];
const toc = [];

lines.push('# Embedded Software Engineering — A Free, Emulator-First Syllabus');
lines.push('');
lines.push('A staged course for becoming an embedded **software** engineer. Every resource is free.');
lines.push('Nothing here needs a development board — the hands-on work runs in **Renode**, **QEMU**');
lines.push('and **Wokwi**. Buy hardware later if you want to; the syllabus does not wait for it.');
lines.push('');
lines.push('Each stage ends with a **project gate**. Do not move on until you have built it.');
lines.push('');
lines.push('---');
lines.push('');
lines.push('## How to use this');
lines.push('');
lines.push('- Work the stages in order. Stages 0–6 are the core; the tracks at the end are electives.');
lines.push('- Inside a stage, resources are ordered **beginner-friendly first, deep references last**.');
lines.push('- `[beginner]` marks an easy entry point. `[reference]` marks a canonical deep source —');
lines.push('  do not try to read those end to end on the first pass, come back to them.');
lines.push('- `[alt]` covers the **same ground** as an unmarked item above it - a different');
lines.push('  teacher for the same lesson. Pick whichever suits you and skip the rest. Working');
lines.push('  through all of them is the easiest way to spend a month learning one thing.');
lines.push('- `[extra]` is optional depth. Skip it on the first pass; come back when a real');
lines.push('  problem sends you looking.');
lines.push('- So: the **unmarked items plus the project gate are the course**. Everything else is');
lines.push('  a substitute or a sidetrack.');
lines.push('- The **Reference Shelf** at the end is deliberately outside the stages: self-contained');
lines.push('  subjects, vendor catalogues and link galleries. Ignore it until something sends you there.');
lines.push('- Skipping Stage 2 is the most common mistake. Do not.');
lines.push('');
lines.push('---');
lines.push('');
lines.push('__TOC__');
lines.push('');
lines.push('---');
lines.push('');

const shelf = [];              // topics pulled out of the stage flow
const anchor = (t) => t.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');

MAP.stages.forEach((stage, si) => {
  const shelved = stage.topics.filter((t) => !t.project && (t.shelf || stage.shelf));

  // Claim URLs in map order so de-duplication stays deterministic, then hold the
  // items back for the Reference Shelf chapter at the end.
  if (stage.shelf) {
    stage.topics.forEach((t, ti) => {
      if (t.project) return;
      const items = collect(t, si + ':' + ti);
      if (items.length) shelf.push({ title: t.title, from: stage.title, items: items });
    });
    return;
  }

  lines.push('## ' + stage.title);
  toc.push('- [' + stage.title + '](#' + anchor(stage.title) + ')');
  lines.push('');
  const moved = shelved.map((t) => t.title);
  const blurb = (stage.blurb || '') + (moved.length
    ? ' Moved to the Reference Shelf: ' + moved.join('; ') + '.' : '');
  if (blurb.trim()) { lines.push('> ' + blurb.trim()); lines.push(''); }

  stage.topics.forEach((topic, ti) => {
    if (topic.project) {
      stats.projects++;
      const pr = topic.project;
      lines.push('### Project Gate — ' + (pr.name || 'Build it'));
      lines.push('');
      lines.push('> ' + esc(pr.goal));
      lines.push('');
      if (pr.brief) { lines.push(pr.brief); lines.push(''); }
      lines.push('**Definition of done**');
      lines.push('');
      for (const c of pr.criteria) { lines.push('- [ ] Gate: ' + esc(c)); stats.criteria++; }
      lines.push('');
      return;
    }
    const items = collect(topic, si + ':' + ti);
    if (!items.length) { missing.push('EMPTY topic: ' + stage.title + ' > ' + topic.title); return; }
    if (topic.shelf) { shelf.push({ title: topic.title, from: stage.title, items: items }); return; }
    lines.push('### ' + topic.title);
    lines.push('');
    for (const i of items) {
      lines.push(itemLine(i));
    }
    lines.push('');
  });
  lines.push('---');
  lines.push('');
});

if (shelf.length) {
  const title = 'Reference Shelf — Subjects That Are Their Own Course';
  lines.push('## ' + title);
  toc.push('- [' + title + '](#' + anchor(title) + ')');
  lines.push('');
  lines.push('> Not part of any stage. Each of these is a self-contained subject, a catalogue to');
  lines.push('> pick from, or a link gallery — material you reach for when a specific job asks for');
  lines.push('> it, not something you work through in order. Nothing here blocks progress.');
  lines.push('');
  for (const sh of shelf) {
    lines.push('### ' + sh.title + ' — from ' + sh.from.replace(/ —.*$/, ''));
    lines.push('');
    for (const i of sh.items) {
      lines.push(itemLine(i));
    }
    lines.push('');
  }
  lines.push('---');
  lines.push('');
}

lines.push('## Appendix — The Only Books Worth Buying');
lines.push('');
lines.push('> Everything above is free. If you buy anything at all, these three earn their price.');
lines.push('> They are optional and nothing in the syllabus depends on them.');
lines.push('');
lines.push('- [ ] [Book: "The C Programming Language (K&R)", Kernighan & Ritchie](https://en.wikipedia.org/wiki/The_C_Programming_Language) [optional-paid]');
lines.push('- [ ] [Book: "Test Driven Development for Embedded C", James Grenning](https://pragprog.com/titles/jgade/test-driven-development-for-embedded-c/) [optional-paid]');
lines.push('- [ ] [Book: "Making Embedded Systems", Elecia White](https://www.oreilly.com/library/view/making-embedded-systems/9781098151539/) [optional-paid]');
lines.push('');
lines.push('---');
lines.push('');
lines.push('## Credits & Licence');
lines.push('');
lines.push('This syllabus is a derivative work. It reorganises, filters and annotates material from:');
lines.push('');
lines.push('- **[Embedded Engineering Roadmap](https://github.com/m3y54m/embedded-engineering-roadmap)** by Meysam Parvizi — licensed [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/).');
lines.push('- The original `README.md` resource list in this repository.');
lines.push('');
lines.push('**Changes made:** resources were re-sequenced into staged modules with project gates; ');
lines.push('hardware-engineering topics (electronics, PCB, EMC, soldering, FPGA) were removed; all ');
lines.push('paid resources were removed except three optional books; the two source lists were ');
lines.push('merged and de-duplicated; an emulator-first Stage 0 was added.');
lines.push('');
lines.push('As required by ShareAlike, **this document is also licensed [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)**.');
lines.push('');
lines.push('_Generated by `tools/buildSyllabus.js` — edit `tools/syllabusMap.js` and re-run to change the course._');
lines.push('');

const doc = lines.join('\n').replace('__TOC__', toc.join('\n'));
fs.writeFileSync(OUT, doc);

/* ---------- report ---------- */
console.log('SYLLABUS.md written\n');
console.log('  stages            ' + MAP.stages.length);
console.log('  project gates     ' + stats.projects + '  (' + stats.criteria + ' acceptance criteria)');
console.log('  shelved topics    ' + shelf.length + '  (' + shelf.reduce((n, x) => n + x.items.length, 0) + ' items)');
console.log('  resources kept    ' + stats.kept);
console.log('    core path       ' + stats.core);
console.log('    alternatives    ' + stats.alt + '  (same ground as a core item - pick one)');
console.log('    extra depth     ' + (stats.kept - stats.core - stats.alt));
console.log('  paid dropped      ' + stats.paidDropped);
console.log('  dead dropped      ' + stats.deadDropped);
console.log('  duplicates merged ' + stats.dupDropped);
console.log('  pulled from roadmap/README  ' + stats.fromRoadmap + ' / ' + stats.fromLegacy);
if (missing.length) {
  console.log('\n  WARNINGS (' + missing.length + '):');
  for (const m of missing) console.log('    - ' + m);
}
