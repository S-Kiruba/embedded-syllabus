'use strict';
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

// Stable id for a resource: derived from its URL (or title when link-less) so
// progress survives README edits that only touch surrounding text.
function itemId(url, title) {
  return crypto.createHash('sha1').update(url || 'notitle:' + title).digest('hex').slice(0, 12);
}
function slugId(pathParts) {
  return crypto.createHash('sha1').update(pathParts.join(' > ')).digest('hex').slice(0, 12);
}

// "Video: "Title", YouTube"  |  "Video, "Title", YouTube"  |  "PlatformIO"
function parseLinkText(text) {
  const t = text.replace(/\s+/g, ' ').trim();
  // Project gates are plain prose, not a "Type: title, source" triple.
  const proj = /^Project:\s*(.+)$/.exec(t);
  if (proj) return { kind: 'Project', title: proj[1].trim(), source: '' };
  const gate = /^Gate:\s*(.+)$/.exec(t);
  if (gate) return { kind: 'Gate', title: gate[1].trim(), source: '' };
  let m = t.match(/^([A-Za-z][A-Za-z /]*?)\s*[:,]\s*"(.+)"\s*,\s*(.+)$/);
  if (m) return { kind: m[1].trim(), title: m[2].trim(), source: m[3].trim() };
  m = t.match(/^([A-Za-z][A-Za-z /]*?)\s*[:,]\s*"(.+)"\s*$/);
  if (m) return { kind: m[1].trim(), title: m[2].trim(), source: '' };
  m = t.match(/^([A-Za-z][A-Za-z /]*?)\s*[:,]\s*(.+?)\s*,\s*([^,]+)$/);
  if (m) return { kind: m[1].trim(), title: m[2].trim(), source: m[3].trim() };
  return { kind: 'Link', title: t, source: '' };
}

const YT = /(?:youtube\.com\/(?:watch\?v=|playlist\?list=)|youtu\.be\/)([A-Za-z0-9_-]+)/;
function media(url) {
  if (!url) return {};
  const m = url.match(YT);
  if (m && url.includes('watch?v=')) return { provider: 'youtube', videoId: m[1] };
  if (m) return { provider: 'youtube', playlistId: m[1] };
  try { return { provider: new URL(url).hostname.replace(/^www\./, '') }; } catch { return {}; }
}

// Accumulate raw markdown onto the section currently being read.
function addBrief(stack, line) {
  const owner = stack[stack.length - 1].node;
  if (!owner || owner.level === undefined) return;
  owner.brief = (owner.brief === undefined ? '' : owner.brief + '\n') + line;
}

