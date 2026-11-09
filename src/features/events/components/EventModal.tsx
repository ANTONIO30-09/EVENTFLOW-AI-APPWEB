"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { X, Loader2, CalendarDays, MapPin, Type, Users, Map, ArrowLeft } from "lucide-react";
import { createEvent, updateEvent } from "../services/eventService";
import { useAuth } from "@/shared/lib/AuthContext";
import { AdminEvent } from "../types";

const MapPicker = dynamic(() => import("@/shared/components/ui/MapPicker"), { ssr: false });

const eventSchema = z.object({
  title: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  type: z.enum(["boda", "quince", "corporativo", "otro"]),
  customType: z.string().optional(),
  date: z.string().min(1, "Selecciona una fecha"),
  location: z.string().min(3, "Ingresa el lugar del evento"),
  guestCount: z.number().min(1, "Debe haber al menos 1 invitado"),
  lat: z.number().optional(),
  lng: z.number().optional(),
});

type EventFormValues = z.infer<typeof eventSchema>;

interface Props {
  onClose: () => void;
  onEventSaved: () => void;
  eventToEdit?: AdminEvent | null;
}

export default function EventModal({ onClose, onEventSaved, eventToEdit }: Props) {
  const { user } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [showMap, setShowMap] = useState(false);
  const [mapInitialized, setMapInitialized] = useState(false);

  const { register, handleSubmit, control, setValue, formState: { errors, isSubmitting } } = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: eventToEdit 
      ? { ...eventToEdit } 
      : { type: "boda", guestCount: 50, customType: "" }
  });

  const selectedType = useWatch({ control, name: "type" });
  const currentLat = useWatch({ control, name: "lat" });
  const currentLng = useWatch({ control, name: "lng" });

  useEffect(() => {
    if (showMap) {
      window.dispatchEvent(new Event("collapse-sidebar"));
      if (!mapInitialized) {
        const timer = setTimeout(() => setMapInitialized(true), 0);
        return () => clearTimeout(timer);
      }
    } else {
      window.dispatchEvent(new Event("restore-sidebar"));
    }
    return () => {
      window.dispatchEvent(new Event("restore-sidebar"));
    };
  }, [showMap, mapInitialized]);

  const onSubmit = async (data: EventFormValues) => {
    try {
      setError(null);
      if (!user) throw new Error("No user");
      
      if (eventToEdit && eventToEdit.id) {
        await updateEvent(eventToEdit.id, data);
      } else {
        await createEvent({ ...data, organizerId: user.uid });
      }
      onEventSaved();
      onClose();
    } catch (err) {
      setError("Ocurrió un error. Intenta de nuevo.");
      console.error(err);
    }
  };

  const handleLocationSelect = (lat: number, lng: number, address: string) => {
    setValue("lat", lat);
    setValue("lng", lng);
    setValue("location", address);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#0d131f]/80 backdrop-blur-sm">
      
      {/* Contenedor principal: Cambia de tamaño dependiendo si el mapa está abierto */}
      <div className={`w-full bg-white/[0.03] backdrop-blur-3xl border border-white/10 p-6 md:p-8 rounded-[2rem] shadow-[0_20px_60px_rgba(0,0,0,0.8)] relative transition-all duration-300 flex flex-col ${showMap ? 'max-w-4xl h-[85vh]' : 'max-w-md h-auto max-h-[90vh]'}`}>
        
        <div className="flex justify-between items-center mb-6 shrink-0 z-20">
          <div className="flex items-center gap-4">
            {showMap && (
              <button onClick={() => setShowMap(false)} type="button" className="text-brand-porcelain/70 hover:text-white transition-colors bg-white/5 p-2 rounded-full">
                <ArrowLeft size={20} />
              </button>
            )}
            <h2 className="text-2xl font-black text-white">
              {showMap ? "Seleccionar Ubicación" : (eventToEdit ? "Editar Evento" : "Crear Nuevo Evento")}
            </h2>
          </div>
          <button onClick={onClose} type="button" className="text-brand-porcelain/50 hover:text-white transition-colors p-2 bg-white/5 rounded-full">
            <X size={20} />
          </button>
        </div>

        {error && <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl text-center shrink-0 z-20">{error}</div>}

        {/* Área de contenido */}
        <div className="flex-1 min-h-0 relative">
          
          {/* VISTA 1: FORMULARIO (Renderizado normal para que aporte altura) */}
          {!showMap && (
            <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col gap-4 overflow-y-auto no-scrollbar pr-1 pb-2">
              
              <div className="group">
                <label className="text-xs text-brand-porcelain/60 font-medium mb-1 block">Nombre del Evento</label>
                <div className="relative">
                  <Type className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-porcelain/30" size={18} />
                  <input type="text" placeholder="Ej: Boda de Ana y Carlos" {...register("title")} className="w-full bg-[#0d131f]/60 border border-white/10 text-white rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:border-brand-bronze transition-colors text-sm" />
                </div>
                {errors.title && <p className="text-red-400 text-[10px] mt-1 ml-1">{errors.title.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="group">
                  <label className="text-xs text-brand-porcelain/60 font-medium mb-1 block">Tipo</label>
                  <select {...register("type")} className="w-full bg-[#0d131f]/60 border border-white/10 text-white rounded-xl py-3 px-4 focus:outline-none focus:border-brand-bronze transition-colors text-sm appearance-none">
                    <option value="boda">Boda</option>
                    <option value="quince">15 Años</option>
                    <option value="corporativo">Corporativo</option>
                    <option value="otro">Otro</option>
                  </select>
                </div>
                
                {selectedType === "otro" ? (
                  <div className="group">
                    <label className="text-xs text-brand-porcelain/60 font-medium mb-1 block">Personalizado</label>
                    <input type="text" placeholder="Ej: Baby Shower" {...register("customType")} className="w-full bg-[#0d131f]/60 border border-white/10 text-white rounded-xl py-3 px-4 focus:outline-none focus:border-brand-bronze transition-colors text-sm" />
                  </div>
                ) : (
                  <div className="group">
                    <label className="text-xs text-brand-porcelain/60 font-medium mb-1 block">Invitados</label>
                    <div className="relative">
                      <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-porcelain/30" size={18} />
                      <input type="number" placeholder="50" {...register("guestCount", { valueAsNumber: true })} className="w-full bg-[#0d131f]/60 border border-white/10 text-white rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:border-brand-bronze transition-colors text-sm" />
                    </div>
                  </div>
                )}
              </div>

              <div className="group">
                <label className="text-xs text-brand-porcelain/60 font-medium mb-1 block">Fecha del Evento</label>
                <div className="relative">
                  <CalendarDays className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-porcelain/30" size={18} />
                  <input type="date" {...register("date")} className="w-full bg-[#0d131f]/60 border border-white/10 text-white rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:border-brand-bronze transition-colors text-sm [color-scheme:dark]" />
                </div>
                {errors.date && <p className="text-red-400 text-[10px] mt-1 ml-1">{errors.date.message}</p>}
              </div>

              <div className="group">
                <label className="text-xs text-brand-porcelain/60 font-medium mb-1 block">Ubicación</label>
                <div className="relative flex gap-2">
                  <div className="relative flex-1">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-porcelain/30" size={18} />
                    <input type="text" placeholder="Dirección..." {...register("location")} className="w-full bg-[#0d131f]/60 border border-white/10 text-white rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:border-brand-bronze transition-colors text-sm" />
                  </div>
                  <button 
                    type="button" 
                    onClick={() => setShowMap(true)} 
                    className="px-4 rounded-xl border bg-white/5 text-white border-white/10 hover:bg-white/10 transition-colors font-bold text-xs gap-2 flex items-center justify-center"
                  >
                    <Map size={16} /> Mapa
                  </button>
                </div>
                {errors.location && <p className="text-red-400 text-[10px] mt-1 ml-1">{errors.location.message}</p>}
              </div>

              <div className="mt-4 pt-2 shrink-0">
                <button type="submit" disabled={isSubmitting} className="w-full bg-gradient-to-r from-brand-bronze to-[#FFD700] text-brand-night font-black py-4 rounded-xl hover:scale-[1.02] transition-transform disabled:opacity-50 flex justify-center items-center shadow-[0_0_20px_rgba(184,134,62,0.3)]">
                  {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : (eventToEdit ? "Guardar Cambios" : "Crear Evento")}
                </button>
              </div>
            </form>
          )}

          {/* VISTA 2: MAPA (Absoluto, solo cuando showMap es true) */}
          {mapInitialized && (
            <div className={`absolute inset-0 rounded-2xl overflow-hidden border border-white/10 transition-opacity duration-300 ${showMap ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'}`}>
              <MapPicker 
                onLocationSelect={handleLocationSelect} 
                initialLat={currentLat} 
                initialLng={currentLng} 
              />
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
