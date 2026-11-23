"use client";

import { BarChart3 } from "lucide-react";
import ComingSoon from "@/shared/components/ui/ComingSoon";

export default function ReportsPage() {
  return (
    <ComingSoon
      title="Reportes"
      description="Consulta métricas y resúmenes de tus eventos."
      icon={BarChart3}
      features={["Asistencia e invitados confirmados", "Resumen de inventario", "Exportación de reportes"]}
    />
  );
}
