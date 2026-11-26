const escapeCell = (value: string | number) => {
  const s = String(value ?? "");
  return /[";\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

// Separador ";" y BOM UTF-8: Excel en espanol lo abre en columnas y con tildes correctas
export const toCsv = (rows: (string | number)[][]) =>
  "\uFEFF" + rows.map((row) => row.map(escapeCell).join(";")).join("\r\n");

export const downloadCsv = (filename: string, rows: (string | number)[][]) => {
  const blob = new Blob([toCsv(rows)], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};

export const formatDateTime = (iso?: string | null) => {
  if (!iso) return "";
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "" : d.toLocaleString("es-BO");
};
