"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { CalendarDays, Users, BarChart2, LogOut } from "lucide-react";
import { useAuth } from "@/shared/lib/AuthContext";
import { auth } from "@/shared/lib/firebase";
import { signOut } from "firebase/auth";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useAuth();

  // Protección de ruta
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  // Si está cargando o no hay usuario, mostramos una pantalla en blanco (o un spinner)
  if (loading || !user) {
    return (
      <div className="min-h-screen bg-[#0d131f] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-brand-bronze border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const navItems = [
    { name: "Gestión de eventos", href: "/dashboard", icon: CalendarDays },
    { name: "Reportes y métricas", href: "/dashboard/reports", icon: BarChart2 },
    { name: "Usuarios y staff", href: "/dashboard/users", icon: Users },
  ];

  return (
    <div className="flex h-screen bg-[#0d131f] text-brand-porcelain font-sans overflow-hidden">
      
      <aside className="w-[260px] bg-[#1B2A3D]/70 backdrop-blur-[22px] border-r border-brand-porcelain/20 rounded-r-[28px] flex flex-col justify-between hidden md:flex z-20 shadow-2xl">
        <div>
          <div className="p-8 pb-10">
            <Link href="/" className="block">
              <h1 className="font-serif text-2xl font-semibold text-brand-porcelain leading-tight">EventFlow AI</h1>
              <p className="text-xs text-brand-porcelain/65 tracking-wide mt-1">Panel de administración</p>
            </Link>
          </div>

          <nav className="px-4 space-y-1.5">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-[14px] transition-all duration-300 border-l-[3px] ${
                    isActive
                      ? "bg-brand-porcelain/10 border-brand-bronze text-brand-porcelain font-semibold"
                      : "border-transparent text-brand-porcelain/70 hover:bg-brand-porcelain/5 hover:text-brand-porcelain"
                  }`}
                >
                  <item.icon size={20} className={isActive ? "text-brand-porcelain" : "text-brand-porcelain/70"} />
                  <span className="text-sm truncate">{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 text-brand-brick hover:bg-brand-brick/10 px-4 py-3 rounded-[14px] transition-colors text-sm font-medium"
          >
            <LogOut size={20} />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <main className="flex-1 overflow-y-auto p-6 md:p-10 relative">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-brand-bronze/5 via-transparent to-transparent pointer-events-none -z-10" />
          <div className="max-w-[1200px] mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
