"use client";

import { useState } from "react";
import { X, Loader2, CalendarDays } from "lucide-react";
import { AdminEvent } from "@/features/events/types";
import { ManagedUser } from "../types/managed";
import { assignUserToEvent, unassignUserFromEvent } from "../services/userService";

interface Props {
  user: ManagedUser;
  events: AdminEvent[];
  onClose: () => void;
  onChanged: () => void;
}

export default function AssignEventsModal({ user, events, onClose, onChanged }: Props) {
  const [assigned, setAssigned] = useState<Set<string>>(
    () => new Set(events.filter((e) => e.id && e.assignedUserIds?.includes(user.uid)).map((e) => e.id as string))
  );
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const toggle = async (eventId: string) => {
    setBusyId(eventId);
    setError(null);
    const isAssigned = assigned.has(eventId);
    try {
      if (isAssigned) await unassignUserFromEvent(eventId, user.uid);
      else await assignUserToEvent(eventId, user.uid);
      setAssigned((prev) => {
        const next = new Set(prev);
        if (isAssigned) next.delete(eventId);
        else next.add(eventId);
        return next;
      });
      onChanged();
    } catch (err) {
      console.error(err);
      setError("No se pudo actualizar la asignación.");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg bg-[#0d131f] border border-white/10 rounded-[2rem] shadow-2xl p-8 max-h-[90vh] flex flex-col">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-white">Asignar a eventos</h2>
            <p className="text-xs text-brand-porcelain/50">{user.name}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors" title="Cerrar">
            <X size={18} />
          </button>
        </div>

        <div className="overflow-y-auto no-scrollbar flex-1 min-h-0 flex flex-col gap-2">
          {events.length === 0 ? (
            <p className="text-sm text-brand-porcelain/50 py-8 text-center">Aún no tienes eventos. Crea uno primero.</p>
          ) : (
            events.map((e) => {
              const id = e.id as string;
              const on = assigned.has(id);
              return (
                <button
                  key={id}
                  onClick={() => toggle(id)}
                  disabled={busyId !== null}
                  className={`flex items-center gap-3 text-left p-3 rounded-xl border transition-all disabled:opacity-60 ${
                    on ? "bg-brand-bronze/15 border-brand-bronze/40" : "bg-white/[0.04] border-white/10 hover:bg-white/[0.07]"
                  }`}
                >
                  <div className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 ${on ? "bg-brand-bronze border-brand-bronze" : "border-white/30"}`}>
                    {busyId === id ? <Loader2 size={12} className="animate-spin text-brand-night" /> : on ? <span className="text-brand-night text-xs font-black">✓</span> : null}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-white truncate">{e.name}</p>
                    <p className="text-[11px] text-brand-porcelain/50 flex items-center gap-1"><CalendarDays size={11} /> {e.date}</p>
                  </div>
                </button>
              );
            })
          )}
        </div>

        {error && <p className="text-red-400 text-sm mt-3">{error}</p>}

        <button onClick={onClose} className="w-full mt-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm font-bold text-white hover:bg-white/10 transition-all">
          Cerrar
        </button>
      </div>
    </div>
  );
}
