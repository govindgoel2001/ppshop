import { test } from 'node:test';
import { strict as assert } from 'node:assert';
import { newToken, readSessionCookie, buildSessionCookie, buildClearCookie } from '../../api/_lib/session.js';

test('newToken returns a 64+ char base64url string', () => {
  const t = newToken();
  assert.match(t, /^[A-Za-z0-9_-]{60,}$/);
});

test('readSessionCookie extracts abl_admin', () => {
  const req = { headers: { cookie: 'foo=1; abl_admin=abc.def; bar=2' } };
  assert.equal(readSessionCookie(req), 'abc.def');
});

test('readSessionCookie returns null when absent', () => {
  assert.equal(readSessionCookie({ headers: {} }), null);
  assert.equal(readSessionCookie({ headers: { cookie: 'x=1' } }), null);
});

test('buildSessionCookie includes HttpOnly + Secure + SameSite', () => {
  const c = buildSessionCookie('TOK');
  assert.match(c, /^abl_admin=TOK;/);
  assert.match(c, /HttpOnly/);
  assert.match(c, /Secure/);
  assert.match(c, /SameSite=Strict/);
  assert.match(c, /Max-Age=\d+/);
});

test('buildClearCookie zeroes Max-Age', () => {
  assert.match(buildClearCookie(), /Max-Age=0/);
});
