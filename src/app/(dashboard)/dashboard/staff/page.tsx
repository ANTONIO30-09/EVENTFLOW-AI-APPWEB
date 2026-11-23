"use client";

import { ShieldCheck } from "lucide-react";
import ComingSoon from "@/shared/components/ui/ComingSoon";

export default function StaffPage() {
  return (
    <ComingSoon
      title="Gestión de Staff"
      description="Administra al personal que trabaja en tus eventos."
      icon={ShieldCheck}
      features={["Alta de personal y roles", "Asignación a eventos", "Control de accesos"]}
    />
  );
}
