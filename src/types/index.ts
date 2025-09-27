export type UserRole = 'admin' | 'voluntario';

export type DeliveryStatus = 'activo' | 'pasado';

export interface Participant {
  id: string;
  nombre: string;
  clave?: string;
  lastLogin?: string;
}

export interface Product {
  id: string;
  nombre: string;
  imagen: string; // placeholder uri
}

export interface Delivery {
  id: string;
  titulo: string;
  estado: DeliveryStatus;
  fecha: string; // ISO date or display string
  ubicacion: string;
  camion: string;
  participantes: string[]; // participant ids
  registros?: DeliveryRecord[]; // registros de productos entregados
}

export interface DeliveryRecord {
  id: string;
  productoId: string;
  productoNombre: string;
  voluntarioNombre: string;
  fechaHora: string; // display string for now
}


