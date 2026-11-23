"use client";

import { BrainCircuit } from "lucide-react";
import ComingSoon from "@/shared/components/ui/ComingSoon";

export default function AiSeatingPage() {
  return (
    <ComingSoon
      title="Distribución IA"
      description="Organiza las mesas de tu evento con ayuda de inteligencia artificial."
      icon={BrainCircuit}
      features={["Sugerencias automáticas de distribución", "Reglas de afinidad entre invitados", "Ajuste manual de mesas"]}
    />
  );
}
