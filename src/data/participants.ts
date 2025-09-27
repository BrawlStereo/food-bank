import { Participant } from '../types';

function generarClave() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let clave = '';
  for (let i = 0; i < 6; i++) {
    clave += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return clave;
}

export const participantes: Participant[] = [
  { id: 'par-001', nombre: 'Ana García',  },
  { id: 'par-002', nombre: 'Luis Pérez' },
  { id: 'par-003', nombre: 'María López' },
  { id: 'par-004', nombre: 'Jorge Hernández' },
  { id: 'par-005', nombre: 'Sofía Díaz' },
  { id: 'par-006', nombre: 'Carlos Ruiz' },
  { id: 'par-007', nombre: 'Elena Torres' },
  { id: 'par-008', nombre: 'Diego Sánchez' },
  { id: 'par-009', nombre: 'Paula Romero' },
  { id: 'par-010', nombre: 'Fernando Ortiz' },
];


