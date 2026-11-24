"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { X, Download, Printer, Loader2 } from "lucide-react";
import { Guest } from "../types";
import { guestQrValue, peopleLabel, slugify } from "../lib/passes";

interface Props {
  guest: Guest;
  eventName: string;
  onClose: () => void;
}

const escapeHtml = (t: string) => t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export default function GuestQRModal({ guest, eventName, onClose }: Props) {
  const [url, setUrl] = useState<string | null>(null);
  const value = guestQrValue(guest.id as string);

  useEffect(() => {
    let active = true;
    QRCode.toDataURL(value, { width: 480, margin: 1, errorCorrectionLevel: "M" }).then((data) => {
      if (active) setUrl(data);
    });
    return () => {
      active = false;
    };
  }, [value]);

  const handleDownload = () => {
    if (!url) return;
    const link = document.createElement("a");
    link.href = url;
    link.download = `pase-${slugify(guest.name)}.png`;
    link.click();
  };

  const handlePrint = () => {
    if (!url) return;
    const win = window.open("", "_blank", "width=420,height=560");
    if (!win) return;
    win.document.write(
      `<html><head><title>Pase - ${escapeHtml(guest.name)}</title></head>` +
        `<body style="font-family:sans-serif;text-align:center;padding:24px">` +
        `<p style="color:#666;margin:0 0 8px">${escapeHtml(eventName)}</p>` +
        `<img src="${url}" style="width:260px;height:260px" />` +
        `<h2 style="margin:16px 0 4px">${escapeHtml(guest.name)}</h2>` +
        `<p style="color:#555;font-size:14px">${escapeHtml(peopleLabel(guest.companions))}</p>` +
        `<script>window.onload=function(){window.print();}<\/script></body></html>`
    );
    win.document.close();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-sm bg-[#0d131f] border border-white/10 rounded-[2rem] shadow-2xl p-8 flex flex-col items-center text-center">
        <div className="w-full flex justify-end -mt-2 -mr-2">
          <button onClick={onClose} className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors" title="Cerrar">
            <X size={18} />
          </button>
        </div>

        <h2 className="text-xl font-bold text-white">{guest.name}</h2>
        <p className="text-xs text-brand-porcelain/50 mb-1">{peopleLabel(guest.companions)}</p>
        <p className="text-[10px] text-brand-porcelain/30 mb-5 break-all">{value}</p>

        <div className="bg-white p-3 rounded-2xl w-[236px] h-[236px] flex items-center justify-center">
          {url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={url} alt={`QR de ${guest.name}`} className="w-full h-full" />
          ) : (
            <Loader2 className="animate-spin text-brand-bronze" size={28} />
          )}
        </div>

        <div className="flex gap-3 mt-6 w-full">
          <button onClick={handleDownload} disabled={!url} className="flex-1 py-3 bg-white/5 border border-white/10 rounded-xl text-sm font-bold text-white hover:bg-white/10 transition-all flex items-center justify-center gap-2 disabled:opacity-50">
            <Download size={16} className="text-brand-bronze" />
            PNG
          </button>
          <button onClick={handlePrint} disabled={!url} className="flex-1 py-3 bg-gradient-to-r from-brand-bronze to-[#FFD700] text-brand-night rounded-xl text-sm font-bold hover:scale-[1.02] transition-all flex items-center justify-center gap-2 disabled:opacity-50">
            <Printer size={16} />
            Imprimir
          </button>
        </div>
      </div>
    </div>
  );
}
