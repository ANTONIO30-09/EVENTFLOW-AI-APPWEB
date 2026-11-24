import { STAFF_EMAIL_DOMAIN } from "../constants";

// Sin caracteres confusos: O/0, l/1/I
const UPPER = "ABCDEFGHJKLMNPQRSTUVWXYZ";
const LOWER = "abcdefghijkmnpqrstuvwxyz";
const DIGITS = "23456789";
const SYMBOLS = "!@#$%&*?";

const randomInt = (max: number) => {
  const limit = Math.floor(0x100000000 / max) * max;
  const buf = new Uint32Array(1);
  do {
    crypto.getRandomValues(buf);
  } while (buf[0] >= limit);
  return buf[0] % max;
};

const pick = (chars: string) => chars[randomInt(chars.length)];

export const generatePassword = (length = 12) => {
  const all = UPPER + LOWER + DIGITS + SYMBOLS;
  const chars = [pick(UPPER), pick(LOWER), pick(DIGITS), pick(SYMBOLS)];
  while (chars.length < length) chars.push(pick(all));
  for (let i = chars.length - 1; i > 0; i--) {
    const j = randomInt(i + 1);
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }
  return chars.join("");
};

export const buildUsername = (fullName: string, role: string, attempt = 1) => {
  const slug = fullName
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ".")
    .replace(/^\.+|\.+$/g, "")
    .slice(0, 40)
    .replace(/\.+$/g, "");
  const base = `${slug || "usuario"}.${role}`;
  const local = attempt <= 1 ? base : `${base}.${attempt}`;
  return `${local}@${STAFF_EMAIL_DOMAIN}`;
};
