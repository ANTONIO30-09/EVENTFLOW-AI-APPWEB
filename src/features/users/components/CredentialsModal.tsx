"use client";

import { useState } from "react";
import { X, Copy, Check, Printer, AlertTriangle, MailCheck } from "lucide-react";
import { CreatedUser } from "../services/userService";

interface Props {
  created: CreatedUser;
  name: string;
  role: string;
  onClose: () => void;
}

const escapeHtml = (t: string) => t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export default function CredentialsModal({ created, name, role, onClose }: Props) {
  const [copied, setCopied] = useState<string | null>(null);
  const isEmailMode = created.accessType === "email";

  const copy = async (label: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(label);
      setTimeout(() => setCopied(null), 1500);
    } catch {
      // sin permiso de portapapeles
    }
  };

  const handlePrint = () => {
    if (!created.password) return;
    const win = window.open("", "_blank", "width=480,height=620");
    if (!win) return;
    win.document.write(
      `<html><head><title>Credenciales - ${escapeHtml(name)}</title>` +
        `<style>body{font-family:sans-serif;padding:24px}.card{border:2px solid #333;border-radius:12px;padding:20px;max-width:360px;margin:auto}` +
        `h2{margin:0 0 4px}.role{color:#666;margin:0 0 16px;text-transform:capitalize}.label{font-size:11px;color:#666;margin-top:12px}` +
        `.value{font-family:monospace;font-size:16px;font-weight:bold;word-break:break-all}.note{margin-top:18px;font-size:12px;color:#444}</style></head>` +
        `<body><div class="card"><h2>EventFlow</h2><p class="role">${escapeHtml(name)} · ${escapeHtml(role)}</p>` +
        `<div class="label">Usuario</div><div class="value">${escapeHtml(created.loginEmail)}</div>` +
        `<div class="label">Contraseña</div><div class="value">${escapeHtml(created.password)}</div>` +
        `<p class="note">Entra a la app móvil con estos datos. Se te pedirá cambiar la contraseña al ingresar. No la compartas.</p></div>` +
        `<script>window.onload=function(){window.print();}<\/script></body></html>`
    );
    win.document.close();
  };

  const row = (label: string, value: string) => (
    <div className="bg-white/[0.04] border border-white/10 rounded-xl p-3 flex items-center justify-between gap-3">
      <div className="min-w-0">
        <p className="text-[10px] uppercase tracking-wider text-brand-porcelain/40 font-bold">{label}</p>
        <p className="font-mono text-sm text-white break-all">{value}</p>
      </div>
      <button onClick={() => copy(label, value)} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-brand-bronze transition-colors shrink-0" title="Copiar">
        {copied === label ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
      </button>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-[#0d131f] border border-white/10 rounded-[2rem] shadow-2xl p-8">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-white">Usuario creado</h2>
            <p className="text-xs text-brand-porcelain/50">{name}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors" title="Cerrar">
            <X size={18} />
          </button>
        </div>

        {isEmailMode ? (
          <div className="flex flex-col gap-3">
            {created.emailSent ? (
              <div className="flex gap-3 items-start bg-green-500/10 border border-green-500/20 rounded-xl p-4 text-sm text-green-300">
                <MailCheck size={18} className="shrink-0 mt-0.5" />
                <p>Enviamos un enlace a <b>{created.loginEmail}</b> para que defina su contraseña. Si no lo ve, que revise spam. Puedes reenviarlo desde la lista.</p>
              </div>
            ) : (
              <div className="flex gap-3 items-start bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 text-sm text-yellow-300">
                <AlertTriangle size={18} className="shrink-0 mt-0.5" />
                <p>La cuenta se creó, pero no se pudo enviar el correo. Usa <b>Reenviar correo</b> desde la lista.</p>
              </div>
            )}
            {row("Correo", created.loginEmail)}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {row("Usuario", created.loginEmail)}
            {created.password && row("Contraseña", created.password)}
            <div className="flex gap-3 items-start bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-3 text-xs text-yellow-300">
              <AlertTriangle size={16} className="shrink-0 mt-0.5" />
              <p>Esta contraseña se muestra <b>solo una vez</b> y no se guarda. Copia o imprime la tarjeta ahora.</p>
            </div>
            <button onClick={handlePrint} className="py-3 bg-gradient-to-r from-brand-bronze to-[#FFD700] text-brand-night rounded-xl text-sm font-bold hover:scale-[1.02] transition-all flex items-center justify-center gap-2">
              <Printer size={16} />
              Imprimir tarjeta
            </button>
          </div>
        )}

        <button onClick={onClose} className="w-full mt-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm font-bold text-white hover:bg-white/10 transition-all">
          Listo
        </button>
      </div>
    </div>
  );
}
