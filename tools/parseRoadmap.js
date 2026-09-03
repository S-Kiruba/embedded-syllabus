'use strict';
/* Parse m3y54m/embedded-engineering-roadmap README into {section -> items}. */
const fs = require('node:fs');

const PAID_HOSTS = ['udemy.com', 'oreilly.com', 'a.co', 'amazon.com', 'amazon.sg', 'packtpub.com',
  'link.springer.com', 'dl.acm.org', 'acm.org', 'ieee.org', 'manning.com', 'wiley.com',
  'informit.com', 'apress', 'routledge.com', 'pearson.com', 'deitel.com', 'nostarch.com',
  'mhprofessional.com', 'global.oup.com', 'mitpress.mit.edu', 'leanpub.com', 'audiobooks.com',
  'artofelectronics.net', 'stroustrup.com', 'iso.org', 'educative.io', 'pluralsight',
  'elsevier', 'taylorfrancis', 'scaler.com', 'coursera.org', 'edx.org'];

const stripEmoji = (s) => s
  .replace(/[\u{1F300}-\u{1FAFF}\u{2190}-\u{21FF}\u{2300}-\u{27BF}\u{2B00}-\u{2BFF}\u{FE0F}\u{200D}\u{20E3}]/gu, '')
  .replace(/\s+/g, ' ').trim();

const host = (u) => { try { return new URL(u).hostname.replace(/^www\./, ''); } catch (e) { return ''; } };
const isPaid = (u) => { const h = host(u); return PAID_HOSTS.some((p) => h.includes(p)); };

function typeOf(raw) {
  if (raw.includes('📘')) return 'Book';
  if (raw.includes('🎞')) return 'Video';
  if (raw.includes('📝')) return 'Article';
  return 'Link';
}

function sourceOf(u) {
  const h = host(u);
  const map = {
    'youtube.com': 'YouTube', 'youtu.be': 'YouTube', 'github.com': 'GitHub',
    'interrupt.memfault.com': 'Memfault Interrupt', 'mu.microchip.com': 'Microchip University',
    'academy.nordicsemi.com': 'Nordic Academy', 'bootlin.com': 'Bootlin',
    'freertos.org': 'FreeRTOS', 'docs.zephyrproject.org': 'Zephyr',
    'throwtheswitch.org': 'ThrowTheSwitch', 'barrgroup.com': 'Barr Group',
    'embeddedrelated.com': 'EmbeddedRelated', 'embedded.com': 'Embedded.com',
    'renode.io': 'Renode', 'qemu.org': 'QEMU', 'wokwi.com': 'Wokwi',
    'embeddedartistry.com': 'Embedded Artistry', 'beningo.com': 'Beningo',
    'allaboutcircuits.com': 'All About Circuits', 'sergioprado.blog': 'Sergio Prado',
    'docs.espressif.com': 'Espressif', 'lwn.net': 'LWN', 'man7.org': 'man7',
    'state-machine.com': 'Quantum Leaps', 'pigweed.dev': 'Pigweed',
  };
  if (map[h]) return map[h];
  return h.replace(/\.(com|org|net|io|dev|blog|info|co|me)$/, '').replace(/^(docs|blog|learn|www|developer)\./, '');
}

function parse(file) {
  const lines = fs.readFileSync(file, 'utf8').split(/\r?\n/);
  const sections = [];
  let cur = null;
  const path = [];

  for (const line of lines) {
    const h = /^(#{2,6})\s+(.*)$/.exec(line);
    if (h) {
      const depth = h[1].length;
      let title = h[2];
      // Some headings are themselves links: "###### [🔸 GoogleTest](url)"
      const asLink = /^\[(.+)\]\((https?:\/\/[^)\s]+)\)\s*$/.exec(title.trim());
      let headingUrl = '';
      if (asLink) { title = asLink[1]; headingUrl = asLink[2]; }
      title = stripEmoji(title);
      path.length = Math.max(0, depth - 2);
      path[depth - 2] = title;
      cur = { path: path.slice(0, depth - 1).filter(Boolean), title, depth, items: [] };
      sections.push(cur);
      if (headingUrl && !isPaid(headingUrl)) {
        cur.items.push({ title, url: headingUrl, type: 'Link', source: sourceOf(headingUrl),
          gem: false, beginner: false, paid: false });
      }
      continue;
    }
    const it = /^\s*-\s*\[(.+?)\]\((https?:\/\/[^)\s]+)\)\s*$/.exec(line);
    if (it && cur) {
      const raw = it[1];
      const url = it[2];
      if (url.includes('shields.io')) continue;
      cur.items.push({
        title: stripEmoji(raw),
        url,
        type: typeOf(raw),
        source: sourceOf(url),
        gem: raw.includes('💎'),
        beginner: raw.includes('👶'),
        paid: isPaid(url),
      });
    }
  }
  return sections.filter((s) => s.items.length);
}

const out = parse(__dirname + '/roadmap.md');
fs.writeFileSync(__dirname + '/roadmap.json', JSON.stringify(out, null, 1));

if (process.argv[2] === '--list') {
  for (const s of out) {
    const free = s.items.filter((i) => !i.paid).length;
    console.log(String(free).padStart(3) + ' free / ' + String(s.items.length).padStart(3) +
      '  ' + '  '.repeat(s.depth - 2) + s.path.join(' > '));
  }
} else {
  console.log('sections: ' + out.length);
  console.log('items:    ' + out.reduce((n, s) => n + s.items.length, 0));
  console.log('free:     ' + out.reduce((n, s) => n + s.items.filter((i) => !i.paid).length, 0));
  console.log('gems:     ' + out.reduce((n, s) => n + s.items.filter((i) => i.gem && !i.paid).length, 0));
}
