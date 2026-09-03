'use strict';
/* WhatsApp delivery via either the Meta Cloud API or Twilio. No dependencies —
   both are plain HTTPS calls. Credentials come from data/config.json and never
   leave the server. */

// WhatsApp wants digits only, country code included, no "+" for Meta.
const digits = (n) => String(n || '').replace(/[^\d]/g, '');

async function sendMeta(cfg, to, text) {
  const url = cfg.apiBase.replace(/\/+$/, '') + '/' + cfg.phoneNumberId + '/messages';
  const payload = cfg.template
    ? {
        messaging_product: 'whatsapp', to: digits(to), type: 'template',
        template: {
          name: cfg.template,
          language: { code: cfg.language || 'en' },
          components: [{ type: 'body', parameters: [{ type: 'text', text: text }] }],
        },
      }
    : { messaging_product: 'whatsapp', to: digits(to), type: 'text', text: { preview_url: false, body: text } };

  const res = await fetch(url, {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + cfg.accessToken, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const e = (data.error || {});
    throw new Error('Meta API ' + res.status + ': ' + (e.message || JSON.stringify(data).slice(0, 200)));
  }
  return { id: ((data.messages || [])[0] || {}).id || '', provider: 'meta' };
}

async function sendTwilio(cfg, to, text) {
  const url = cfg.apiBase.replace(/\/+$/, '') + '/2010-04-01/Accounts/' + cfg.accountSid + '/Messages.json';
  const form = new URLSearchParams({
    From: cfg.from.startsWith('whatsapp:') ? cfg.from : 'whatsapp:+' + digits(cfg.from),
    To: 'whatsapp:+' + digits(to),
    Body: text,
  });
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: 'Basic ' + Buffer.from(cfg.accountSid + ':' + cfg.authToken).toString('base64'),
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: form,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error('Twilio ' + res.status + ': ' + (data.message || JSON.stringify(data).slice(0, 200)));
  return { id: data.sid || '', provider: 'twilio' };
}

async function send(whatsappCfg, to, text) {
  if (!to) throw new Error('No WhatsApp number saved for this account.');
  if (whatsappCfg.provider === 'twilio') return sendTwilio(whatsappCfg.twilio, to, text);
  return sendMeta(whatsappCfg.meta, to, text);
}

module.exports = { send, digits };
