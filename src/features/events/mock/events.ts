import { AdminEvent } from '../types';

export const mockEvents: AdminEvent[] = [
  { id: 'ev-001', nombre: 'Boda Valeria & Andrés', fecha: '2026-03-14', lugar: 'Hacienda San Isidro, Quillacollo', estado: 'planificacion', invitados: 180, checkIn: 0, itemsEscaneados: 12 },
  { id: 'ev-002', nombre: 'Quince años Camila', fecha: '2026-02-22', lugar: 'Salón Los Álamos, Cochabamba', estado: 'enCurso', invitados: 120, checkIn: 87, itemsEscaneados: 64 },
  { id: 'ev-003', nombre: 'Aniversario Club Tunari', fecha: '2026-01-18', lugar: 'Club Tunari, Tiquipaya', estado: 'finalizado', invitados: 240, checkIn: 233, itemsEscaneados: 198 },
  { id: 'ev-004', nombre: 'Graduación Promo 2026', fecha: '2026-04-05', lugar: 'Centro de Convenciones El Portal, Cochabamba', estado: 'planificacion', invitados: 320, checkIn: 0, itemsEscaneados: 8 },
  { id: 'ev-005', nombre: 'Corporativo Andes Tech', fecha: '2026-02-08', lugar: 'Hotel Cochabamba, Cochabamba', estado: 'enCurso', invitados: 95, checkIn: 41, itemsEscaneados: 30 },
];
