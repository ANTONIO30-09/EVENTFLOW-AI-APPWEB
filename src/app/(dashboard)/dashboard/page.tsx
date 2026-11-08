"use client";
import { useAuth } from "@/shared/lib/AuthContext";

export default function DashboardHome() {
  const { user } = useAuth();
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold text-brand-porcelain">Hola, {user?.displayName || "Organizador"}</h1>
      <p className="text-brand-porcelain/60">Bienvenido a tu panel de administración de EventFlow AI.</p>
    </div>
  );
}