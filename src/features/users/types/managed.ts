export type ManagedRole = "organizador" | "staff";
export type AccessType = "email" | "username";

export interface ManagedUser {
  uid: string;
  name: string;
  email: string;
  role: string;
  active: boolean;
  adminId: string;
  accessType?: AccessType;
  mustChangePassword?: boolean;
  createdAt?: number;
}
