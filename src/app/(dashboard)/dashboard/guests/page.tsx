"use client";

import { Users } from "lucide-react";
import ComingSoon from "@/shared/components/ui/ComingSoon";

export default function GuestsPage() {
  return (
    <ComingSoon
      title="Invitados"
      description="Administra la lista de invitados de tus eventos."
      icon={Users}
      features={["Alta, edición y baja de invitados", "Importación desde CSV", "Asignación a mesas"]}
    />
  );
}
