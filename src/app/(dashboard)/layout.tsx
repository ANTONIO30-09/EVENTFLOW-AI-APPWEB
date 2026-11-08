"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/shared/lib/AuthContext";
import { Loader2, LogOut, Home } from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#0d131f]">
        <Loader2 className="animate-spin text-brand-bronze" size={48} />
      </div>
    );
  }

  if (!user) return null;

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-[#0d131f] text-brand-porcelain flex">
      <aside className="w-64 bg-white/5 backdrop-blur-lg border-r border-white/10 p-6 flex flex-col">
        <h2 className="text-2xl font-black text-brand-bronze mb-8 tracking-widest uppercase">EventFlow</h2>
        <nav className="flex flex-col gap-2 flex-1">
          <a href="/dashboard" className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/10 transition-colors text-sm font-bold">
            <Home size={18} />
            Inicio
          </a>
        </nav>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-red-500/10 text-red-400 transition-colors text-sm font-bold mt-auto"
        >
          <LogOut size={18} />
          Cerrar Sesión
        </button>
      </aside>
      <main className="flex-1 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
