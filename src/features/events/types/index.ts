export interface AdminEvent {
  id?: string;
  title: string;
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
