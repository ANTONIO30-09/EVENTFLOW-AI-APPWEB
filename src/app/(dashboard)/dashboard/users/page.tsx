"use client";

import { useState } from "react";
import { Eye, ArrowUp, AlertTriangle } from "lucide-react";
import { mockUsers } from "@/features/users/mock/users";
import { AdminUser, UserRole, etiquetaRol } from "@/features/users/types";

export default function UsersPage() {
  const [users, setUsers] = useState<AdminUser[]>(mockUsers);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [confirmAction, setConfirmAction] = useState<{ user: AdminUser, action: 'ascender' | 'degradar' } | null>(null);

  const total = users.length;
  const organizadores = users.filter(u => u.rol === 'organizador').length;
  const staff = total - organizadores;

  const getInitials = (name: string) => {
    const parts = name.trim().split(' ');
    return ((parts[0]?.[0] || '') + (parts[parts.length - 1]?.[0] || '')).toUpperCase();
  };

  const colorRol = (rol: UserRole) => rol === 'organizador' ? 'text-brand-bronze' : 'text-brand-gray';
  const bgRol = (rol: UserRole) => rol === 'organizador' ? 'bg-brand-bronze/20 border-brand-bronze/40' : 'bg-brand-gray/20 border-brand-gray/40';

  const handleConfirmRole = () => {
    if (!confirmAction) return;
    setUsers(users.map(u => u.id === confirmAction.user.id ? { ...u, rol: confirmAction.action === 'ascender' ? 'organizador' : 'staff' } : u));
    setConfirmAction(null);
    setSelectedUser(null);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 w-full relative">
      
      {/* HEADER */}
      <div className="mb-6">
        <h1 className="font-serif text-[34px] font-semibold text-brand-porcelain leading-tight mb-1.5">Usuarios y staff</h1>
        <p className="text-sm text-brand-porcelain/75 leading-relaxed">Administra roles y accesos del equipo.</p>
      </div>

      {/* RESUMEN */}
      <div className="flex justify-end mb-4">
        <span className="text-[13px] font-medium text-brand-porcelain/60">
          {total} usuarios · {organizadores} organizadores · {staff} staff
        </span>
      </div>

      {/* CONTENEDOR PRINCIPAL */}
      <div className="bg-[#1B2A3D]/70 backdrop-blur-[22px] border border-brand-porcelain/20 rounded-[28px] p-5 shadow-2xl">
        
        {/* VISTA ESCRITORIO */}
        <div className="hidden md:block w-full">
          <div className="flex items-center px-2 py-2.5 border-b border-brand-porcelain/10">
            <div className="flex-[4] text-[11px] font-semibold text-brand-porcelain/50 tracking-wider">NOMBRE</div>
            <div className="flex-[5] text-[11px] font-semibold text-brand-porcelain/50 tracking-wider">CORREO</div>
            <div className="flex-[3] text-[11px] font-semibold text-brand-porcelain/50 tracking-wider">ROL</div>
            <div className="w-[120px] text-[11px] font-semibold text-brand-porcelain/50 tracking-wider text-right">ACCIONES</div>
          </div>

          <div className="flex flex-col">
            {users.map(u => (
              <div key={u.id} className="flex items-center px-2 py-3 border-b border-brand-porcelain/5 hover:bg-brand-porcelain/5 transition-colors">
                <div className="flex-[4] flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border ${bgRol(u.rol)}`}>
                    <span className={`font-serif text-[13px] font-semibold ${colorRol(u.rol)}`}>{getInitials(u.nombre)}</span>
                  </div>
                  <span className="text-sm font-medium text-brand-porcelain truncate">{u.nombre}</span>
                </div>
                <div className="flex-[5] text-sm text-brand-porcelain/75 truncate pr-4">{u.correo}</div>
                <div className="flex-[3]">
                  <span className={`inline-block px-2.5 py-1 rounded-full border text-[11px] font-semibold tracking-wider ${bgRol(u.rol)} ${colorRol(u.rol)}`}>
                    {etiquetaRol(u.rol).toUpperCase()}
                  </span>
                </div>
                <div className="w-[120px] flex justify-end">
                  <button onClick={() => setSelectedUser(u)} className="flex items-center gap-1.5 px-3 py-1.5 text-brand-bronze hover:bg-brand-bronze/10 rounded-xl transition-colors text-xs font-semibold">
                    <Eye size={16} /> Ver detalle
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* VISTA MÓVIL */}
        <div className="block md:hidden">
          {users.map(u => (
            <div key={u.id} className="py-4 border-b border-brand-porcelain/10 last:border-0 px-1 flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border ${bgRol(u.rol)}`}>
                  <span className={`font-serif text-[15px] font-semibold ${colorRol(u.rol)}`}>{getInitials(u.nombre)}</span>
                </div>
                <div className="flex-1 overflow-hidden">
                  <h3 className="font-serif text-[17px] font-semibold text-brand-porcelain">{u.nombre}</h3>
                  <p className="text-xs text-brand-porcelain/70 truncate">{u.correo}</p>
                </div>
                <span className={`inline-block px-2 py-1 rounded-full border text-[10px] font-semibold ${bgRol(u.rol)} ${colorRol(u.rol)}`}>
                  {etiquetaRol(u.rol).toUpperCase()}
                </span>
              </div>
              <div className="flex justify-end">
                <button onClick={() => setSelectedUser(u)} className="flex items-center gap-1.5 px-3 py-1.5 text-brand-bronze hover:bg-brand-bronze/10 rounded-xl transition-colors text-xs font-semibold">
                  <Eye size={16} /> Ver detalle
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL 1: DETALLE DEL USUARIO */}
      {selectedUser && !confirmAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#1B2A3D]/90 backdrop-blur-xl border border-brand-porcelain/20 rounded-[28px] p-6 w-full max-w-[460px] shadow-2xl">
            <div className="flex items-center gap-4 mb-5">
              <div className={`w-14 h-14 rounded-full flex items-center justify-center border ${bgRol(selectedUser.rol)}`}>
                <span className={`font-serif text-[22px] font-semibold ${colorRol(selectedUser.rol)}`}>{getInitials(selectedUser.nombre)}</span>
              </div>
              <div className="flex-1 overflow-hidden">
                <h3 className="font-serif text-[22px] font-semibold text-brand-porcelain leading-tight">{selectedUser.nombre}</h3>
                <p className="text-[13px] text-brand-porcelain/75 truncate">{selectedUser.correo}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 mb-5">
              <span className={`inline-block px-2.5 py-1 rounded-full border text-[11px] font-semibold ${bgRol(selectedUser.rol)} ${colorRol(selectedUser.rol)}`}>
                {etiquetaRol(selectedUser.rol).toUpperCase()}
              </span>
              <span className="text-xs text-brand-porcelain/55">ID local: {selectedUser.id}</span>
            </div>

            <hr className="border-brand-porcelain/10 mb-5" />

            <div className="flex justify-end gap-2">
              <button onClick={() => setSelectedUser(null)} className="px-4 py-3 text-sm font-medium text-brand-porcelain/75 hover:bg-brand-porcelain/5 rounded-[14px] transition-colors">
                Cerrar
              </button>
              {selectedUser.rol === 'organizador' ? (
                <button onClick={() => setConfirmAction({ user: selectedUser, action: 'degradar' })} className="px-4 py-3 rounded-[14px] border border-brand-brick text-brand-brick text-sm font-semibold hover:bg-brand-brick/10 transition-colors">
                  Pasar a staff
                </button>
              ) : (
                <button onClick={() => setConfirmAction({ user: selectedUser, action: 'ascender' })} className="px-4 py-3 rounded-[14px] bg-brand-bronze text-brand-night text-sm font-semibold hover:bg-brand-bronze/90 transition-colors">
                  Ascender a organizador
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: CONFIRMACIÓN DE CAMBIO DE ROL */}
      {confirmAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#1B2A3D]/90 backdrop-blur-xl border border-brand-porcelain/20 rounded-[28px] p-6 w-full max-w-[480px] shadow-2xl">
            <div className="flex items-start gap-3 mb-3">
              {confirmAction.action === 'ascender' ? (
                <ArrowUp className="text-brand-bronze mt-0.5 shrink-0" size={22} />
              ) : (
                <AlertTriangle className="text-brand-brick mt-0.5 shrink-0" size={22} />
              )}
              <h3 className="font-serif text-[22px] font-semibold text-brand-porcelain leading-tight">
                {confirmAction.action === 'ascender' 
                  ? `Cambiar rol de "${confirmAction.user.nombre}"` 
                  : 'Quitar permisos de organizador'}
              </h3>
            </div>
            <p className="text-sm text-brand-porcelain/80 leading-relaxed mb-6">
              {confirmAction.action === 'ascender' 
                ? 'Estás por dar permisos de organizador a esta persona. Podrá crear, editar y eliminar eventos, además de administrar a otros usuarios. Esta acción es sensible.'
                : `Estás por quitarle los permisos de organizador a "${confirmAction.user.nombre}". Pasará a staff y perderá acceso a la gestión de eventos y usuarios. Esta acción es sensible.`}
            </p>
            <div className="flex justify-end gap-2">
              <button onClick={() => setConfirmAction(null)} className="px-4 py-3 text-sm font-medium text-brand-porcelain/75 hover:bg-brand-porcelain/5 rounded-[14px] transition-colors">
                Cancelar
              </button>
              <button onClick={handleConfirmRole} className={`px-4 py-3 text-sm font-semibold rounded-[14px] transition-colors ${confirmAction.action === 'ascender' ? 'bg-brand-bronze text-brand-night hover:bg-brand-bronze/90' : 'bg-brand-brick text-brand-porcelain hover:bg-brand-brick/90'}`}>
                {confirmAction.action === 'ascender' ? 'Ascender' : 'Pasar a staff'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
