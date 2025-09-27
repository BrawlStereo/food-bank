import React, { createContext, useContext, useMemo, useState } from 'react';
import { Delivery, Participant, Product, UserRole, DeliveryRecord } from '../types';
import { entregas as entregasSeed } from '../data/deliveries';
import { productos as productosSeed } from '../data/products';
import { participantes as participantesSeed } from '../data/participants';

interface DataContextValue {
  rol: UserRole | null;
  setRol: (r: UserRole | null) => void;
  entregas: Delivery[];
  setEntregas: React.Dispatch<React.SetStateAction<Delivery[]>>;
  productos: Product[];
  participantes: Participant[];
  setParticipantes: React.Dispatch<React.SetStateAction<Participant[]>>;
  loginById: (id: string) => boolean;
  addParticipant: (nombre: string) => string;
  iniciarEntrega: (id: string) => void;
  finalizarEntrega: (id: string) => void;
  agregarEntrega: (nueva: Omit<Delivery, 'id'>) => void;
  logout: () => void;
  registrarProducto: (entregaId: string, producto: { id: string; nombre: string }, voluntarioNombre: string) => void;
  agregarProducto: (nuevo: Omit<Product, 'id'>) => void;
}

const DataContext = createContext<DataContextValue | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [rol, setRol] = useState<UserRole | null>(null);
  const [entregas, setEntregas] = useState<Delivery[]>(entregasSeed);
  const [productos, setProductos] = useState<Product[]>(productosSeed);
  const [participantes, setParticipantes] = useState<Participant[]>(participantesSeed);
  // Login by participant ID
  const loginById = (id: string) => {
    const found = participantes.find(p => p.id === id.trim());
    if (found) {
      setRol('voluntario');
      return true;
    }
    return false;
  };

  // Admin: add new participant
  const addParticipant = (nombre: string) => {
    const id = `par-${Math.random().toString(36).slice(2, 7)}`;
    setParticipantes(prev => [...prev, { id, nombre }]);
    return id;
  };

  const iniciarEntrega = (id: string) => {
    setEntregas(prev => prev.map(e => (e.id === id ? { ...e, estado: 'activo' } : e)));
  };

  const finalizarEntrega = (id: string) => {
    setEntregas(prev => prev.map(e => (e.id === id ? { ...e, estado: 'pasado' } : e)));
  };

  const agregarEntrega = (nueva: Omit<Delivery, 'id'>) => {
    const id = `ent-${Math.random().toString(36).slice(2, 7)}`;
    setEntregas(prev => [{ id, registros: [], ...nueva }, ...prev]);
  };

  const logout = () => {
    setRol(null);
  };

  const registrarProducto = (entregaId: string, producto: { id: string; nombre: string }, voluntarioNombre: string) => {
    const record: DeliveryRecord = {
      id: `reg-${Math.random().toString(36).slice(2, 7)}`,
      productoId: producto.id,
      productoNombre: producto.nombre,
      voluntarioNombre,
      fechaHora: '2025-09-17 10:00',
    };
    setEntregas(prev => prev.map(e => e.id === entregaId ? { ...e, registros: [...(e.registros || []), record] } : e));
  };

  const agregarProducto = (nuevo: Omit<Product, 'id'>) => {
    const id = `prod-${Math.random().toString(36).slice(2, 7)}`;
    setProductos(prev => [{ id, ...nuevo }, ...prev]);
  };

  const value = useMemo(
    () => ({
      rol,
      setRol,
      entregas,
      setEntregas,
      productos,
      participantes,
      setParticipantes,
      loginById,
      addParticipant,
      iniciarEntrega,
      finalizarEntrega,
      agregarEntrega,
      logout,
      registrarProducto,
      agregarProducto,
    }),
    [rol, entregas, productos, participantes]
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = () => {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData debe usarse dentro de DataProvider');
  return ctx;
};


