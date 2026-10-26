export type UserRole = 'organizador' | 'staff';

export interface AdminUser {
  id: string;
  nombre: string;
  correo: string;
  rol: UserRole;
}

export const etiquetaRol = (r: UserRole) => r === 'organizador' ? 'Organizador' : 'Staff';
