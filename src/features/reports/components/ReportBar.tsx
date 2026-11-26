interface Props {
  label: string;
  value: number;
  max: number;
  suffix?: string;
  color?: string;
}

export default function ReportBar({ label, value, max, suffix = "", color = "from-brand-bronze to-[#FFD700]" }: Props) {
  const width = max <= 0 ? 0 : Math.min(100, Math.round((value / max) * 100));
  return (
    <div>
      <div className="flex justify-between text-xs mb-1.5">
        <span className="text-brand-porcelain/70 truncate pr-3">{label}</span>
        <span className="text-white font-bold shrink-0">
          {value}
          {suffix}
        </span>
      </div>
      <div className="h-2 rounded-full bg-white/10 overflow-hidden">
        <div className={`h-full rounded-full bg-gradient-to-r ${color}`} style={{ width: `${width}%` }} />
      </div>
    </div>
  );
}
