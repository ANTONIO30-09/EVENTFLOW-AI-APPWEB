"use client";

import { mockEvents } from "@/features/events/mock/events";
import { colorEstado } from "@/features/events/types";

export default function ReportsPage() {
  const totalInv = mockEvents.reduce((s, e) => s + e.invitados, 0);
  const totalCheck = mockEvents.reduce((s, e) => s + e.checkIn, 0);
  const totalEscaneados = mockEvents.reduce((s, e) => s + e.itemsEscaneados, 0);
  const enCurso = mockEvents.filter((e) => e.estado === "enCurso").length;
  const pctGlobal = totalInv === 0 ? 0 : Math.round((totalCheck / totalInv) * 100);
  
  const maxInv = Math.max(...mockEvents.map((e) => e.invitados), 1);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 w-full">
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="font-serif text-[34px] font-semibold text-brand-porcelain leading-tight mb-1.5">
          Reportes y métricas
        </h1>
        <p className="text-sm text-brand-porcelain/75 leading-relaxed">
          KPIs, invitados por evento y progreso de check-in.
        </p>
      </div>

      {/* 1. KPIs (GlassCard) */}
      <div className="bg-[#1B2A3D]/70 backdrop-blur-[22px] border border-brand-porcelain/20 rounded-[28px] py-6 px-6 mb-4 shadow-xl">
        <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-brand-porcelain/10">
          <div className="flex-1 pb-4 md:pb-0 md:pr-6">
            <p className="text-[11px] font-semibold text-brand-porcelain/60 tracking-wider mb-1">EVENTOS ACTIVOS</p>
            <p className="font-serif text-[32px] font-semibold text-brand-porcelain leading-none mb-1">{enCurso}</p>
            <p className="text-[11px] text-brand-porcelain/60">de {mockEvents.length} en total</p>
          </div>
          <div className="flex-1 py-4 md:py-0 md:px-6">
            <p className="text-[11px] font-semibold text-brand-porcelain/60 tracking-wider mb-1">INVITADOS TOTALES</p>
            <p className="font-serif text-[32px] font-semibold text-brand-porcelain leading-none mb-1">{totalInv}</p>
            <p className="text-[11px] text-brand-porcelain/60">{mockEvents.length} eventos</p>
          </div>
          <div className="flex-1 py-4 md:py-0 md:px-6">
            <p className="text-[11px] font-semibold text-brand-porcelain/60 tracking-wider mb-1">% CHECK-IN</p>
            <p className="font-serif text-[32px] font-semibold text-brand-porcelain leading-none mb-1">{pctGlobal}%</p>
            <p className="text-[11px] text-brand-porcelain/60">{totalCheck} de {totalInv}</p>
          </div>
          <div className="flex-1 pt-4 md:pt-0 md:pl-6">
            <p className="text-[11px] font-semibold text-brand-porcelain/60 tracking-wider mb-1">ÍTEMS ESCANEADOS</p>
            <p className="font-serif text-[32px] font-semibold text-brand-porcelain leading-none mb-1">{totalEscaneados}</p>
          </div>
        </div>
      </div>

      {/* 2. Gráficas (Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* Gráfica de Barras */}
        <div className="lg:col-span-2 bg-[#1B2A3D]/70 backdrop-blur-[22px] border border-brand-porcelain/20 rounded-[28px] p-6 shadow-xl">
          <h3 className="font-serif text-lg font-semibold text-brand-porcelain mb-1">Invitados por evento</h3>
          <p className="text-xs text-brand-porcelain/60 mb-6">{mockEvents.length} eventos</p>
          
          <div className="flex items-end h-[220px] gap-4 overflow-x-auto pb-2">
            {mockEvents.map((e) => {
              const h = (e.invitados / maxInv) * 160;
              return (
                <div key={e.id} className="flex flex-col items-center justify-end min-w-[70px] flex-1">
                  <span className="text-xs font-semibold text-brand-porcelain mb-1.5">{e.invitados}</span>
                  <div className={`w-[42px] rounded-t-[10px] ${colorEstado(e.estado)}`} style={{ height: `${Math.max(h, 2)}px` }} />
                  <span className="text-[11px] text-brand-porcelain/60 text-center mt-2 truncate w-full">{e.nombre}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Gráfica de Anillo */}
        <div className="lg:col-span-1 bg-[#1B2A3D]/70 backdrop-blur-[22px] border border-brand-porcelain/20 rounded-[28px] p-6 shadow-xl flex flex-col">
          <h3 className="font-serif text-lg font-semibold text-brand-porcelain mb-6">Progreso de check-in</h3>
          
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="relative w-[180px] h-[180px]">
              {/* SVG Ring */}
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="90" cy="90" r="80" className="stroke-brand-porcelain/15" strokeWidth="14" fill="transparent" />
                <circle cx="90" cy="90" r="80" className="stroke-brand-sage" strokeWidth="14" fill="transparent"
                  strokeDasharray={`${2 * Math.PI * 80}`}
                  strokeDashoffset={`${2 * Math.PI * 80 * (1 - (totalCheck / totalInv))}`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-serif text-[40px] font-semibold leading-none text-brand-porcelain">{pctGlobal}%</span>
                <span className="text-xs text-brand-porcelain/70 mt-1">check-in</span>
              </div>
            </div>
            <p className="text-xs text-brand-porcelain/70 mt-6">{totalCheck} de {totalInv} invitados</p>
          </div>
        </div>

      </div>
    </div>
  );
}
