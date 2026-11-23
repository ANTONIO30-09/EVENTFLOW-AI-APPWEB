export type EventStatus = "planificacion" | "en_curso" | "finalizado";

export interface AdminEvent {
  id?: string;
  name: string;
  type: "boda" | "quince" | "corporativo" | "otro";
  customType?: string;
  date: string;
  location: string;
  lat?: number;
  lng?: number;
  guestCount: number;
  status?: EventStatus;
  adminId: string;
  assignedUserIds?: string[];
  distributionApproved?: boolean;
  distributionSource?: string;
  createdAt: number;
}
