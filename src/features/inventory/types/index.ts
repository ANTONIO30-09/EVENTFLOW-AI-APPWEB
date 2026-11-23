export const INVENTORY_CATEGORIES = [
  "mobiliario",
  "decoracion",
  "audio",
  "iluminacion",
  "vajilla",
  "estructuras",
  "tecnologia",
  "logistica",
  "otro",
] as const;

export type InventoryCategory = (typeof INVENTORY_CATEGORIES)[number];
export type InventoryStatus = "disponible" | "en_uso" | "usado";

export interface InventoryItem {
  id?: string;
  name: string;
  category: InventoryCategory;
  quantity: number;
  status: InventoryStatus;
  timesUsed: number;
  notes?: string;
  organizerId: string;
  createdAt: number;
}

export const CATEGORY_LABELS: Record<InventoryCategory, string> = {
  mobiliario: "Mobiliario",
  decoracion: "Decoración y ambientación",
  audio: "Audio y sonido",
  iluminacion: "Iluminación",
  vajilla: "Vajilla y cristalería",
  estructuras: "Estructuras y escenario",
  tecnologia: "Tecnología y registro",
  logistica: "Logística y señalética",
  otro: "Otro",
};

export const STATUS_LABELS: Record<InventoryStatus, string> = {
  disponible: "Disponible",
  en_uso: "En uso",
  usado: "Usado",
};

export const NEXT_STATUS: Record<InventoryStatus, InventoryStatus> = {
  disponible: "en_uso",
  en_uso: "usado",
  usado: "disponible",
};

export const NEXT_STATUS_ACTION: Record<InventoryStatus, string> = {
  disponible: "Marcar en uso",
  en_uso: "Marcar usado",
  usado: "Reutilizar",
};
