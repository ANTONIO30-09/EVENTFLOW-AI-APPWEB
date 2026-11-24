"use client";

import { useState } from "react";
import { X, Loader2, ClipboardPaste, AlertTriangle } from "lucide-react";
import { Guest } from "../types";
import { parseGuestText, ParsedRow, RowStatus } from "../lib/parseGuests";
import { importGuests } from "../services/guestService";

interface Props {
  eventId: string;
  eventName: string;
  existing: Guest[];
  onClose: () => void;
  onImported: () => void;
}

const STATUS_STYLES: Record<RowStatus, string> = {
  ok: "bg-green-500/15 text-green-400 border-green-500/30",
  warning: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
  duplicate: "bg-white/10 text-brand-porcelain/60 border-white/15",
  error: "bg-red-500/15 text-red-400 border-red-500/30",
};

const STATUS_LABELS: Record<RowStatus, string> = {
  ok: "Listo",
  warning: "Revisar",
  duplicate: "Repetido",
  error: "Error",
};

const PLACEHOLDER = `Juan Pérez 70123456
María López - 71234567
Carlos Ruiz, 68765432
3) Ana Torrez +591 72345678`;

export default function ImportGuestsModal({ eventId, eventName, existing, onClose, onImported }: Props) {
  const [text, setText] = useState("");
  const [rows, setRows] = useState<ParsedRow[] | null>(null);
  const [importing, setImporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const importable = rows ? rows.filter((r) => r.status === "ok" || r.status === "warning") : [];
  const count = (status: RowStatus) => (rows ? rows.filter((r) => r.status === status).length : 0);

  const handleAnalyze = () => {
    setError(null);
    setRows(parseGuestText(text, existing));
  };

  const handleImport = async () => {
    if (importable.length === 0) return;
    setImporting(true);
    setError(null);
    try {
      await importGuests(
        eventId,
        importable.map((r) => ({ name: r.name, phone: r.phone }))
      );
      onImported();
      onClose();
    } catch (err) {
      console.error(err);
      setError("No se pudo importar. Algunos invitados pueden haberse guardado: revisa la lista antes de reintentar.");
      onImported();
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-3xl bg-[#0d131f] border border-white/10 rounded-[2rem] shadow-2xl p-8 max-h-[90vh] flex flex-col">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-white">Importar invitados</h2>
            <p className="text-xs text-brand-porcelain/50">{eventName}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors" title="Cerrar">
            <X size={18} />
          </button>
        </div>

        {rows === null ? (
          <>
            <p className="text-sm text-brand-porcelain/60 mb-3">
              Pega el texto del cliente: un invitado por línea, con su nombre y su número. No importa el orden ni los símbolos.
            </p>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={PLACEHOLDER}
              rows={12}
              className="w-full bg-white/[0.04] border border-white/10 rounded-xl py-3 px-4 text-sm text-white placeholder:text-brand-porcelain/30 focus:outline-none focus:border-brand-bronze/60 transition-colors resize-none font-mono"
            />
            <button
              onClick={handleAnalyze}
              disabled={text.trim() === ""}
              className="mt-4 py-3 bg-gradient-to-r from-brand-bronze to-[#FFD700] text-brand-night rounded-xl text-sm font-bold hover:scale-[1.02] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <ClipboardPaste size={16} />
              Analizar texto
            </button>
          </>
        ) : (
          <>
            <div className="flex flex-wrap gap-2 mb-3 text-xs font-bold">
              <span className={`px-3 py-1 rounded-full border ${STATUS_STYLES.ok}`}>{count("ok")} listos</span>
              <span className={`px-3 py-1 rounded-full border ${STATUS_STYLES.warning}`}>{count("warning")} por revisar</span>
              <span className={`px-3 py-1 rounded-full border ${STATUS_STYLES.duplicate}`}>{count("duplicate")} repetidos</span>
              <span className={`px-3 py-1 rounded-full border ${STATUS_STYLES.error}`}>{count("error")} con error</span>
            </div>
            <p className="text-[11px] text-brand-porcelain/40 mb-3">
              Se importarán los listos y los marcados &quot;Revisar&quot;. Los repetidos y con error se omiten. Podrás editar cada invitado después.
            </p>

            <div className="overflow-y-auto no-scrollbar flex-1 min-h-0 border border-white/10 rounded-xl">
              <table className="w-full text-left text-sm">
                <thead className="sticky top-0 bg-[#0d131f]">
                  <tr className="text-[11px] uppercase tracking-wider text-brand-porcelain/50 border-b border-white/10">
                    <th className="px-4 py-3 font-bold">Línea</th>
                    <th className="px-3 py-3 font-bold">Nombre</th>
                    <th className="px-3 py-3 font-bold">Teléfono</th>
                    <th className="px-3 py-3 font-bold">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.line} className="border-b border-white/5 last:border-0">
                      <td className="px-4 py-2 text-brand-porcelain/40">{r.line}</td>
                      <td className="px-3 py-2 text-white">{r.name || <span className="text-brand-porcelain/40">{r.raw}</span>}</td>
                      <td className="px-3 py-2 text-brand-porcelain/70 font-mono text-xs">{r.phone || "—"}</td>
                      <td className="px-3 py-2">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${STATUS_STYLES[r.status]}`}>{STATUS_LABELS[r.status]}</span>
                        {r.note && <span className="ml-2 text-[11px] text-brand-porcelain/50">{r.note}</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {error && (
              <div className="flex gap-2 items-start mt-3 text-sm text-red-400">
                <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                <p>{error}</p>
              </div>
            )}

            <div className="flex gap-3 mt-4">
              <button onClick={() => setRows(null)} disabled={importing} className="flex-1 py-3 bg-white/5 border border-white/10 rounded-xl text-sm font-bold text-white hover:bg-white/10 transition-all disabled:opacity-60">
                Editar texto
              </button>
              <button
                onClick={handleImport}
                disabled={importing || importable.length === 0}
                className="flex-1 py-3 bg-gradient-to-r from-brand-bronze to-[#FFD700] text-brand-night rounded-xl text-sm font-bold hover:scale-[1.02] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {importing && <Loader2 size={16} className="animate-spin" />}
                Importar {importable.length} {importable.length === 1 ? "invitado" : "invitados"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
