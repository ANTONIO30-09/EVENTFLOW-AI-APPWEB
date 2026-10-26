"use client";

import { useState } from "react";
import { Plus, Edit2, Trash2, Calendar, MapPin, Users } from "lucide-react";
import { mockEvents } from "@/features/events/mock/events";
import { AdminEvent, etiquetaEstado, colorEstado } from "@/features/events/types";

export default function DashboardPage() {
  const [events, setEvents] = useState<AdminEvent[]>(mockEvents);

  // Formateador de fecha dd/mm/aaaa
  const formatFecha = (fechaStr: string) => {
    const [year, month, day] = fechaStr.split('-');
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 w-full">
      
      {/* Encabezado */}
      <div className="mb-6">
        <h1 className="font-serif text-[34px] font-semibold text-brand-porcelain leading-tight mb-1.5">
          Gestión de eventos
        </h1>
        <p className="text-sm text-brand-porcelain/75 leading-relaxed">
          Crea, edita y organiza los eventos de la plataforma.
        </p>
      </div>

      {/* Barra de acciones */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
        <button 
          onClick={() => alert("Aquí se abrirá el modal de crear evento (próximamente).")}
          className="flex items-center justify-center gap-2 bg-brand-bronze text-brand-night px-4 py-3 rounded-[14px] font-semibold text-sm hover:bg-brand-bronze/90 transition-colors w-fit"
        >
          <Plus size={18} />
          Nuevo evento
        </button>
        <span className="text-[13px] font-medium text-brand-porcelain/60 sm:text-right">
          {events.length} {events.length === 1 ? 'evento' : 'eventos'}
        </span>
      </div>

      {/* CONTENEDOR PRINCIPAL (GlassCard) */}
      <div className="bg-[#1B2A3D]/70 backdrop-blur-[22px] border border-brand-porcelain/20 rounded-[28px] p-5 shadow-2xl">
        
        {events.length === 0 ? (
          <div className="py-8 px-3 text-left">
            <h3 className="font-serif text-xl text-brand-porcelain mb-1.5">No hay eventos todavía.</h3>
            <p className="text-sm text-brand-porcelain/70">Crea el primero con el botón "Nuevo evento" de arriba.</p>
          </div>
        ) : (
          <div className="w-full">
            
            {/* VISTA TABLA (Escritorio) */}
            <div className="hidden md:block w-full">
              {/* Cabecera */}
              <div className="flex items-center px-2 py-2.5 border-b border-brand-porcelain/10">
                <div className="flex-[3] text-[11px] font-semibold text-brand-porcelain/50 tracking-wider">NOMBRE</div>
                <div className="flex-[2] text-[11px] font-semibold text-brand-porcelain/50 tracking-wider">FECHA</div>
                <div className="flex-[4] text-[11px] font-semibold text-brand-porcelain/50 tracking-wider">LUGAR</div>
                <div className="flex-[2] text-[11px] font-semibold text-brand-porcelain/50 tracking-wider">ESTADO</div>
                <div className="flex-[2] text-[11px] font-semibold text-brand-porcelain/50 tracking-wider text-right">INVITADOS</div>
                <div className="w-[88px] text-[11px] font-semibold text-brand-porcelain/50 tracking-wider text-right">ACCIONES</div>
              </div>

              {/* Filas */}
              <div className="flex flex-col">
                {events.map((e) => (
                  <div key={e.id} className="flex items-center px-2 py-3 border-b border-brand-porcelain/10 hover:bg-brand-porcelain/5 transition-colors">
                    <div className="flex-[3] text-sm text-brand-porcelain truncate pr-4">{e.nombre}</div>
                    <div className="flex-[2] text-sm text-brand-porcelain/75">{formatFecha(e.fecha)}</div>
                    <div className="flex-[4] text-sm text-brand-porcelain/75 truncate pr-4">{e.lugar}</div>
                    <div className="flex-[2] flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${colorEstado(e.estado)}`} />
                      <span className="text-xs text-brand-porcelain/85 font-medium">{etiquetaEstado(e.estado)}</span>
                    </div>
                    <div className="flex-[2] text-sm text-brand-porcelain text-right pr-4">{e.invitados}</div>
                    <div className="w-[88px] flex items-center justify-end gap-1">
                      <button className="p-1.5 text-brand-bronze hover:bg-brand-bronze/10 rounded-md transition-colors">
                        <Edit2 size={16} />
                      </button>
                      <button className="p-1.5 text-brand-brick hover:bg-brand-brick/10 rounded-md transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* VISTA LISTA (Móvil) */}
            <div className="block md:hidden">
              {events.map((e) => (
                <div key={e.id} className="py-4 border-b border-brand-porcelain/10 last:border-0 px-1">
                  <div className="flex justify-between items-start mb-1.5">
                    <h3 className="font-serif text-lg font-semibold text-brand-porcelain pr-2">{e.nombre}</h3>
                    <div className="flex gap-1 shrink-0">
                      <button className="p-1 text-brand-bronze"><Edit2 size={16} /></button>
                      <button className="p-1 text-brand-brick"><Trash2 size={16} /></button>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1.5 text-xs text-brand-porcelain/70 mb-1">
                    <Calendar size={13} />
                    <span>{formatFecha(e.fecha)}</span>
                    <span className="mx-1.5">•</span>
                    <span className={`w-2 h-2 rounded-full ${colorEstado(e.estado)}`} />
                    <span className="text-brand-porcelain/85 font-medium">{etiquetaEstado(e.estado)}</span>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-brand-porcelain/70 mb-1">
                    <MapPin size={13} />
                    <span className="truncate">{e.lugar}</span>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-brand-porcelain/70">
                    <Users size={13} />
                    <span>{e.invitados} invitados</span>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
