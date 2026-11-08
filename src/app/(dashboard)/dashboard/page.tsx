"use client";

import { useAuth } from "@/shared/lib/AuthContext";
import { CalendarDays, Users, Package, Plus, ArrowRight } from "lucide-react";

export default function DashboardHome() {
  const { user } = useAuth();

  const kpis = [
    { title: "Eventos Activos", value: "0", icon: CalendarDays, color: "text-brand-bronze" },
    { title: "Invitados Totales", value: "0", icon: Users, color: "text-blue-400" },
    { title: "Items en Inventario", value: "0", icon: Package, color: "text-green-400" },
  ];

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-8">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-white mb-2 tracking-tight">
            Hola, {user?.displayName?.split(" ")[0] || "Organizador"}
          </h1>
          <p className="text-brand-porcelain/60">Bienvenido a tu panel de control. ¿Qué organizaremos hoy?</p>
        </div>
        <button className="flex items-center gap-2 bg-gradient-to-r from-brand-bronze to-[#FFD700] text-brand-night font-bold py-3 px-6 rounded-xl hover:scale-105 transition-transform shadow-[0_0_20px_rgba(184,134,62,0.3)]">
          <Plus size={20} />
          Nuevo Evento
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div key={idx} className="bg-white/[0.03] backdrop-blur-xl border border-white/10 p-6 rounded-3xl shadow-lg flex items-center gap-4 hover:bg-white/[0.05] transition-colors">
              <div className={`p-4 rounded-2xl bg-white/5 ${kpi.color}`}>
                <Icon size={28} />
              </div>
              <div>
                <p className="text-sm text-brand-porcelain/50 font-medium">{kpi.title}</p>
                <p className="text-3xl font-black text-white">{kpi.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Estado Vacío para Eventos */}
      <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-12 flex flex-col items-center justify-center text-center shadow-[0_20px_50px_rgba(0,0,0,0.3)] min-h-[400px]">
        <div className="w-24 h-24 bg-gradient-to-br from-brand-bronze/20 to-transparent rounded-full flex items-center justify-center mb-6 border border-brand-bronze/30">
          <CalendarDays size={40} className="text-brand-bronze" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-3">Aún no tienes eventos</h2>
        <p className="text-brand-porcelain/50 max-w-md mb-8">
          Comienza creando tu primer evento. Podrás gestionar invitados, inventario y la distribución con IA en un solo lugar.
        </p>
        <button className="flex items-center gap-2 bg-white/5 border border-white/10 text-white font-bold py-3 px-6 rounded-xl hover:bg-white/10 hover:border-brand-bronze transition-all group">
          Crear mi primer evento
          <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}
