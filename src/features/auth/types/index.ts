export type UserRole = "admin" | "organizador" | "staff" | "pendiente";

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  role: UserRole;
  active: boolean;
  adminId?: string;
}
