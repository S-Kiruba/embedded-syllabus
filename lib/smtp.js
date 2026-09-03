'use strict';
/* Minimal SMTP client — enough to send one plain/HTML mail, no dependencies.
   Supports implicit TLS (port 465), STARTTLS (587) and AUTH LOGIN / PLAIN. */
const net = require('node:net');
const tls = require('node:tls');
const crypto = require('node:crypto');

const CRLF = '\r\n';

function session(socket, timeoutMs) {
  let buf = '';
  let waiter = null;
  socket.setEncoding('utf8');
  socket.setTimeout(timeoutMs);

  const pump = () => {
    if (!waiter) return;
    // A complete reply ends with "NNN <text>CRLF" (no hyphen after the code).
    const lines = buf.split(CRLF);
    for (let i = 0; i < lines.length; i++) {
      if (/^\d{3} /.test(lines[i])) {
        const chunk = lines.slice(0, i + 1).join(CRLF);
        buf = lines.slice(i + 1).join(CRLF);
        const w = waiter; waiter = null;
        return w.resolve({ code: Number(chunk.slice(0, 3)), text: chunk });
      }
    }
  };

  socket.on('data', (d) => { buf += d; pump(); });
  const fail = (e) => { if (waiter) { const w = waiter; waiter = null; w.reject(e); } };
  socket.on('error', fail);
  socket.on('timeout', () => { socket.destroy(); fail(new Error('SMTP timeout')); });
  socket.on('close', () => fail(new Error('SMTP connection closed early')));

  return {
    read: () => new Promise((resolve, reject) => { waiter = { resolve, reject }; pump(); }),
    write: (line) => socket.write(line + CRLF),
    socket,
  };
}

async function expect(s, ok, what) {
  const r = await s.read();
  if (!ok.includes(r.code)) throw new Error('SMTP ' + what + ' failed: ' + r.text.split(CRLF)[0]);
  return r;
}

function buildMessage(o) {
  const boundary = 'b' + crypto.randomBytes(12).toString('hex');
  const head = [
    'From: ' + o.from,
    'To: ' + o.to,
    'Subject: =?utf-8?B?' + Buffer.from(o.subject, 'utf8').toString('base64') + '?=',
    'Date: ' + new Date().toUTCString(),
    'Message-ID: <' + crypto.randomUUID() + '@embedded-tracker>',
    'MIME-Version: 1.0',
    'Content-Type: multipart/alternative; boundary="' + boundary + '"',
  ].join(CRLF);

  const part = (type, body) => [
    '--' + boundary,
    'Content-Type: ' + type + '; charset=utf-8',
    'Content-Transfer-Encoding: base64',
    '',
    Buffer.from(body, 'utf8').toString('base64').replace(/(.{76})/g, '$1' + CRLF),
  ].join(CRLF);

  return head + CRLF + CRLF +
    part('text/plain', o.text) + CRLF +
    part('text/html', o.html || ('<pre>' + o.text + '</pre>')) + CRLF +
    '--' + boundary + '--' + CRLF;
}

async function sendMail(cfg, msg) {
  const timeout = cfg.timeoutMs || 15000;
  const port = Number(cfg.port) || (cfg.secure ? 465 : 587);

  let socket = cfg.secure
    ? tls.connect({ host: cfg.host, port, servername: cfg.host, rejectUnauthorized: cfg.rejectUnauthorized !== false })
    : net.connect({ host: cfg.host, port });

  await new Promise((resolve, reject) => {
    socket.once(cfg.secure ? 'secureConnect' : 'connect', resolve);
    socket.once('error', reject);
    socket.setTimeout(timeout, () => reject(new Error('SMTP connect timeout')));
  });

  let s = session(socket, timeout);
  await expect(s, [220], 'greeting');

  const ehlo = async () => { s.write('EHLO embedded-tracker'); return expect(s, [250], 'EHLO'); };
  let caps = await ehlo();

  if (!cfg.secure && /STARTTLS/i.test(caps.text)) {
    s.write('STARTTLS');
    await expect(s, [220], 'STARTTLS');
    socket.removeAllListeners('data');
    socket.removeAllListeners('error');
    socket.removeAllListeners('close');
    socket.removeAllListeners('timeout');
    socket = tls.connect({
      socket, servername: cfg.host,
      rejectUnauthorized: cfg.rejectUnauthorized !== false,
    });
    await new Promise((resolve, reject) => {
      socket.once('secureConnect', resolve);
      socket.once('error', reject);
    });
    s = session(socket, timeout);
    caps = await ehlo();
  }

  if (cfg.user) {
    if (/AUTH[ =-][^\r\n]*PLAIN/i.test(caps.text)) {
      const token = Buffer.from('\0' + cfg.user + '\0' + cfg.pass, 'utf8').toString('base64');
      s.write('AUTH PLAIN ' + token);
      await expect(s, [235], 'AUTH PLAIN');
    } else {
      s.write('AUTH LOGIN');
      await expect(s, [334], 'AUTH LOGIN');
      s.write(Buffer.from(cfg.user, 'utf8').toString('base64'));
      await expect(s, [334], 'AUTH username');
      s.write(Buffer.from(cfg.pass, 'utf8').toString('base64'));
      await expect(s, [235], 'AUTH password');
    }
  }

  const envelopeFrom = (cfg.from || cfg.user).replace(/^.*<|>.*$/g, '');
  s.write('MAIL FROM:<' + envelopeFrom + '>');
  await expect(s, [250], 'MAIL FROM');
  s.write('RCPT TO:<' + msg.to + '>');
  await expect(s, [250, 251], 'RCPT TO');
  s.write('DATA');
  await expect(s, [354], 'DATA');

  const body = buildMessage({ from: cfg.from || cfg.user, to: msg.to, subject: msg.subject, text: msg.text, html: msg.html });
  // Dot-stuffing: a line that is just "." would otherwise end the message.
  socket.write(body.replace(/\r\n\./g, CRLF + '..'));
  s.write('.');
  const done = await expect(s, [250], 'message accept');

  try { s.write('QUIT'); } catch (e) {}
  socket.end();
  return { accepted: true, response: done.text.split(CRLF)[0] };
}

module.exports = { sendMail, buildMessage };
