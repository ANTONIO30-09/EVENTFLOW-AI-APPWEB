import { Guest } from "../types";

export type RowStatus = "ok" | "warning" | "duplicate" | "error";

export interface ParsedRow {
  line: number;
  raw: string;
  name: string;
  phone: string;
  status: RowStatus;
  note?: string;
}

export const nameKey = (name: string) =>
  name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();

const PHONE_RE = /\+?\d[\d\s\-().]{5,}\d/;

const titleCase = (text: string) =>
  text
    .toLowerCase()
    .split(" ")
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w))
    .join(" ");

const tidyName = (text: string) => {
  const cleaned = text
    .replace(/[,;|:\t]+/g, " ")
    .replace(/\s[-–—]\s/g, " ")
    .replace(/\s+/g, " ")
    .replace(/^[\s\-–—.]+|[\s\-–—.]+$/g, "");
  const singleCase = cleaned === cleaned.toLowerCase() || cleaned === cleaned.toUpperCase();
  return singleCase ? titleCase(cleaned) : cleaned;
};

export interface PhoneResult {
  phone: string;
  ok: boolean;
  note?: string;
}

export const normalizePhone = (raw: string): PhoneResult => {
  const trimmed = raw.trim();
  const digits = trimmed.replace(/\D/g, "");
  if (!digits) return { phone: "", ok: false, note: "Sin número" };

  if (trimmed.startsWith("+")) {
    const ok = digits.length >= 8 && digits.length <= 15;
    return { phone: "+" + digits, ok, note: ok ? undefined : "Número internacional con largo raro" };
  }
  if (digits.length === 8) {
    const ok = /^[67]/.test(digits);
    return { phone: "+591" + digits, ok, note: ok ? undefined : "No empieza con 6 o 7, revísalo" };
  }
  if (digits.length === 11 && digits.startsWith("591")) {
    const ok = /^591[67]/.test(digits);
    return { phone: "+" + digits, ok, note: ok ? undefined : "No empieza con 6 o 7, revísalo" };
  }
  return { phone: digits, ok: false, note: "Formato de número no reconocido" };
};

export const parseGuestText = (text: string, existing: Guest[]): ParsedRow[] => {
  const seen = new Set(existing.map((g) => nameKey(g.name)));
  const rows: ParsedRow[] = [];

  text.split(/\r?\n/).forEach((rawLine, index) => {
    const raw = rawLine.trim();
    if (!raw) return;

    const line = raw.replace(/^\d{1,3}\s*[.)]\s+/, "").replace(/^\d{1,3}\s+-\s+/, "");
    const match = line.match(PHONE_RE);
    const phoneRaw = match ? match[0] : "";
    const namePart = match ? line.replace(match[0], " ") : line;
    const name = tidyName(namePart);
    const phone = normalizePhone(phoneRaw);

    const base = { line: index + 1, raw, name, phone: phone.phone };

    if (name.length < 3 || !/[a-zA-ZÀ-ÿ]/.test(name)) {
      rows.push({ ...base, status: "error", note: "Falta el nombre" });
      return;
    }

    const key = nameKey(name);
    if (seen.has(key)) {
      rows.push({ ...base, status: "duplicate", note: "Ya está en la lista del evento" });
      return;
    }
    seen.add(key);

    if (/\d/.test(name)) {
      rows.push({ ...base, status: "warning", note: "El nombre contiene números" });
    } else if (!phone.ok) {
      rows.push({ ...base, status: "warning", note: phone.note });
    } else {
      rows.push({ ...base, status: "ok" });
    }
  });

  return rows;
};
