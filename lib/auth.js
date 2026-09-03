'use strict';
const crypto = require('node:crypto');
const { q, plain } = require('./db');

const SESSION_DAYS = 30;
const COOKIE = 'es_session';

const hash = (password, salt) =>
  crypto.scryptSync(password, salt, 64, { N: 16384, r: 8, p: 1 }).toString('hex');

function verify(password, user) {
  const attempt = Buffer.from(hash(password, user.pw_salt), 'hex');
  const stored = Buffer.from(user.pw_hash, 'hex');
  return attempt.length === stored.length && crypto.timingSafeEqual(attempt, stored);
}

// Deterministic short user id derived from the email, so the same mail address
// always maps to the same account identifier.
const userIdFor = (emailLc) =>
  'u_' + crypto.createHash('sha256').update(emailLc).digest('hex').slice(0, 16);

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function register({ email, password, displayName }) {
  email = String(email || '').trim();
  const emailLc = email.toLowerCase();
  if (!EMAIL_RE.test(emailLc)) throw httpError(400, 'Enter a valid email address.');
  if (String(password || '').length < 8) throw httpError(400, 'Password must be at least 8 characters.');
  if (q.userByEmail.get(emailLc)) throw httpError(409, 'An account already exists for this email. Try signing in.');

  const salt = crypto.randomBytes(16).toString('hex');
  const now = new Date().toISOString();
  const id = userIdFor(emailLc);
  const name = String(displayName || '').trim() || email.split('@')[0];
  q.createUser.run(id, email, emailLc, name, hash(password, salt), salt, now);
  return plain(q.userById.get(id));
}

function login({ email, password }) {
  const emailLc = String(email || '').trim().toLowerCase();
  const user = q.userByEmail.get(emailLc);
  const fail = () => httpError(401, 'Email or password is incorrect.');
  if (!user) { crypto.scryptSync(String(password || ''), 'decoy', 64); throw fail(); }
  if (!verify(String(password || ''), user)) throw fail();
  q.touchLogin.run(new Date().toISOString(), user.id);
  return plain(q.userById.get(user.id));
}

function startSession(userId) {
  const token = crypto.randomBytes(32).toString('base64url');
  const now = new Date();
  const exp = new Date(now.getTime() + SESSION_DAYS * 864e5);
  q.reapSessions.run(now.toISOString());
  q.createSession.run(token, userId, now.toISOString(), exp.toISOString());
  return { token, expires: exp };
}

function userFromRequest(req) {
  const raw = req.headers.cookie || '';
  const match = raw.split(';').map(s => s.trim()).find(s => s.startsWith(COOKIE + '='));
  if (!match) return null;
  const token = decodeURIComponent(match.slice(COOKIE.length + 1));
  const sess = q.session.get(token);
  if (!sess) return null;
  if (new Date(sess.expires_at) < new Date()) { q.killSession.run(token); return null; }
  const user = q.userById.get(sess.user_id);
  return user ? { ...plain(user), _token: token } : null;
}

const cookieHeader = (token, expires) =>
  `${COOKIE}=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Expires=${expires.toUTCString()}`;
const clearCookieHeader = () =>
  `${COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Expires=Thu, 01 Jan 1970 00:00:00 GMT`;

function httpError(status, message) {
  const e = new Error(message);
  e.status = status;
  return e;
}

const publicUser = (u) => ({
  id: u.id, email: u.email, displayName: u.display_name,
  createdAt: u.created_at, lastLoginAt: u.last_login_at,
});

module.exports = {
  register, login, startSession, userFromRequest, publicUser,
  cookieHeader, clearCookieHeader, httpError, hash, verify, COOKIE,
};
