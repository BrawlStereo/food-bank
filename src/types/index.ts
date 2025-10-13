// Roles de usuario
export type UserRole = 'admin' | 'voluntario';

// Estados posibles de una entrega
export type DeliveryStatus = 'pendiente' | 'activo' | 'pasado';

// Participante del sistema
export interface Participant {
  id: string;
  nombre: string;
  clave?: string;
  lastLogin?: string;
}

// Producto en catálogo
export interface Product {
  id: string;
  nombre: string;
  imagen: string; // URL o ruta de imagen
}

// Registro de un producto entregado
export interface DeliveryRecord {
  id: string;
  productoId: string;
  productoNombre: string;
  voluntarioNombre: string;
  fechaHora: string;
}

// Producto dentro de una entrega
export interface DeliveryProduct {
  id: string;
  nombre: string;
  estado: 'no entregado' | 'entregado';
}

// Entrega completa
export interface Delivery {
  id: string;
  titulo: string;
  fecha: string; // formato de fecha o string ISO
  ubicacion: string;
  camion: string;
  estado: DeliveryStatus;
  participantes: string[]; // IDs de los participantes
  productos?: DeliveryProduct[]; // productos con su estado
  registros?: DeliveryRecord[];  // historial de entregas
  creadoEn?: string;

  [key: string]: any;
}

// Payload para crear nuevas entregas (sin ID)
export type NewDeliveryPayload = Omit<Delivery, 'id'>;
