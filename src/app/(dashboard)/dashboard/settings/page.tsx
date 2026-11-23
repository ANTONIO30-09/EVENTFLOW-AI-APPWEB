"use client";

import { Settings } from "lucide-react";
import ComingSoon from "@/shared/components/ui/ComingSoon";

export default function SettingsPage() {
  return (
    <ComingSoon
      title="Configuración"
      description="Personaliza tu cuenta y las preferencias del panel."
      icon={Settings}
      features={["Perfil del organizador", "Preferencias del panel", "Seguridad de la cuenta"]}
    />
  );
}
