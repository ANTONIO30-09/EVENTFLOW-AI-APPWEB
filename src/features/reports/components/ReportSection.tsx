import { ReactNode } from "react";

interface Props {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

export default function ReportSection({ title, subtitle, children }: Props) {
  return (
    <section className="bg-white/[0.04] backdrop-blur-2xl border border-white/10 rounded-[2rem] p-6 shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.1)]">
      <h2 className="text-lg font-bold text-white">{title}</h2>
      {subtitle && <p className="text-xs text-brand-porcelain/50 mb-4">{subtitle}</p>}
      {!subtitle && <div className="mb-4" />}
      {children}
    </section>
  );
}
