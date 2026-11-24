"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Plus, Search, Loader2, Users, SearchX, QrCode, Edit, Trash2, ClipboardPaste, FileText, CalendarDays } from "lucide-react";
import { motion } from "framer-motion";
import { useEvents } from "@/features/events/hooks/useEvents";
import { useGuests } from "@/features/guests/hooks/useGuests";
import { Guest } from "@/features/guests/types";
import GuestModal from "@/features/guests/components/GuestModal";
import ImportGuestsModal from "@/features/guests/components/ImportGuestsModal";
import GuestQRModal from "@/features/guests/components/GuestQRModal";
import { exportPassesPdf } from "@/features/guests/lib/passes";

type GuestFilter = "todos" | "ingresados" | "pendientes" | "sin_mesa" | "sin_numero";

export default function GuestsPage() {
  const { events, loading: eventsLoading } = useEvents();
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<GuestFilter>("todos");
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [guestToEdit, setGuestToEdit] = useState<Guest | null>(null);
  const [qrGuest, setQrGuest] = useState<Guest | null>(null);
  const [exporting, setExporting] = useState(false);

  const eventId =
    selectedEventId && events.some((e) => e.id === selectedEventId) ? selectedEventId : events[0]?.id;
  const currentEvent = events.find((e) => e.id === eventId);

  const { guests, loading, reload, removeGuest } = useGuests(eventId);

  const totalPeople = useMemo(() => guests.reduce((sum, g) => sum + 1 + (g.companions || 0), 0), [guests]);
  const checkedInCount = useMemo(() => guests.filter((g) => g.checkedIn).length, [guests]);
  const noPhoneCount = useMemo(() => guests.filter((g) => !g.phone).length, [guests]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return guests.filter((g) => {
      const matchesText =
        term === "" ||
        g.name.toLowerCase().includes(term) ||
        (g.phone ?? "").includes(term) ||
        g.familyGroup.toLowerCase().includes(term);
      const matchesFilter =
        filter === "todos" ||
        (filter === "ingresados" && g.checkedIn) ||
        (filter === "pendientes" && !g.checkedIn) ||
        (filter === "sin_mesa" && g.tableNumber === "") ||
        (filter === "sin_numero" && !g.phone);
      return matchesText && matchesFilter;
    });
  }, [guests, search, filter]);

  const handleExport = async () => {
    if (!currentEvent) return;
    setExporting(true);
    try {
      await exportPassesPdf(currentEvent.name, guests);
    } finally {
      setExporting(false);
    }
  };

  const selectClass =
    "bg-white/[0.04] border border-white/10 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-brand-bronze/60 transition-colors";

  const kpis = [
    { label: "Invitados", value: guests.length },
    { label: "Personas en total", value: totalPeople },
    { label: "Ya ingresaron", value: checkedInCount },
    { label: "Sin número", value: noPhoneCount },
  ];

  return (
    <div className="max-w-7xl mx-auto flex flex-col gap-6 relative px-6 py-8 md:px-10 md:py-10 overflow-x-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-5%] left-[10%] w-[600px] h-[600px] bg-brand-bronze/15 rounded-full blur-[140px]" />
        <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[140px]" />
      </div>

      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 pt-4">
        <div>
          <h1 className="text-4xl font-black text-white mb-2 tracking-tight drop-shadow-lg">Invitados</h1>
          <p className="text-brand-porcelain/60">Importa la lista del cliente y controla los pases de cada evento.</p>
        </div>
        {currentEvent && (
          <div className="flex flex-wrap gap-3">
            <button onClick={() => setIsImportOpen(true)} className="flex items-center gap-2 bg-gradient-to-r from-brand-bronze to-[#FFD700] text-brand-night font-bold py-3 px-6 rounded-xl hover:scale-105 transition-all shadow-[0_0_30px_rgba(184,134,62,0.4)]">
              <ClipboardPaste size={18} />
              Importar texto
            </button>
            <button
              onClick={() => {
                setGuestToEdit(null);
                setIsFormOpen(true);
              }}
              className="flex items-center gap-2 bg-white/5 border border-white/10 text-white font-bold py-3 px-6 rounded-xl hover:bg-white/10 hover:border-brand-bronze transition-all"
            >
              <Plus size={18} className="text-brand-bronze" />
              Nuevo invitado
            </button>
          </div>
        )}
      </motion.div>

      {eventsLoading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-brand-bronze" size={40} /></div>
      ) : events.length === 0 ? (
        <div className="bg-white/[0.04] backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-16 flex flex-col items-center justify-center text-center min-h-[350px]">
          <div className="w-24 h-24 bg-gradient-to-br from-brand-bronze/20 to-transparent rounded-full flex items-center justify-center mb-6 border border-brand-bronze/30">
            <CalendarDays size={36} className="text-brand-bronze" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-3">Primero crea un evento</h3>
          <p className="text-brand-porcelain/50 max-w-md mb-8 text-sm">Los invitados pertenecen a un evento. Crea el primero y vuelve aquí.</p>
          <Link href="/dashboard/events" className="flex items-center gap-2 bg-white/5 border border-white/10 text-white font-bold py-3 px-8 rounded-xl hover:bg-white/10 hover:border-brand-bronze transition-all">
            Ir a Mis Eventos
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {kpis.map((kpi) => (
              <div key={kpi.label} className="bg-white/[0.04] backdrop-blur-2xl border border-white/10 p-5 rounded-[1.5rem] shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.1)]">
                <p className="text-xs text-brand-porcelain/50 font-medium mb-1">{kpi.label}</p>
                <p className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-white/60">{kpi.value}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-col lg:flex-row gap-4 lg:items-center">
            <select value={eventId ?? ""} onChange={(e) => setSelectedEventId(e.target.value)} className={selectClass}>
              {events.map((e) => (
                <option key={e.id} value={e.id} className="bg-[#0d131f]">{e.name}</option>
              ))}
            </select>
            <div className="relative w-full lg:max-w-md">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-porcelain/40" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar por nombre, teléfono o familia..."
                className="w-full bg-white/[0.04] border border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder:text-brand-porcelain/40 focus:outline-none focus:border-brand-bronze/60 transition-colors"
              />
            </div>
            <select value={filter} onChange={(e) => setFilter(e.target.value as GuestFilter)} className={selectClass}>
              <option value="todos" className="bg-[#0d131f]">Todos</option>
              <option value="pendientes" className="bg-[#0d131f]">Pendientes de ingreso</option>
              <option value="ingresados" className="bg-[#0d131f]">Ya ingresaron</option>
              <option value="sin_mesa" className="bg-[#0d131f]">Sin mesa</option>
              <option value="sin_numero" className="bg-[#0d131f]">Sin número</option>
            </select>
            <button onClick={handleExport} disabled={exporting || guests.length === 0} className="flex items-center justify-center gap-2 bg-white/5 border border-white/10 text-white font-bold text-sm py-3 px-5 rounded-xl hover:bg-white/10 hover:border-brand-bronze transition-all disabled:opacity-50">
              {exporting ? <Loader2 size={16} className="animate-spin" /> : <FileText size={16} className="text-brand-bronze" />}
              PDF de pases
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center py-20"><Loader2 className="animate-spin text-brand-bronze" size={40} /></div>
          ) : guests.length === 0 ? (
            <div className="bg-white/[0.04] backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-16 flex flex-col items-center justify-center text-center min-h-[350px]">
              <div className="w-24 h-24 bg-gradient-to-br from-brand-bronze/20 to-transparent rounded-full flex items-center justify-center mb-6 border border-brand-bronze/30">
                <Users size={36} className="text-brand-bronze" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Este evento no tiene invitados</h3>
              <p className="text-brand-porcelain/50 max-w-md mb-8 text-sm">Pega el texto que te envió el cliente con los nombres y números, y los cargamos todos de una vez.</p>
              <button onClick={() => setIsImportOpen(true)} className="flex items-center gap-2 bg-white/5 border border-white/10 text-white font-bold py-3 px-8 rounded-xl hover:bg-white/10 hover:border-brand-bronze transition-all">
                <ClipboardPaste size={18} className="text-brand-bronze" />
                Importar desde texto
              </button>
            </div>
          ) : filtered.length === 0 ? (
            <div className="bg-white/[0.04] backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-12 flex flex-col items-center justify-center text-center min-h-[250px]">
              <SearchX size={36} className="text-brand-porcelain/40 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Sin resultados</h3>
              <p className="text-brand-porcelain/50 text-sm">Prueba con otro texto o cambia el filtro.</p>
            </div>
          ) : (
            <div className="bg-white/[0.04] backdrop-blur-2xl border border-white/10 rounded-[2rem] overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm min-w-[860px]">
                  <thead>
                    <tr className="text-xs uppercase tracking-wider text-brand-porcelain/50 border-b border-white/10">
                      <th className="px-6 py-4 font-bold">Invitado</th>
                      <th className="px-4 py-4 font-bold">Teléfono</th>
                      <th className="px-4 py-4 font-bold">Acomp.</th>
                      <th className="px-4 py-4 font-bold">Mesa</th>
                      <th className="px-4 py-4 font-bold">Ingreso</th>
                      <th className="px-6 py-4 font-bold text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((g) => (
                      <tr key={g.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.03] transition-colors">
                        <td className="px-6 py-4">
                          <p className="font-bold text-white">{g.name}</p>
                          {g.familyGroup && <p className="text-xs text-brand-porcelain/50">{g.familyGroup}</p>}
                        </td>
                        <td className="px-4 py-4 text-brand-porcelain/70 font-mono text-xs">{g.phone || "—"}</td>
                        <td className="px-4 py-4 text-white font-bold">{g.companions}</td>
                        <td className="px-4 py-4 text-brand-porcelain/70">{g.tableNumber || <span className="text-brand-porcelain/40">Sin mesa</span>}</td>
                        <td className="px-4 py-4">
                          <span className={`px-3 py-1 rounded-full text-[11px] font-bold border ${g.checkedIn ? "bg-green-500/15 text-green-400 border-green-500/30" : "bg-white/10 text-brand-porcelain/60 border-white/15"}`}>
                            {g.checkedIn ? "Ingresó" : "Pendiente"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={() => setQrGuest(g)} className="p-2.5 bg-white/5 rounded-full hover:bg-brand-bronze/20 hover:text-brand-bronze transition-all text-white/50 border border-white/10" title="Ver pase QR">
                              <QrCode size={16} />
                            </button>
                            <button
                              onClick={() => {
                                setGuestToEdit(g);
                                setIsFormOpen(true);
                              }}
                              className="p-2.5 bg-white/5 rounded-full hover:bg-brand-bronze/20 hover:text-brand-bronze transition-all text-white/50 border border-white/10"
                              title="Editar"
                            >
                              <Edit size={16} />
                            </button>
                            <button onClick={() => removeGuest(g.id)} className="p-2.5 bg-white/5 rounded-full hover:bg-red-500/20 hover:text-red-400 transition-all text-white/50 border border-white/10" title="Eliminar">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {isImportOpen && eventId && currentEvent && (
        <ImportGuestsModal eventId={eventId} eventName={currentEvent.name} existing={guests} onClose={() => setIsImportOpen(false)} onImported={reload} />
      )}

      {isFormOpen && eventId && (
        <GuestModal eventId={eventId} guestToEdit={guestToEdit} onClose={() => setIsFormOpen(false)} onSaved={reload} />
      )}

      {qrGuest && currentEvent && <GuestQRModal guest={qrGuest} eventName={currentEvent.name} onClose={() => setQrGuest(null)} />}
    </div>
  );
}
