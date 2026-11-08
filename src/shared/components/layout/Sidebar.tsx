"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAuth } from "@/shared/lib/AuthContext";
import { useState } from "react";
import { 
  Home, CalendarDays, Users, BrainCircuit, Package, 
  ShieldCheck, BarChart3, Settings, LogOut, ChevronLeft, ChevronRight 
} from "lucide-react";

const MENU_ITEMS = [
  { name: "Inicio", href: "/dashboard", icon: Home },
  { name: "Mis Eventos", href: "/dashboard/events", icon: CalendarDays },
  { name: "Invitados", href: "/dashboard/guests", icon: Users },
  { name: "Distribución IA", href: "/dashboard/ai-seating", icon: BrainCircuit },
  { name: "Inventario y QRs", href: "/dashboard/inventory", icon: Package },
  { name: "Gestión de Staff", href: "/dashboard/staff", icon: ShieldCheck },
  { name: "Reportes", href: "/dashboard/reports", icon: BarChart3 },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const getInitials = (name: string | null | undefined) => {
    if (!name) return "OR";
    return name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();
  };

  return (
    <aside 
      className={`h-screen bg-[#0d131f]/80 backdrop-blur-3xl border-r border-white/5 flex flex-col justify-between transition-[width,padding] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] will-change-[width] relative z-50 shadow-[4px_0_24px_rgba(0,0,0,0.3)] ${
        isCollapsed ? "w-[90px] px-3 py-5 items-center" : "w-[280px] px-4 py-5"
      }`}
    >
      {/* Botón colapsable */}
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-6 w-6 h-6 bg-[#1a2235] border border-white/10 rounded-full flex items-center justify-center text-brand-porcelain/70 hover:text-white hover:border-brand-bronze transition-colors z-50 shadow-lg"
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      {/* 1. LOGO FIJO */}
      <div className={`shrink-0 mb-6 flex items-center w-full ${isCollapsed ? "justify-center" : ""}`}>
        <div className="relative w-11 h-11 shrink-0 rounded-full border-[1.5px] border-[#FFD700] p-1 shadow-[0_0_15px_rgba(255,215,0,0.3)] bg-[#0d131f]">
          <div className="relative w-full h-full">
            <Image src="/images/logo.png" alt="EventFlow" fill className="object-contain p-1" />
          </div>
        </div>
        <h2 className={`text-xl font-black text-white tracking-[0.2em] uppercase whitespace-nowrap overflow-hidden transition-[max-width,opacity,margin] duration-300 ${isCollapsed ? "max-w-0 opacity-0 ml-0" : "max-w-[200px] opacity-100 ml-3"}`}>
          EventFlow
        </h2>
      </div>

      {/* 2. RECUADRO DE CRISTAL (Contenedor fijo) */}
      <div className="flex-1 min-h-0 w-full mb-4">
        <div className="h-full flex flex-col bg-white/[0.02] border border-white/[0.05] rounded-[1.5rem] p-2 w-full">
          
          {/* 2a. ZONA CON SCROLL (Solo iconos) */}
          <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col items-center w-full py-2">
            {MENU_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link 
                  key={item.name} 
                  href={item.href}
                  title={isCollapsed ? item.name : undefined}
                  className={`relative flex items-center rounded-xl transition-colors duration-300 text-sm font-medium mb-1 shrink-0 ${
                    isCollapsed ? "justify-center h-11 w-11" : "px-4 py-3 w-full"
                  } ${
                    isActive 
                      ? "bg-gradient-to-r from-[#FFD700]/15 to-transparent text-[#FFD700] border border-[#FFD700]/20 shadow-[inset_0_0_15px_rgba(255,215,0,0.05)]" 
                      : "text-brand-porcelain/60 hover:text-white hover:bg-white/5 border border-transparent"
                  }`}
                >
                  {isActive && !isCollapsed && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-[#FFD700] rounded-r-md shadow-[0_0_10px_rgba(255,215,0,0.8)]" />
                  )}
                  <Icon size={20} className={`shrink-0 ${isActive ? "text-[#FFD700] drop-shadow-[0_0_8px_rgba(255,215,0,0.5)]" : ""}`} />
                  
                  {/* Texto animado con max-width */}
                  <span className={`whitespace-nowrap overflow-hidden transition-[max-width,opacity,margin] duration-300 ${isCollapsed ? "max-w-0 opacity-0 ml-0" : "max-w-[200px] opacity-100 ml-3"}`}>
                    {item.name}
                  </span>
                </Link>
              );
            })}
          </div>

          {/* 2b. ZONA FIJA (Configuración al fondo del recuadro) */}
          <div className="shrink-0 w-full mt-1 border-t border-white/5 pt-2 flex flex-col items-center">
            <Link 
              href="/dashboard/settings"
              title={isCollapsed ? "Configuración" : undefined}
              className={`relative flex items-center rounded-xl transition-colors duration-300 text-sm font-medium w-full ${
                isCollapsed ? "justify-center h-11 w-11" : "px-4 py-3"
              } ${
                pathname === "/dashboard/settings" 
                  ? "bg-gradient-to-r from-[#FFD700]/15 to-transparent text-[#FFD700] border border-[#FFD700]/20" 
                  : "text-brand-porcelain/60 hover:text-white hover:bg-white/5 border border-transparent"
              }`}
            >
              <Settings size={20} className="shrink-0" />
              <span className={`whitespace-nowrap overflow-hidden transition-[max-width,opacity,margin] duration-300 ${isCollapsed ? "max-w-0 opacity-0 ml-0" : "max-w-[200px] opacity-100 ml-3"}`}>
                Configuración
              </span>
            </Link>
          </div>

        </div>
      </div>

      {/* 3. PERFIL FIJO */}
      <div className="shrink-0 w-full">
        <div className={`bg-white/[0.04] border border-white/[0.08] rounded-2xl flex items-center transition-all w-full ${isCollapsed ? "p-2 justify-center flex-col gap-2" : "p-3 justify-between"}`}>
          <div className={`flex items-center overflow-hidden ${isCollapsed ? "justify-center" : ""}`}>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FFD700] to-[#B8860B] flex items-center justify-center text-[#0d131f] font-black shadow-md shrink-0 text-sm">
              {getInitials(user?.displayName)}
            </div>
            
            <div className={`flex flex-col overflow-hidden transition-[max-width,opacity,margin] duration-300 ${isCollapsed ? "max-w-0 opacity-0 ml-0" : "max-w-[150px] opacity-100 ml-3"}`}>
              <span className="text-sm font-bold text-white truncate">{user?.displayName || "Organizador"}</span>
              <span className="text-[11px] text-brand-porcelain/50 truncate">{user?.email}</span>
            </div>
          </div>
          
          <button 
            onClick={logout}
            title="Cerrar Sesión"
            className={`bg-white/5 hover:bg-red-500/20 text-brand-porcelain/60 hover:text-red-400 rounded-xl transition-all shrink-0 ${isCollapsed ? "p-2 mt-1" : "p-2.5"}`}
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>

    </aside>
  );
}
