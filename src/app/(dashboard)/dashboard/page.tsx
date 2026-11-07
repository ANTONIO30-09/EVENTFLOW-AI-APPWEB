"use client";
import { useState } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockEvents: any[] = [
  { id: "1", name: "Boda de Oro", date: "2026-12-15", location: "Salón Principal" },
];

export default function DashboardPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [events] = useState<any[]>(mockEvents);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-brand-porcelain mb-6">Mis Eventos</h1>
      {events.length === 0 ? (
        <p className="text-sm text-brand-porcelain/70">Crea el primero con el botón &quot;Nuevo evento&quot; de arriba.</p>
      ) : (
        <div className="grid gap-4">
          {events.map((event) => (
            <div key={event.id} className="bg-white/5 backdrop-blur-lg border border-white/10 p-4 rounded-2xl">
              <h2 className="text-xl font-bold text-brand-porcelain">{event.name}</h2>
              <p className="text-brand-porcelain/60">{event.date} - {event.location}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
