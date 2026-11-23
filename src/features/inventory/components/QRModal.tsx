"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { jsPDF } from "jspdf";
import { X, Download, Printer, FileText, Loader2 } from "lucide-react";
import { InventoryItem } from "../types";

interface Props {
  item: InventoryItem;
  onClose: () => void;
}

interface UnitQR {
  n: number;
  label: string;
  value: string;
  url: string;
}

const escapeHtml = (text: string) =>
  text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const slugify = (text: string) =>
  text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();

export default function QRModal({ item, onClose }: Props) {
  const [qrs, setQrs] = useState<UnitQR[]>([]);
  const total = Math.max(1, item.quantity || 1);

  useEffect(() => {
    let active = true;
    const build = async () => {
      const list = await Promise.all(
        Array.from({ length: total }, async (_, i) => {
          const n = i + 1;
          const value = `eventflow:item:${item.id}:${n}`;
          const url = await QRCode.toDataURL(value, {
            width: 320,
            margin: 1,
            errorCorrectionLevel: "M",
          });
          return { n, label: `${item.name} ${n}`, value, url };
        })
      );
      if (active) setQrs(list);
    };
    build();
    return () => {
      active = false;
    };
  }, [item.id, item.name, total]);

  const handleDownloadOne = (qr: UnitQR) => {
    const link = document.createElement("a");
    link.href = qr.url;
    link.download = `qr-${slugify(item.name)}-${qr.n}.png`;
    link.click();
  };

  const handlePdf = () => {
    if (qrs.length === 0) return;
    const pdf = new jsPDF({ unit: "mm", format: "a4" });
    const cols = 3;
    const rows = 4;
    const cellW = 63;
    const cellH = 68;
    const marginX = (210 - cols * cellW) / 2;
    const marginY = (297 - rows * cellH) / 2;
    const perPage = cols * rows;

    qrs.forEach((qr, i) => {
      const pos = i % perPage;
      if (i > 0 && pos === 0) pdf.addPage();
      const col = pos % cols;
      const row = Math.floor(pos / cols);
      const x = marginX + col * cellW;
      const y = marginY + row * cellH;

      pdf.setDrawColor(190);
      pdf.rect(x, y, cellW, cellH);
      pdf.addImage(qr.url, "PNG", x + 9, y + 5, 45, 45);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(11);
      pdf.text(qr.label, x + cellW / 2, y + 56, { align: "center", maxWidth: cellW - 6 });
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(7);
      pdf.text(`${qr.n} de ${total}`, x + cellW / 2, y + 63, { align: "center" });
    });

    pdf.save(`qr-${slugify(item.name)}.pdf`);
  };

  const handlePrint = () => {
    if (qrs.length === 0) return;
    const win = window.open("", "_blank", "width=900,height=700");
    if (!win) return;
    const cells = qrs
      .map(
        (qr) =>
          `<div class="cell"><img src="${qr.url}" /><strong>${escapeHtml(qr.label)}</strong><small>${qr.n} de ${total}</small></div>`
      )
      .join("");
    win.document.write(
      `<html><head><title>QR - ${escapeHtml(item.name)}</title>` +
        `<style>` +
        `body{font-family:sans-serif;margin:12mm}` +
        `.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:6mm}` +
        `.cell{border:1px solid #bbb;padding:4mm;text-align:center;break-inside:avoid}` +
        `.cell img{width:42mm;height:42mm}` +
        `.cell strong{display:block;font-size:13px;margin-top:2mm}` +
        `.cell small{color:#666;font-size:10px}` +
        `</style></head><body><div class="grid">${cells}</div>` +
        `<script>window.onload=function(){window.print();}<\/script>` +
        `</body></html>`
    );
    win.document.close();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-3xl bg-[#0d131f] border border-white/10 rounded-[2rem] shadow-2xl p-8 flex flex-col max-h-[90vh]">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-white">{item.name}</h2>
            <p className="text-xs text-brand-porcelain/50">
              {total} {total === 1 ? "código QR" : "códigos QR"} · uno por unidad
            </p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors" title="Cerrar">
            <X size={18} />
          </button>
        </div>

        <div className="flex gap-3 mb-4">
          <button onClick={handlePdf} disabled={qrs.length === 0} className="flex-1 py-3 bg-gradient-to-r from-brand-bronze to-[#FFD700] text-brand-night rounded-xl text-sm font-bold hover:scale-[1.02] transition-all flex items-center justify-center gap-2 disabled:opacity-50">
            <FileText size={16} />
            Descargar PDF
          </button>
          <button onClick={handlePrint} disabled={qrs.length === 0} className="flex-1 py-3 bg-white/5 border border-white/10 rounded-xl text-sm font-bold text-white hover:bg-white/10 transition-all flex items-center justify-center gap-2 disabled:opacity-50">
            <Printer size={16} className="text-brand-bronze" />
            Imprimir todas
          </button>
        </div>

        <p className="text-[11px] text-brand-porcelain/40 mb-3">Haz clic en un QR para descargar solo ese en PNG.</p>

        <div className="overflow-y-auto no-scrollbar flex-1 min-h-0">
          {qrs.length === 0 ? (
            <div className="flex justify-center py-12"><Loader2 className="animate-spin text-brand-bronze" size={32} /></div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {qrs.map((qr) => (
                <button
                  key={qr.n}
                  onClick={() => handleDownloadOne(qr)}
                  title="Descargar PNG"
                  className="group bg-white/[0.04] border border-white/10 rounded-2xl p-3 flex flex-col items-center hover:border-brand-bronze/50 transition-all"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={qr.url} alt={qr.label} className="w-full max-w-[140px] bg-white rounded-lg p-1" />
                  <span className="mt-2 text-sm font-bold text-white text-center">{qr.label}</span>
                  <span className="text-[10px] text-brand-porcelain/40 flex items-center gap-1 group-hover:text-brand-bronze transition-colors">
                    <Download size={10} /> PNG
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
