"use client";

import { Package } from "lucide-react";
import ComingSoon from "@/shared/components/ui/ComingSoon";

export default function InventoryPage() {
  return (
    <ComingSoon
      title="Inventario y QRs"
      description="Controla el inventario de tus eventos y genera códigos QR."
      icon={Package}
      features={["Registro de ítems por evento", "Generación de códigos QR", "Control de entradas y salidas"]}
    />
  );
}
