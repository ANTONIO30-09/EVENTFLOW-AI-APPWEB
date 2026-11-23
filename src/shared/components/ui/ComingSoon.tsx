"use client";

import { LucideIcon, Hammer } from "lucide-react";
import { motion } from "framer-motion";

interface Props {
  title: string;
  description: string;
  icon: LucideIcon;
  features?: string[];
}

export default function ComingSoon({ title, description, icon: Icon, features = [] }: Props) {
  return (
    <div className="max-w-7xl mx-auto flex flex-col gap-6 relative px-6 py-8 md:px-10 md:py-10 overflow-x-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-5%] left-[10%] w-[600px] h-[600px] bg-brand-bronze/15 rounded-full blur-[140px]" />
        <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[140px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="pt-4"
      >
        <h1 className="text-4xl font-black text-white mb-2 tracking-tight drop-shadow-lg">{title}</h1>
        <p className="text-brand-porcelain/60">{description}</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-white/[0.04] backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-12 md:p-16 flex flex-col items-center justify-center text-center shadow-[0_20px_50px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.1)] min-h-[400px]"
      >
        <div className="w-24 h-24 bg-gradient-to-br from-brand-bronze/20 to-transparent rounded-full flex items-center justify-center mb-6 border border-brand-bronze/30 shadow-[0_0_30px_rgba(184,134,62,0.15)]">
          <Icon size={36} className="text-brand-bronze" />
        </div>

        <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-brand-bronze/20 to-[#FFD700]/10 text-[#FFD700] text-[10px] font-black uppercase tracking-wider rounded-lg border border-[#FFD700]/20 mb-4">
          <Hammer size={12} />
          En desarrollo
        </span>

        <h2 className="text-2xl font-bold text-white mb-3">Este módulo estará disponible pronto</h2>
        <p className="text-brand-porcelain/50 max-w-md text-sm">
          Estamos trabajando en esta sección. Mientras tanto, puedes seguir gestionando tus eventos desde Mis Eventos.
        </p>

        {features.length > 0 && (
          <ul className="mt-8 flex flex-col gap-2 text-sm text-brand-porcelain/70">
            {features.map((feature) => (
              <li key={feature} className="flex items-center gap-2 justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-bronze" />
                {feature}
              </li>
            ))}
          </ul>
        )}
      </motion.div>
    </div>
  );
}
