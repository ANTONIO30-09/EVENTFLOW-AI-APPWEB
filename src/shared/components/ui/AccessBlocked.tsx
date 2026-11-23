"use client";

import { Clock, Smartphone, LogOut } from "lucide-react";
import { useAuth } from "@/shared/lib/AuthContext";

interface Props {
  variant: "pending" | "mobile-only";
}

export default function AccessBlocked({ variant }: Props) {
  const { user, logout } = useAuth();
  const isPending = variant === "pending";
  const Icon = isPending ? Clock : Smartphone;

  return (
    <div className="h-screen w-full flex items-center justify-center bg-[#0d131f] px-6">
      <div className="max-w-md w-full bg-white/[0.04] backdrop-blur-2xl border border-white/10 rounded-[2rem] p-10 text-center shadow-[0_20px_50px_rgba(0,0,0,0.4)]">
        <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-brand-bronze/20 to-transparent rounded-full flex items-center justify-center border border-brand-bronze/30">
          <Icon size={32} className="text-brand-bronze" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-3">
          {isPending ? "Tu cuenta espera autorización" : "Panel solo para administradores"}
        </h1>
        <p className="text-sm text-brand-porcelain/60 mb-2">
          {isPending
            ? "Recibimos tu registro. Un administrador del sistema debe autorizar tu correo antes de que puedas usar el panel."
            : "Tu cuenta es de organizador o staff. Usa la app móvil de EventFlow para ver tus eventos asignados."}
        </p>
        {user?.email && <p className="text-xs text-brand-porcelain/40 mb-8">{user.email}</p>}
        <button
          onClick={logout}
          className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-sm font-bold text-white hover:bg-white/10 hover:border-brand-bronze transition-all"
        >
          <LogOut size={16} className="text-brand-bronze" />
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}
