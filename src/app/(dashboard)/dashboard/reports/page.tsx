"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Loader2, Download, CalendarDays, Users, UserCheck, LayoutGrid, Package, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { useEvents } from "@/features/events/hooks/useEvents";
import { useInventory } from "@/features/inventory/hooks/useInventory";
import { useUsers } from "@/features/users/hooks/useUsers";
import { useGuestsByEvent } from "@/features/reports/hooks/useGuestsByEvent";
import { guestStats, inventoryStats, pct, peopleOf } from "@/features/reports/lib/metrics";
import { downloadCsv, formatDateTime } from "@/features/reports/lib/csv";
import ReportBar from "@/features/reports/components/ReportBar";
import ReportSection from "@/features/reports/components/ReportSection";
import { CATEGORY_LABELS, STATUS_LABELS, InventoryStatus } from "@/features/inventory/types";
import { slugify } from "@/features/guests/lib/passes";

const STATUS_COLORS: Record<InventoryStatus, string> = {
  disponible: "from-green-500 to-green-300",
  en_uso: "from-blue-500 to-blue-300",
  usado: "from-white/40 to-white/20",
};

export default function ReportsPage() {
  const { events, loading: eventsLoading } = useEvents();
  const { items, loading: inventoryLoading } = useInventory();
  const { users, loading: usersLoading } = useUsers();
  const { byEvent, loading: guestsLoading } = useGuestsByEvent(events);
  const [selected, setSelected] = useState<string>("todos");

  const effective = selected === "todos" || events.some((e) => e.id === selected) ? selected : "todos";
  const scopeEvents = useMemo(
    () => (effective === "todos" ? events : events.filter((e) => e.id === effective)),
    [events, effective]
  );
  const scopeGuests = useMemo(
    () => scopeEvents.flatMap((e) => (e.id ? byEvent[e.id] ?? [] : [])),
    [scopeEvents, byEvent]
  );

  const stats = useMemo(() => guestStats(scopeGuests), [scopeGuests]);
  const inv = useMemo(() => inventoryStats(items), [items]);
  const perEvent = useMemo(
    () => scopeEvents.map((e) => ({ event: e, stats: guestStats(e.id ? byEvent[e.id] ?? [] : []) })),
    [scopeEvents, byEvent]
  );

  const recentCheckIns = useMemo(
    () =>
      scopeGuests
        .filter((g) => g.checkedIn && g.checkInTime)
        .sort((a, b) => new Date(b.checkInTime as string).getTime() - new Date(a.checkInTime as string).getTime())
        .slice(0, 5),
    [scopeGuests]
  );

  const usersByRole = useMemo(() => {
    const count = (role: string, active: boolean) => users.filter((u) => u.role === role && u.active === active).length;
    return {
      organizadoresActivos: count("organizador", true),
      organizadoresInactivos: count("organizador", false),
      staffActivos: count("staff", true),
      staffInactivos: count("staff", false),
    };
  }, [users]);

  const loading = eventsLoading || inventoryLoading || usersLoading || guestsLoading;
  const eventName = (id: string) => events.find((e) => e.id === id)?.name ?? "";
  const scopeLabel = effective === "todos" ? "todos-los-eventos" : slugify(eventName(effective)) || "evento";

  const exportGuests = () => {
    const rows: (string | number)[][] = [
      ["Evento", "Nombre", "Teléfono", "Acompañantes", "Personas", "Grupo familiar", "Mesa", "Ingresó", "Hora de ingreso"],
    ];
    scopeEvents.forEach((e) => {
      (e.id ? byEvent[e.id] ?? [] : []).forEach((g) => {
        rows.push([
          e.name,
          g.name,
          g.phone ?? "",
          g.companions,
          peopleOf(g),
          g.familyGroup,
          g.tableNumber,
          g.checkedIn ? "Sí" : "No",
          formatDateTime(g.checkInTime),
        ]);
      });
    });
    downloadCsv(`invitados-${scopeLabel}.csv`, rows);
  };

  const exportInventory = () => {
    const rows: (string | number)[][] = [["Ítem", "Categoría", "Cantidad", "Estado", "Veces usado", "Notas"]];
    items.forEach((i) => {
      rows.push([i.name, CATEGORY_LABELS[i.category], i.quantity, STATUS_LABELS[i.status], i.timesUsed ?? 0, i.notes ?? ""]);
    });
    downloadCsv("inventario.csv", rows);
  };

  const selectClass =
    "bg-white/[0.04] border border-white/10 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-brand-bronze/60 transition-colors";

  const kpis = [
    { label: "Eventos", value: scopeEvents.length, sub: "en este reporte", icon: CalendarDays },
    { label: "Invitados", value: stats.guests, sub: `${stats.withoutPhone} sin número`, icon: Users },
    { label: "Personas esperadas", value: stats.people, sub: "con acompañantes", icon: Users },
    { label: "Ya ingresaron", value: stats.checkedInPeople, sub: `${pct(stats.checkedInPeople, stats.people)}% de las esperadas`, icon: UserCheck },
    { label: "Con mesa asignada", value: stats.withTable, sub: `${pct(stats.withTable, stats.guests)}% de los invitados`, icon: LayoutGrid },
  ];

  return (
    <div className="max-w-7xl mx-auto flex flex-col gap-6 relative px-6 py-8 md:px-10 md:py-10 overflow-x-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-5%] left-[10%] w-[600px] h-[600px] bg-brand-bronze/15 rounded-full blur-[140px]" />
        <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[140px]" />
      </div>

      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 pt-4">
        <div>
          <h1 className="text-4xl font-black text-white mb-2 tracking-tight drop-shadow-lg">Reportes</h1>
          <p className="text-brand-porcelain/60">Asistencia, mesas, inventario y equipo de tus eventos.</p>
        </div>
        {events.length > 0 && (
          <div className="flex flex-wrap gap-3">
            <button onClick={exportGuests} disabled={loading || scopeGuests.length === 0} className="flex items-center gap-2 bg-white/5 border border-white/10 text-white font-bold text-sm py-3 px-5 rounded-xl hover:bg-white/10 hover:border-brand-bronze transition-all disabled:opacity-50">
              <Download size={16} className="text-brand-bronze" />
              Invitados (CSV)
            </button>
            <button onClick={exportInventory} disabled={loading || items.length === 0} className="flex items-center gap-2 bg-white/5 border border-white/10 text-white font-bold text-sm py-3 px-5 rounded-xl hover:bg-white/10 hover:border-brand-bronze transition-all disabled:opacity-50">
              <Download size={16} className="text-brand-bronze" />
              Inventario (CSV)
            </button>
          </div>
        )}
      </motion.div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-brand-bronze" size={40} /></div>
      ) : events.length === 0 ? (
        <div className="bg-white/[0.04] backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-16 flex flex-col items-center justify-center text-center min-h-[350px]">
          <div className="w-24 h-24 bg-gradient-to-br from-brand-bronze/20 to-transparent rounded-full flex items-center justify-center mb-6 border border-brand-bronze/30">
            <CalendarDays size={36} className="text-brand-bronze" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-3">Aún no hay datos para reportar</h3>
          <p className="text-brand-porcelain/50 max-w-md mb-8 text-sm">Crea un evento y carga sus invitados para ver la asistencia y el avance de mesas.</p>
          <Link href="/dashboard/events" className="flex items-center gap-2 bg-white/5 border border-white/10 text-white font-bold py-3 px-8 rounded-xl hover:bg-white/10 hover:border-brand-bronze transition-all">
            Ir a Mis Eventos
          </Link>
        </div>
      ) : (
        <>
          <select value={effective} onChange={(e) => setSelected(e.target.value)} className={`${selectClass} w-full md:w-80`}>
            <option value="todos" className="bg-[#0d131f]">Todos los eventos</option>
            {events.map((e) => (
              <option key={e.id} value={e.id} className="bg-[#0d131f]">{e.name}</option>
            ))}
          </select>

          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            {kpis.map((kpi) => {
              const Icon = kpi.icon;
              return (
                <div key={kpi.label} className="bg-white/[0.04] backdrop-blur-2xl border border-white/10 p-5 rounded-[1.5rem] shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.1)]">
                  <div className="flex items-center gap-2 text-brand-porcelain/50 mb-1">
                    <Icon size={14} />
                    <p className="text-xs font-medium">{kpi.label}</p>
                  </div>
                  <p className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-white/60">{kpi.value}</p>
                  <p className="text-[11px] text-brand-porcelain/40 mt-1">{kpi.sub}</p>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ReportSection title="Asistencia y mesas" subtitle="Avance sobre las personas e invitados del reporte">
              <div className="flex flex-col gap-4">
                <ReportBar label="Personas ingresadas" value={stats.checkedInPeople} max={stats.people} suffix={` de ${stats.people}`} color="from-green-500 to-green-300" />
                <ReportBar label="Invitados con mesa asignada" value={stats.withTable} max={stats.guests} suffix={` de ${stats.guests}`} />
                <ReportBar label="Invitados con número de contacto" value={stats.guests - stats.withoutPhone} max={stats.guests} suffix={` de ${stats.guests}`} color="from-blue-500 to-blue-300" />
              </div>
            </ReportSection>

            {effective === "todos" ? (
              <ReportSection title="Resumen por evento" subtitle="Invitados, ingreso y distribución de cada evento">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm min-w-[460px]">
                    <thead>
                      <tr className="text-[11px] uppercase tracking-wider text-brand-porcelain/50 border-b border-white/10">
                        <th className="py-2 pr-3 font-bold">Evento</th>
                        <th className="py-2 px-2 font-bold">Invit.</th>
                        <th className="py-2 px-2 font-bold">Ingreso</th>
                        <th className="py-2 px-2 font-bold">Mesas</th>
                        <th className="py-2 pl-2 font-bold">Distribución</th>
                      </tr>
                    </thead>
                    <tbody>
                      {perEvent.map(({ event, stats: s }) => (
                        <tr key={event.id} className="border-b border-white/5 last:border-0">
                          <td className="py-2.5 pr-3">
                            <p className="text-white font-bold truncate max-w-[180px]">{event.name}</p>
                            <p className="text-[11px] text-brand-porcelain/40">{event.date}</p>
                          </td>
                          <td className="py-2.5 px-2 text-white font-bold">{s.guests}</td>
                          <td className="py-2.5 px-2 text-brand-porcelain/70">{pct(s.checkedInPeople, s.people)}%</td>
                          <td className="py-2.5 px-2 text-brand-porcelain/70">{pct(s.withTable, s.guests)}%</td>
                          <td className="py-2.5 pl-2">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${event.distributionApproved ? "bg-green-500/15 text-green-400 border-green-500/30" : "bg-white/10 text-brand-porcelain/60 border-white/15"}`}>
                              {event.distributionApproved ? "Aprobada" : "Pendiente"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </ReportSection>
            ) : (
              <ReportSection title="Últimos ingresos" subtitle="Los 5 check-ins más recientes de este evento">
                {recentCheckIns.length === 0 ? (
                  <p className="text-sm text-brand-porcelain/50">Todavía no hay ingresos registrados.</p>
                ) : (
                  <ul className="flex flex-col gap-3">
                    {recentCheckIns.map((g) => (
                      <li key={g.id} className="flex items-center justify-between gap-3 text-sm">
                        <span className="text-white font-bold truncate">{g.name}</span>
                        <span className="text-[11px] text-brand-porcelain/50 shrink-0">{formatDateTime(g.checkInTime)}</span>
                      </li>
                    ))}
                  </ul>
                )}
                <p className="text-xs text-brand-porcelain/50 mt-4">
                  Pendientes de ingreso: <span className="text-white font-bold">{stats.guests - stats.checkedInGuests}</span> invitados
                </p>
              </ReportSection>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ReportSection title="Inventario por estado" subtitle={`${inv.items} ítems · ${inv.units} unidades en total`}>
              {inv.items === 0 ? (
                <p className="text-sm text-brand-porcelain/50">Aún no hay ítems en el inventario.</p>
              ) : (
                <div className="flex flex-col gap-4">
                  {(Object.keys(inv.byStatus) as InventoryStatus[]).map((status) => (
                    <ReportBar key={status} label={`${STATUS_LABELS[status]} (${inv.byStatus[status].items} ítems)`} value={inv.byStatus[status].units} max={inv.units} suffix=" unid." color={STATUS_COLORS[status]} />
                  ))}
                </div>
              )}
            </ReportSection>

            <ReportSection title="Inventario por categoría" subtitle="Unidades registradas en cada categoría">
              {inv.byCategory.length === 0 ? (
                <p className="text-sm text-brand-porcelain/50">Sin datos todavía.</p>
              ) : (
                <div className="flex flex-col gap-4">
                  {inv.byCategory.map((c) => (
                    <ReportBar key={c.category} label={CATEGORY_LABELS[c.category]} value={c.units} max={inv.byCategory[0].units} suffix=" unid." />
                  ))}
                </div>
              )}
            </ReportSection>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ReportSection title="Ítems más usados" subtitle="Según las veces que se marcaron en uso">
              {inv.topUsed.length === 0 ? (
                <p className="text-sm text-brand-porcelain/50">Aún no hay ítems usados.</p>
              ) : (
                <ul className="flex flex-col gap-3">
                  {inv.topUsed.map((i) => (
                    <li key={i.id} className="flex items-center justify-between gap-3 text-sm">
                      <span className="flex items-center gap-2 text-white font-bold truncate"><Package size={14} className="text-brand-bronze shrink-0" />{i.name}</span>
                      <span className="text-xs text-brand-porcelain/60 shrink-0">{i.timesUsed} usos</span>
                    </li>
                  ))}
                </ul>
              )}
            </ReportSection>

            <ReportSection title="Equipo" subtitle="Usuarios que creaste para la app móvil">
              {users.length === 0 ? (
                <p className="text-sm text-brand-porcelain/50">Aún no has creado usuarios.</p>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "Organizadores activos", value: usersByRole.organizadoresActivos },
                    { label: "Staff activo", value: usersByRole.staffActivos },
                    { label: "Organizadores desactivados", value: usersByRole.organizadoresInactivos },
                    { label: "Staff desactivado", value: usersByRole.staffInactivos },
                  ].map((u) => (
                    <div key={u.label} className="bg-white/[0.03] border border-white/10 rounded-xl p-3">
                      <p className="flex items-center gap-1.5 text-[11px] text-brand-porcelain/50"><ShieldCheck size={12} />{u.label}</p>
                      <p className="text-2xl font-black text-white">{u.value}</p>
                    </div>
                  ))}
                </div>
              )}
            </ReportSection>
          </div>
        </>
      )}
    </div>
  );
}
