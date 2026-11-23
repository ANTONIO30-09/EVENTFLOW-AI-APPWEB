"use client";

import { useMemo, useState } from "react";
import { Plus, Search, Loader2, CalendarDays, SearchX } from "lucide-react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { AdminEvent } from "@/features/events/types";
import { useEvents } from "@/features/events/hooks/useEvents";
import EventCard from "@/features/events/components/EventCard";
import EventModal from "@/features/events/components/EventModal";

const TYPE_FILTERS = [
  { value: "todos", label: "Todos" },
  { value: "boda", label: "Bodas" },
  { value: "quince", label: "Quinceañeras" },
  { value: "corporativo", label: "Corporativos" },
  { value: "otro", label: "Otros" },
] as const;

type TypeFilter = (typeof TYPE_FILTERS)[number]["value"];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

export default function MyEventsPage() {
  const { events, loading, reload, removeEvent } = useEvents();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("todos");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [eventToEdit, setEventToEdit] = useState<AdminEvent | null>(null);

  const filteredEvents = useMemo(() => {
    const term = search.trim().toLowerCase();
    return events.filter((e) => {
      const matchesType = typeFilter === "todos" || e.type === typeFilter;
      const matchesText =
        term === "" ||
        e.name.toLowerCase().includes(term) ||
        e.location.toLowerCase().includes(term);
      return matchesType && matchesText;
    });
  }, [events, search, typeFilter]);

  const handleOpenCreate = () => {
    setEventToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (event: AdminEvent) => {
    setEventToEdit(event);
    setIsModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto flex flex-col gap-6 relative px-6 py-8 md:px-10 md:py-10 overflow-x-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-5%] left-[10%] w-[600px] h-[600px] bg-brand-bronze/15 rounded-full blur-[140px]" />
        <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[140px]" />
      </div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex justify-between items-end pt-4"
      >
        <div>
          <h1 className="text-4xl font-black text-white mb-2 tracking-tight drop-shadow-lg">Mis Eventos</h1>
          <p className="text-brand-porcelain/60">Gestiona todos tus eventos en un solo lugar.</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="group flex items-center gap-2 bg-gradient-to-r from-brand-bronze to-[#FFD700] text-brand-night font-bold py-3 px-6 rounded-xl hover:scale-105 transition-all shadow-[0_0_30px_rgba(184,134,62,0.4)] overflow-hidden relative"
        >
          <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
          <Plus size={20} className="relative z-10" />
          <span className="relative z-10">Nuevo Evento</span>
        </button>
      </motion.div>

      {/* Barra de busqueda y filtros */}
      <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
        <div className="relative w-full lg:max-w-md">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-porcelain/40" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre o lugar..."
            className="w-full bg-white/[0.04] border border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder:text-brand-porcelain/40 focus:outline-none focus:border-brand-bronze/60 transition-colors"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {TYPE_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setTypeFilter(f.value)}
              className={`px-4 py-2 rounded-full text-xs font-bold border transition-all ${
                typeFilter === f.value
                  ? "bg-[#FFD700]/15 border-[#FFD700]/40 text-[#FFD700]"
                  : "bg-white/5 border-white/10 text-brand-porcelain/60 hover:text-white hover:bg-white/10"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Contenido */}
      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-brand-bronze" size={40} /></div>
      ) : events.length === 0 ? (
        <div className="bg-white/[0.04] backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-16 flex flex-col items-center justify-center text-center min-h-[350px]">
          <div className="w-24 h-24 bg-gradient-to-br from-brand-bronze/20 to-transparent rounded-full flex items-center justify-center mb-6 border border-brand-bronze/30">
            <CalendarDays size={36} className="text-brand-bronze" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-3">Aún no tienes eventos</h3>
          <p className="text-brand-porcelain/50 max-w-md mb-8 text-sm">Crea tu primer evento para empezar a gestionar invitados, inventario y la distribución con IA.</p>
          <button onClick={handleOpenCreate} className="flex items-center gap-2 bg-white/5 border border-white/10 text-white font-bold py-3 px-8 rounded-xl hover:bg-white/10 hover:border-brand-bronze transition-all">
            <Plus size={18} className="text-brand-bronze" />
            Crear mi primer evento
          </button>
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="bg-white/[0.04] backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-12 flex flex-col items-center justify-center text-center min-h-[250px]">
          <SearchX size={36} className="text-brand-porcelain/40 mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Sin resultados</h3>
          <p className="text-brand-porcelain/50 text-sm">Prueba con otro texto o cambia el filtro de tipo.</p>
        </div>
      ) : (
        <>
          <p className="text-xs text-brand-porcelain/50">
            Mostrando {filteredEvents.length} de {events.length} {events.length === 1 ? "evento" : "eventos"}
          </p>
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  onEdit={handleOpenEdit}
                  onDelete={removeEvent}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        </>
      )}

      {isModalOpen && (
        <EventModal
          onClose={() => setIsModalOpen(false)}
          onEventSaved={reload}
          eventToEdit={eventToEdit}
        />
      )}
    </div>
  );
}
