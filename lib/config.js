'use strict';
const fs = require('node:fs');
const path = require('node:path');

const FILE = path.join(__dirname, '..', 'data', 'config.json');
const EXAMPLE = path.join(__dirname, '..', 'config.example.json');

const DEFAULTS = {
  smtp: { enabled: false, host: '', port: 587, secure: false, user: '', pass: '', from: '' },
  whatsapp: {
    enabled: false,
    provider: 'meta',
    meta: { apiBase: 'https://graph.facebook.com/v21.0', phoneNumberId: '', accessToken: '', template: '', language: 'en' },
    twilio: { apiBase: 'https://api.twilio.com', accountSid: '', authToken: '', from: '' },
  },
  desktop: { enabled: process.platform === 'win32' },
  appUrl: '',
};

function deepMerge(base, over) {
  const out = Array.isArray(base) ? base.slice() : Object.assign({}, base);
  for (const k of Object.keys(over || {})) {
    const v = over[k];
    out[k] = (v && typeof v === 'object' && !Array.isArray(v) && base && typeof base[k] === 'object')
      ? deepMerge(base[k], v) : v;
  }
  return out;
}

let cached = null, cachedMtime = 0;

function load() {
  try {
    const m = fs.statSync(FILE).mtimeMs;
    if (cached && m === cachedMtime) return cached;
    cachedMtime = m;
    cached = deepMerge(DEFAULTS, JSON.parse(fs.readFileSync(FILE, 'utf8')));
  } catch (e) {
    cached = deepMerge(DEFAULTS, {});
    cachedMtime = 0;
  }
  return cached;
}

// What the browser is allowed to know: which channels are usable and why not,
// never a secret.
function capabilities() {
  const c = load();
  const wa = c.whatsapp.provider === 'twilio'
    ? { ok: !!(c.whatsapp.twilio.accountSid && c.whatsapp.twilio.authToken && c.whatsapp.twilio.from),
        missing: 'accountSid, authToken and from' }
    : { ok: !!(c.whatsapp.meta.phoneNumberId && c.whatsapp.meta.accessToken),
        missing: 'phoneNumberId and accessToken' };

  const reasons = {};
  const desktop = process.platform === 'win32' && !!c.desktop.enabled;
  if (!desktop) {
    reasons.desktop = process.platform !== 'win32'
      ? 'The server is not running on Windows.'
      : 'Turned off — set "desktop": { "enabled": true } in data/config.json.';
  }
  const email = !!(c.smtp.enabled && c.smtp.host && c.smtp.user);
  if (!email) {
    reasons.email = !c.smtp.enabled
      ? 'Turned off — set "smtp": { "enabled": true, ... } in data/config.json.'
      : 'Incomplete — data/config.json needs smtp.host and smtp.user.';
  }
  if (!wa.ok || !c.whatsapp.enabled) {
    reasons.whatsapp = !c.whatsapp.enabled
      ? 'Turned off — set "whatsapp": { "enabled": true, ... } in data/config.json.'
      : 'Incomplete — data/config.json needs whatsapp.' + c.whatsapp.provider + '.' + wa.missing + '.';
  }

  return {
    browser: true,
    desktop: desktop,
    email: email,
    whatsapp: !!(c.whatsapp.enabled && wa.ok),
    whatsappProvider: c.whatsapp.provider,
    reasons: reasons,
    configFile: FILE,
  };
}

function writeExample() {
  if (fs.existsSync(EXAMPLE)) return;
  fs.writeFileSync(EXAMPLE, JSON.stringify({
    _readme: 'Copy this to data/config.json and fill in only the channels you want. data/config.json is gitignored.',
    smtp: {
      _gmail: 'Gmail: host smtp.gmail.com, port 465, secure true, pass = a 16-char App Password (not your login password).',
      enabled: false, host: 'smtp.gmail.com', port: 465, secure: true,
      user: 'you@gmail.com', pass: 'app-password-here', from: 'Learning Tracker <you@gmail.com>',
    },
    whatsapp: {
      _providers: 'Set provider to "meta" (WhatsApp Cloud API) or "twilio" (Twilio WhatsApp sandbox / sender).',
      enabled: false, provider: 'meta',
      meta: {
        apiBase: 'https://graph.facebook.com/v21.0', phoneNumberId: '000000000000000',
        accessToken: 'EAAG...', template: '', language: 'en',
        _template: 'Leave template empty to send a free-form text (only works inside a 24h customer-service window). Set it to an approved template name to send outside that window.',
      },
      twilio: {
        apiBase: 'https://api.twilio.com', accountSid: 'ACxxxxxxxx',
        authToken: 'xxxxxxxx', from: 'whatsapp:+14155238886',
      },
    },
    desktop: { _note: 'Windows toast via PowerShell. Works only when the server runs on Windows.', enabled: true },
    appUrl: 'http://127.0.0.1:5178',
  }, null, 2) + '\n');
}

module.exports = { load, capabilities, writeExample, FILE };
