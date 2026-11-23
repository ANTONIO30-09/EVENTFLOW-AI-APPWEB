"use client";

import { CalendarDays, MapPin, Users, Edit, Trash2, ArrowRight } from "lucide-react";
import { motion, Variants } from "framer-motion";
import { AdminEvent } from "../types";

interface Props {
  event: AdminEvent;
  onEdit: (event: AdminEvent) => void;
  onDelete: (id?: string) => void;
  onManage?: (event: AdminEvent) => void;
}

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

export default function EventCard({ event, onEdit, onDelete, onManage }: Props) {
  return (
    <motion.div
      variants={cardVariants}
      layout
      exit={{ opacity: 0, scale: 0.9 }}
      className="relative overflow-hidden bg-white/[0.04] backdrop-blur-2xl border border-white/10 rounded-[2rem] p-6 shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.1)] hover:bg-white/[0.06] hover:-translate-y-1 transition-all duration-300 group"
    >
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-brand-bronze/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="absolute top-5 right-5 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
        <button onClick={() => onEdit(event)} className="p-2.5 bg-white/5 backdrop-blur-md rounded-full hover:bg-brand-bronze/20 hover:text-brand-bronze transition-all text-white/50 border border-white/10" title="Editar">
          <Edit size={16} />
        </button>
        <button onClick={() => onDelete(event.id)} className="p-2.5 bg-white/5 backdrop-blur-md rounded-full hover:bg-red-500/20 hover:text-red-400 transition-all text-white/50 border border-white/10" title="Eliminar">
          <Trash2 size={16} />
        </button>
      </div>

      <div className="flex justify-between items-start mb-5">
        <span className="px-3 py-1.5 bg-gradient-to-r from-brand-bronze/20 to-[#FFD700]/10 text-[#FFD700] text-[10px] font-black uppercase tracking-wider rounded-lg border border-[#FFD700]/20 shadow-sm">
          {event.type === "otro" && event.customType ? event.customType : event.type}
        </span>
      </div>

      <h3 className="text-2xl font-bold text-white mb-4 truncate pr-16 drop-shadow-md">{event.name}</h3>

      <div className="flex flex-col gap-2.5 mb-6">
        <p className="text-brand-porcelain/60 text-sm flex items-center gap-3"><CalendarDays size={16} className="text-brand-bronze/70" /> {event.date}</p>
        <p className="text-brand-porcelain/60 text-sm flex items-center gap-3"><MapPin size={16} className="text-brand-bronze/70" /> {event.location}</p>
        <p className="text-brand-porcelain/60 text-sm flex items-center gap-3"><Users size={16} className="text-brand-bronze/70" /> {event.guestCount} invitados est.</p>
      </div>

      <button
        onClick={() => onManage?.(event)}
        className="w-full py-3 bg-white/5 hover:bg-brand-bronze/20 border border-white/10 hover:border-brand-bronze/50 rounded-xl text-sm font-bold text-white transition-all shadow-sm flex items-center justify-center gap-2 group/btn"
      >
        Administrar Evento
        <ArrowRight size={16} className="opacity-0 -translate-x-2 group-hover/btn:opacity-100 group-hover/btn:translate-x-0 transition-all text-brand-bronze" />
      </button>
    </motion.div>
  );
}
