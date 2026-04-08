// api/_lib/validate.js
// Shared input validation helpers.

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const OTP_RE = /^\d{6}$/;
const VALID_CODES = new Set(['FIRST5', 'BULK10']);

export function validateEmail(email) {
  if (!email || typeof email !== 'string') return false;
  return EMAIL_RE.test(email.trim()) && email.length <= 254;
}

export function validateOtp(otp) {
  if (!otp || typeof otp !== 'string') return false;
  return OTP_RE.test(otp.trim());
}

export function validateCouponCode(code) {
  if (!code || typeof code !== 'string') return false;
  return VALID_CODES.has(code.trim().toUpperCase());
}

export function getIp(req) {
  return (
    req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
    req.headers['x-real-ip'] ||
    req.socket?.remoteAddress ||
    'unknown'
  );
}
