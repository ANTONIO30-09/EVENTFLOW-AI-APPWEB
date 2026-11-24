"use client";

import { useMemo, useState } from "react";
import { Plus, Search, Loader2, Users, SearchX, CalendarCheck, Power, Mail } from "lucide-react";
import { motion } from "framer-motion";
import { useUsers } from "@/features/users/hooks/useUsers";
import { useEvents } from "@/features/events/hooks/useEvents";
import UserModal from "@/features/users/components/UserModal";
import CredentialsModal from "@/features/users/components/CredentialsModal";
import AssignEventsModal from "@/features/users/components/AssignEventsModal";
import { CreatedUser, resendInvite } from "@/features/users/services/userService";
import { ManagedUser } from "@/features/users/types/managed";

const ROLE_LABELS: Record<string, string> = { organizador: "Organizador", staff: "Staff" };

export default function UsersPage() {
  const { users, loading, reload, toggleActive } = useUsers();
  const { events, reload: reloadEvents } = useEvents();
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<"todos" | "organizador" | "staff">("todos");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [created, setCreated] = useState<{ data: CreatedUser; name: string; role: string } | null>(null);
  const [assignUser, setAssignUser] = useState<ManagedUser | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return users.filter((u) => {
      const matchesRole = roleFilter === "todos" || u.role === roleFilter;
      const matchesText = term === "" || u.name.toLowerCase().includes(term) || u.email.toLowerCase().includes(term);
      return matchesRole && matchesText;
    });
  }, [users, search, roleFilter]);

  const eventsCount = (uid: string) => events.filter((e) => e.assignedUserIds?.includes(uid)).length;

  const handleResend = async (u: ManagedUser) => {
    try {
      await resendInvite(u.email);
      setNotice(`Correo reenviado a ${u.email}`);
    } catch {
      setNotice("No se pudo reenviar el correo.");
    }
    setTimeout(() => setNotice(null), 3000);
  };

  const selectClass =
    "bg-white/[0.04] border border-white/10 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-brand-bronze/60 transition-colors";

  return (
    <div className="max-w-7xl mx-auto flex flex-col gap-6 relative px-6 py-8 md:px-10 md:py-10 overflow-x-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-5%] left-[10%] w-[600px] h-[600px] bg-brand-bronze/15 rounded-full blur-[140px]" />
        <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[140px]" />
      </div>

      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="flex justify-between items-end pt-4">
        <div>
          <h1 className="text-4xl font-black text-white mb-2 tracking-tight drop-shadow-lg">Gestión de usuarios</h1>
          <p className="text-brand-porcelain/60">Crea organizadores y staff, y asígnalos a tus eventos.</p>
        </div>
        <button
          onClick={() => setIsCreateOpen(true)}
          className="group flex items-center gap-2 bg-gradient-to-r from-brand-bronze to-[#FFD700] text-brand-night font-bold py-3 px-6 rounded-xl hover:scale-105 transition-all shadow-[0_0_30px_rgba(184,134,62,0.4)] overflow-hidden relative"
        >
          <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
          <Plus size={20} className="relative z-10" />
          <span className="relative z-10">Nuevo usuario</span>
        </button>
      </motion.div>

      <div className="flex flex-col lg:flex-row gap-4 lg:items-center">
        <div className="relative w-full lg:max-w-md">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-porcelain/40" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre o usuario..."
            className="w-full bg-white/[0.04] border border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder:text-brand-porcelain/40 focus:outline-none focus:border-brand-bronze/60 transition-colors"
          />
        </div>
        <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value as "todos" | "organizador" | "staff")} className={selectClass}>
          <option value="todos" className="bg-[#0d131f]">Todos los roles</option>
          <option value="organizador" className="bg-[#0d131f]">Organizadores</option>
          <option value="staff" className="bg-[#0d131f]">Staff</option>
        </select>
        {notice && <span className="text-xs text-brand-bronze">{notice}</span>}
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-brand-bronze" size={40} /></div>
      ) : users.length === 0 ? (
        <div className="bg-white/[0.04] backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-16 flex flex-col items-center justify-center text-center min-h-[350px]">
          <div className="w-24 h-24 bg-gradient-to-br from-brand-bronze/20 to-transparent rounded-full flex items-center justify-center mb-6 border border-brand-bronze/30">
            <Users size={36} className="text-brand-bronze" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-3">Aún no tienes usuarios</h3>
          <p className="text-brand-porcelain/50 max-w-md mb-8 text-sm">Crea cuentas para tu staff y organizadores. Ellos entrarán desde la app móvil y verán solo los eventos que les asignes.</p>
          <button onClick={() => setIsCreateOpen(true)} className="flex items-center gap-2 bg-white/5 border border-white/10 text-white font-bold py-3 px-8 rounded-xl hover:bg-white/10 hover:border-brand-bronze transition-all">
            <Plus size={18} className="text-brand-bronze" />
            Crear el primer usuario
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
                  <th className="px-6 py-4 font-bold">Usuario</th>
                  <th className="px-4 py-4 font-bold">Rol</th>
                  <th className="px-4 py-4 font-bold">Eventos</th>
                  <th className="px-4 py-4 font-bold">Estado</th>
                  <th className="px-6 py-4 font-bold text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((u) => (
                  <tr key={u.uid} className="border-b border-white/5 last:border-0 hover:bg-white/[0.03] transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold text-white">{u.name}</p>
                      <p className="text-xs text-brand-porcelain/50 truncate max-w-[300px]">{u.email}</p>
                    </td>
                    <td className="px-4 py-4 text-brand-porcelain/70">{ROLE_LABELS[u.role] ?? u.role}</td>
                    <td className="px-4 py-4 text-white font-bold">{eventsCount(u.uid)}</td>
                    <td className="px-4 py-4">
                      <span className={`px-3 py-1 rounded-full text-[11px] font-bold border ${u.active ? "bg-green-500/15 text-green-400 border-green-500/30" : "bg-red-500/15 text-red-400 border-red-500/30"}`}>
                        {u.active ? "Activo" : "Desactivado"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => setAssignUser(u)} className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-xs font-bold text-white hover:bg-brand-bronze/20 hover:border-brand-bronze/50 transition-all flex items-center gap-1.5">
                          <CalendarCheck size={13} className="text-brand-bronze" />
                          Asignar
                        </button>
                        {u.accessType === "email" && (
                          <button onClick={() => handleResend(u)} className="p-2.5 bg-white/5 rounded-full hover:bg-brand-bronze/20 hover:text-brand-bronze transition-all text-white/50 border border-white/10" title="Reenviar correo">
                            <Mail size={16} />
                          </button>
                        )}
                        <button onClick={() => toggleActive(u)} className={`p-2.5 bg-white/5 rounded-full transition-all text-white/50 border border-white/10 ${u.active ? "hover:bg-red-500/20 hover:text-red-400" : "hover:bg-green-500/20 hover:text-green-400"}`} title={u.active ? "Desactivar" : "Reactivar"}>
                          <Power size={16} />
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

      {isCreateOpen && (
        <UserModal
          onClose={() => setIsCreateOpen(false)}
          onCreated={(data, name, role) => {
            setIsCreateOpen(false);
            setCreated({ data, name, role });
            reload();
          }}
        />
      )}

      {created && (
        <CredentialsModal created={created.data} name={created.name} role={created.role} onClose={() => setCreated(null)} />
      )}

      {assignUser && (
        <AssignEventsModal user={assignUser} events={events} onClose={() => setAssignUser(null)} onChanged={reloadEvents} />
      )}
    </div>
  );
}
