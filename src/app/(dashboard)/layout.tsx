"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/shared/lib/AuthContext";
import { Loader2 } from "lucide-react";
import Sidebar from "@/shared/components/layout/Sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#0d131f]">
        <Loader2 className="animate-spin text-brand-bronze" size={48} />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="h-screen w-full bg-[#0d131f] text-brand-porcelain flex overflow-hidden">
      <Sidebar />
      
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Fondo sutil de gradiente para el panel */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(184,134,62,0.05)_0%,_transparent_50%)] pointer-events-none" />
        
        <main className="flex-1 overflow-y-auto relative z-10 w-full h-full">
          {children}
        </main>
      </div>
    </div>
  );
}
