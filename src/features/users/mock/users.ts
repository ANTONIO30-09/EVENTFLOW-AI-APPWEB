import { AdminUser } from '../types';

export const mockUsers: AdminUser[] = [
  { id: 'us-001', nombre: 'Antonio Quiroga', correo: 'antonio.quiroga@eventflow.ai', rol: 'organizador' },
  { id: 'us-002', nombre: 'María Fernández', correo: 'maria.fernandez@eventflow.ai', rol: 'organizador' },
  { id: 'us-003', nombre: 'Luis Choque', correo: 'luis.choque@eventflow.ai', rol: 'staff' },
  { id: 'us-004', nombre: 'Andrea Villarroel', correo: 'andrea.villarroel@eventflow.ai', rol: 'staff' },
  { id: 'us-005', nombre: 'Rodrigo Méndez', correo: 'rodrigo.mendez@eventflow.ai', rol: 'staff' },
  { id: 'us-006', nombre: 'Carla Gutiérrez', correo: 'carla.gutierrez@eventflow.ai', rol: 'organizador' },
];
