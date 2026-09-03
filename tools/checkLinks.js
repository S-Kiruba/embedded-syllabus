'use strict';
/* Checks every link in a markdown resource list.
   YouTube needs special handling: a watch page returns 200 even for a removed
   video, so we probe the thumbnail instead, which 404s when the video is gone.

   Run:  node tools/checkLinks.js SYLLABUS.md            */

const fs = require('node:fs');
const path = require('node:path');

const FILE = path.join(__dirname, '..', process.argv[2] || 'SYLLABUS.md');
const CONCURRENCY = 12;
const TIMEOUT = 15000;

const lines = fs.readFileSync(FILE, 'utf8').split(/\r?\n/);
const items = [];
let section = '';
for (const line of lines) {
  const h = /^#{2,3}\s+(.*)$/.exec(line);
  if (h) { section = h[1].trim(); continue; }
  const m = /^-\s*\[[ xX]\]\s*\[(.+?)\]\((https?:\/\/[^)\s]+)\)/.exec(line.trim());
  if (m) items.push({ title: m[1], url: m[2], section });
}
console.log('checking ' + items.length + ' links from ' + path.basename(FILE) + '\n');

function ytId(u) {
  try {
    const x = new URL(u);
    const h = x.hostname.replace(/^www\./, '');
    if (h === 'youtu.be') return x.pathname.replace(/^\//, '').split('/')[0];
    if (h.endsWith('youtube.com') && x.searchParams.get('v')) return x.searchParams.get('v');
  } catch (e) {}
  return null;
}

const UA = { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
  '(KHTML, like Gecko) Chrome/131.0 Safari/537.36', 'Accept': '*/*' };

async function probe(url, method) {
  const ac = new AbortController();
  const t = setTimeout(() => ac.abort(), TIMEOUT);
  try {
    const r = await fetch(url, { method: method, redirect: 'follow', headers: UA, signal: ac.signal });
    return { status: r.status, ok: r.ok };
  } finally { clearTimeout(t); }
}

async function check(it) {
  const vid = ytId(it.url);
  try {
    if (vid) {
      const r = await probe('https://i.ytimg.com/vi/' + vid + '/mqdefault.jpg', 'HEAD');
      return r.ok ? { ...it, state: 'ok' } : { ...it, state: 'dead', info: 'video unavailable (' + r.status + ')' };
    }
    let r = await probe(it.url, 'HEAD');
    // Plenty of servers dislike HEAD; confirm with GET before condemning a link.
    if (!r.ok && r.status !== 404) r = await probe(it.url, 'GET');
    if (r.ok) return { ...it, state: 'ok' };
    if (r.status === 404 || r.status === 410) return { ...it, state: 'dead', info: 'HTTP ' + r.status };
    return { ...it, state: 'warn', info: 'HTTP ' + r.status };
  } catch (e) {
    const msg = String(e.message || e).slice(0, 60);
    if (/abort|timeout/i.test(msg)) return { ...it, state: 'warn', info: 'timeout' };
    return { ...it, state: 'dead', info: msg };
  }
}

(async () => {
  const results = [];
  let done = 0;
  const queue = items.slice();
  const workers = Array.from({ length: CONCURRENCY }, async () => {
    while (queue.length) {
      const it = queue.shift();
      results.push(await check(it));
      if (++done % 25 === 0) process.stdout.write('.');
    }
  });
  await Promise.all(workers);
  console.log('\n');

  const dead = results.filter((r) => r.state === 'dead');
  const warn = results.filter((r) => r.state === 'warn');
  console.log('  ok    ' + results.filter((r) => r.state === 'ok').length);
  console.log('  warn  ' + warn.length + '   (blocked, rate-limited or slow — probably fine in a browser)');
  console.log('  dead  ' + dead.length);

  if (dead.length) {
    console.log('\n=== DEAD ===');
    for (const d of dead) console.log('  [' + d.info + ']  ' + d.section + '\n      ' + d.title.slice(0, 90) + '\n      ' + d.url);
  }
  if (warn.length) {
    console.log('\n=== WARN (spot-check these) ===');
    const byInfo = {};
    for (const w of warn) (byInfo[w.info] = byInfo[w.info] || []).push(w);
    for (const k of Object.keys(byInfo))
      console.log('  ' + k + ' x' + byInfo[k].length + '  e.g. ' + byInfo[k][0].url.slice(0, 90));
  }
  fs.writeFileSync(path.join(__dirname, '..', 'data', 'linkcheck.json'), JSON.stringify(results, null, 1));
  console.log('\nfull results -> data/linkcheck.json');
})();
