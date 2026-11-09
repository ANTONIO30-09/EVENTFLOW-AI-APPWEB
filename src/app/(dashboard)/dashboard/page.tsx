"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/shared/lib/AuthContext";
import { CalendarDays, Package, Plus, ArrowRight, MapPin, Clock, Loader2, Users, Edit, Trash2 } from "lucide-react";
import { AdminEvent } from "@/features/events/types";
import { getUserEvents, deleteEvent } from "@/features/events/services/eventService";
import EventModal from "@/features/events/components/EventModal";
import { motion, AnimatePresence } from "framer-motion";

export default function DashboardHome() {
  const { user } = useAuth();
  const [events, setEvents] = useState<AdminEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [eventToEdit, setEventToEdit] = useState<AdminEvent | null>(null);
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    let isMounted = true;
    const loadEvents = async () => {
      if (!user) return;
      await Promise.resolve();
      if (!isMounted) return;
      setLoading(true);
      try {
        const data = await getUserEvents(user.uid);
        data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        if (isMounted) setEvents(data);
      } catch (error) {
        console.error("Error cargando eventos:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    loadEvents();
    return () => { isMounted = false; };
  }, [user, refresh]);

  const nextEvent = events.length > 0 ? events[0] : null;

  const handleOpenCreate = () => {
    setEventToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (event: AdminEvent) => {
    setEventToEdit(event);
    setIsModalOpen(true);
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    if (window.confirm("¿Estás seguro de que deseas eliminar este evento? Esta acción no se puede deshacer.")) {
      try {
        await deleteEvent(id);
        setRefresh(prev => prev + 1);
      } catch (error) {
        console.error("Error al eliminar:", error);
      }
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } }
  };

  return (
    <div className="max-w-7xl mx-auto flex flex-col gap-6 relative px-6 py-8 md:px-10 md:py-10 overflow-x-hidden">
      
      {/* 1. LUCES DE FONDO (Contenedor protegido para evitar scroll) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-5%] left-[10%] w-[600px] h-[600px] bg-brand-bronze/15 rounded-full blur-[140px]" />
        <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-[-10%] left-[20%] w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[140px]" />
      </div>

      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex justify-between items-end pt-4"
      >
        <div>
          <h1 className="text-4xl font-black text-white mb-2 tracking-tight drop-shadow-lg">
            Hola, {user?.displayName?.split(" ")[0] || "Administrador"}
          </h1>
          <p className="text-brand-porcelain/60">Bienvenido a tu panel de control.</p>
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

      {/* Tarjetas KPI Premium */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {/* KPI 1 */}
        <motion.div variants={itemVariants} className="relative overflow-hidden bg-white/[0.04] backdrop-blur-2xl border border-white/10 p-6 rounded-[2rem] shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.1)] group hover:bg-white/[0.06] transition-all duration-300 hover:-translate-y-1">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-brand-bronze/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="flex items-center gap-5">
            <div className="relative p-4 rounded-2xl bg-gradient-to-br from-brand-bronze/20 to-transparent border border-brand-bronze/20 text-brand-bronze shadow-[0_0_15px_rgba(184,134,62,0.2)]">
              <CalendarDays size={28} />
            </div>
            <div>
              <p className="text-sm text-brand-porcelain/50 font-medium mb-1">Eventos Activos</p>
              <p className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-white/60">{events.length}</p>
            </div>
          </div>
        </motion.div>

        {/* KPI 2 */}
        <motion.div variants={itemVariants} className="relative overflow-hidden bg-white/[0.04] backdrop-blur-2xl border border-white/10 p-6 rounded-[2rem] shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.1)] group hover:bg-white/[0.06] transition-all duration-300 hover:-translate-y-1">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-400/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="flex items-center gap-5">
            <div className="relative p-4 rounded-2xl bg-gradient-to-br from-blue-500/20 to-transparent border border-blue-500/20 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
              <Clock size={28} />
            </div>
            <div className="overflow-hidden">
              <p className="text-sm text-brand-porcelain/50 font-medium mb-1">Próximo Evento</p>
              <p className="text-2xl font-bold text-white truncate max-w-[180px]">{nextEvent ? nextEvent.title : "Ninguno"}</p>
            </div>
          </div>
        </motion.div>

        {/* KPI 3 */}
        <motion.div variants={itemVariants} className="relative overflow-hidden bg-white/[0.04] backdrop-blur-2xl border border-white/10 p-6 rounded-[2rem] shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.1)] group hover:bg-white/[0.06] transition-all duration-300 hover:-translate-y-1">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-green-400/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="flex items-center gap-5">
            <div className="relative p-4 rounded-2xl bg-gradient-to-br from-green-500/20 to-transparent border border-green-500/20 text-green-400 shadow-[0_0_15px_rgba(34,197,94,0.2)]">
              <Package size={28} />
            </div>
            <div>
              <p className="text-sm text-brand-porcelain/50 font-medium mb-1">Items en Inventario</p>
              <p className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-white/60">0</p>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Lista de Eventos (Sin margen superior excesivo) */}
      <div className="mt-2">
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
          Mis Eventos
          {events.length > 0 && (
            <span className="text-xs bg-white/10 px-2.5 py-1 rounded-full text-brand-porcelain/70 border border-white/10">
              {events.length} {events.length === 1 ? 'evento' : 'eventos'}
            </span>
          )}
        </h2>
        
        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin text-brand-bronze" size={40} /></div>
        ) : events.length === 0 ? (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white/[0.04] backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-16 flex flex-col items-center justify-center text-center shadow-[0_20px_50px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.1)] min-h-[350px] relative overflow-hidden">
            <div className="w-24 h-24 bg-gradient-to-br from-brand-bronze/20 to-transparent rounded-full flex items-center justify-center mb-6 border border-brand-bronze/30 shadow-[0_0_30px_rgba(184,134,62,0.15)]">
              <CalendarDays size={36} className="text-brand-bronze" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Aún no tienes eventos</h3>
            <p className="text-brand-porcelain/50 max-w-md mb-8 text-sm">Comienza creando tu primer evento. Podrás gestionar invitados, inventario y la distribución con IA en un solo lugar.</p>
            <button onClick={handleOpenCreate} className="group flex items-center gap-2 bg-white/5 border border-white/10 text-white font-bold py-3 px-8 rounded-xl hover:bg-white/10 hover:border-brand-bronze transition-all shadow-lg">
              Crear mi primer evento
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform text-brand-bronze" />
            </button>
          </motion.div>
        ) : (
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {events.map((event) => (
                <motion.div 
                  key={event.id} 
                  variants={itemVariants}
                  layout
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="relative overflow-hidden bg-white/[0.04] backdrop-blur-2xl border border-white/10 rounded-[2rem] p-6 shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.1)] hover:bg-white/[0.06] hover:-translate-y-1 transition-all duration-300 group"
                >
                  {/* Brillo superior */}
                  <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-brand-bronze/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  {/* Botones de Acción Flotantes */}
                  <div className="absolute top-5 right-5 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                    <button onClick={() => handleOpenEdit(event)} className="p-2.5 bg-white/5 backdrop-blur-md rounded-full hover:bg-brand-bronze/20 hover:text-brand-bronze transition-all text-white/50 border border-white/10" title="Editar">
                      <Edit size={16} />
                    </button>
                    <button onClick={() => handleDelete(event.id)} className="p-2.5 bg-white/5 backdrop-blur-md rounded-full hover:bg-red-500/20 hover:text-red-400 transition-all text-white/50 border border-white/10" title="Eliminar">
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="flex justify-between items-start mb-5">
                    <span className="px-3 py-1.5 bg-gradient-to-r from-brand-bronze/20 to-[#FFD700]/10 text-[#FFD700] text-[10px] font-black uppercase tracking-wider rounded-lg border border-[#FFD700]/20 shadow-sm">
                      {event.type === "otro" && event.customType ? event.customType : event.type}
                    </span>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-4 truncate pr-16 drop-shadow-md">{event.title}</h3>
                  
                  <div className="flex flex-col gap-2.5 mb-6">
                    <p className="text-brand-porcelain/60 text-sm flex items-center gap-3"><CalendarDays size={16} className="text-brand-bronze/70" /> {event.date}</p>
                    <p className="text-brand-porcelain/60 text-sm flex items-center gap-3"><MapPin size={16} className="text-brand-bronze/70" /> {event.location}</p>
                    <p className="text-brand-porcelain/60 text-sm flex items-center gap-3"><Users size={16} className="text-brand-bronze/70" /> {event.guestCount} invitados est.</p>
                  </div>
                  
                  <button className="w-full py-3 bg-white/5 hover:bg-brand-bronze/20 border border-white/10 hover:border-brand-bronze/50 rounded-xl text-sm font-bold text-white transition-all shadow-sm flex items-center justify-center gap-2 group/btn">
                    Administrar Evento
                    <ArrowRight size={16} className="opacity-0 -translate-x-2 group-hover/btn:opacity-100 group-hover/btn:translate-x-0 transition-all text-brand-bronze" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {isModalOpen && (
        <EventModal 
          onClose={() => setIsModalOpen(false)} 
          onEventSaved={() => setRefresh(prev => prev + 1)} 
          eventToEdit={eventToEdit}
        />
      )}
    </div>
  );
}
