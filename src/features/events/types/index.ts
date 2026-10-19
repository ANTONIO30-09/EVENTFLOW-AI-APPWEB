export type EventStatus = 'planificacion' | 'enCurso' | 'finalizado';

export interface AdminEvent {
  id: string;
  nombre: string;
  fecha: string;
  lugar: string;
  estado: EventStatus;
  invitados: number;
  checkIn: number;
  itemsEscaneados: number;
}

export const etiquetaEstado = (e: EventStatus) => {
  if (e === 'planificacion') return 'Planificación';
  if (e === 'enCurso') return 'En curso';
  return 'Finalizado';
};

export const colorEstado = (e: EventStatus) => {
  if (e === 'planificacion') return 'bg-brand-bronze';
  if (e === 'enCurso') return 'bg-brand-porcelain/50';
  return 'bg-brand-sage';
};