function parse(mdPath) {
  const raw = fs.readFileSync(mdPath, 'utf8');
  // Join continuation lines so a link split across lines still parses.
  const lines = [];
  for (const line of raw.split(/\r?\n/)) {
    const prev = lines[lines.length - 1];
    if (prev !== undefined && /^\s*-?\s*(#+\s*)?\[/.test(prev) &&
        (prev.split('[').length - 1) > (prev.split(']').length - 1)) {
      lines[lines.length - 1] = prev + ' ' + line.trim();
    } else lines.push(line);
  }

  const root = { title: 'Learn Embedded Systems', children: [], items: [] };
  const stack = [{ rank: -1, node: root }];
  let inToc = false, started = false, order = 0;
  const seenIds = new Set();

  let inFence = false;
  for (const line of lines) {
    if (/^##\s+Table of Contents/.test(line)) { inToc = true; continue; }
    if (inToc) { if (/^---\s*$/.test(line)) inToc = false; continue; }

    // Inside a fenced block everything is literal prose, including "- [ ]" lines.
    if (/^\s*```/.test(line)) {
      inFence = !inFence;
      if (started) addBrief(stack, line);
      continue;
    }
    if (inFence) { if (started) addBrief(stack, line); continue; }

    const indent = (line.match(/^\s*/) || [''])[0].length;
    const body = line.trim();
    if (!body || body === '---') {
      if (started && !body) addBrief(stack, '');
      continue;
    }

    // Heading: "## X", "### X", "- #### X", "#### [ ] X"
    const h = body.match(/^(?:-\s+)?(#{2,6})\s*(?:\[[ x]\]\s*)?(.+?)\s*$/);
    if (h && !/^\[/.test(h[2])) {
      const level = h[1].length;
      let title = h[2].replace(/\s*#+\s*$/, '').trim();
      if (level === 2 && /^Introduction$/i.test(title)) title = 'Getting Started';
      if (level === 2) started = true;
      if (!started) continue;
      const rank = level * 1000 + indent;
      while (stack.length > 1 && stack[stack.length - 1].rank >= rank) stack.pop();
      const parent = stack[stack.length - 1].node;
      const pathParts = stack.slice(1).map(s => s.node.title).concat(title);
      const node = {
        id: slugId(pathParts), title, level: stack.length,
        path: pathParts, children: [], items: [], blurb: '', brief: '',
      };
      parent.children.push(node);
      stack.push({ rank, node });
      continue;
    }

    // Blockquote right under a heading = that section's blurb.
    const bq = body.match(/^>\s?(.*)$/);
    if (bq && started) {
      const owner = stack[stack.length - 1].node;
      if (owner !== root) owner.blurb = ((owner.blurb ? owner.blurb + ' ' : '') + bq[1]).trim();
      continue;
    }

    // Anything else that is not a checkbox item is prose belonging to the section
    // (a project brief, for example). Kept as raw markdown for the client to render.
    if (started && !/^-\s+\[[ xX]\]/.test(body)) { addBrief(stack, line); continue; }

    // Resource: "- [ ] [text](url) [beginner]" — trailing tags are optional, and an
    // item with no link at all is a project gate.
    const it = body.match(/^-\s+\[([ xX])\]\s+(.*)$/);
    if (it && started) {
      const rest = it[2].trim();
      const link = rest.match(/^\[([\s\S]+?)\]\((\S+?)\)\s*(.*)$/);
      const text = link ? link[1] : rest;
      const url = link ? link[2] : '';
      const tags = link ? link[3] : '';
      const meta = parseLinkText(text);
      const owner = stack[stack.length - 1].node;
      let id = itemId(url, meta.title);
      while (seenIds.has(id)) id = itemId(url + '#' + owner.path.join('/'), meta.title + '#' + order);
      seenIds.add(id);
      owner.items.push({
        id,
        order: order++,
        title: meta.title, kind: meta.kind, source: meta.source, url,
        level: /\[beginner\]/.test(tags) ? 'beginner'
             : (/\[reference\]/.test(tags) ? 'reference' : ''),
        extra: /\[extra\]/.test(tags),
        alt: /\[alt\]/.test(tags),
        core: !/\[extra\]|\[alt\]/.test(tags),
        optionalPaid: /\[optional-paid\]/.test(tags),
        path: owner === root ? [] : owner.path,
        ...media(url),
      });
    }
  }
  return root;
}

// Flatten to sections (level-1 chapters) with a nested topic tree.
// Prefer the generated syllabus; fall back to the original resource list.
// (README.md is the repo's front page, not curriculum data.)
function resolveSource(dir) {
  const syllabus = path.join(dir, 'SYLLABUS.md');
  if (fs.existsSync(syllabus)) return syllabus;
  return path.join(dir, 'sources', 'original-resources.md');
}

function build(mdPath) {
  const root = parse(mdPath);
  let totalItems = 0;
  const walk = (n) => {
    n.brief = String(n.brief || '').replace(/^\n+|\n+$/g, '');
    n.itemCount = n.items.length;
    for (const c of n.children) n.itemCount += walk(c);
    return n.itemCount;
  };
  for (const s of root.children) totalItems += walk(s);
  // Prose sections ("How to use this", "Credits") carry no resources — drop them.
  const sections = root.children.filter((s) => s.itemCount > 0);
  return { title: root.title, sections, totalItems, generatedAt: new Date().toISOString() };
}

module.exports = { build, resolveSource };

if (require.main === module) {
  const out = build(resolveSource(path.join(__dirname, '..')));
  process.stdout.write(JSON.stringify(out, null, 2));
}
