export interface AdminEvent {
  id?: string;
  name: string;
  status?: "planificacion" | "en_curso" | "finalizado";
  type: "boda" | "quince" | "corporativo" | "otro";
  customType?: string;
  date: string;
  location: string;
  lat?: number;
  lng?: number;
  guestCount: number;
  organizerId: string;
  createdAt: number;
}
