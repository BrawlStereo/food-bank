import React, { createContext, useContext, useMemo, useState, useEffect } from 'react';
import { Delivery, Participant, Product, UserRole, DeliveryRecord } from '../types';
import { entregas as entregasSeed } from '../data/deliveries';
import { productos as productosSeed } from '../data/products';
import { collection, onSnapshot, addDoc } from 'firebase/firestore';
import { db } from '../fireBase/firebaseConfig';

//esta función me genera una clave random de 6 caracteres
function generarClave() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let clave = '';
  for (let i = 0; i < 6; i++) {
    clave += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return clave;
}

// Aquí defino la forma de mi contexto, para tener todo en un solo lugar
interface DataContextValue {
  rol: UserRole | null;
  setRol: (r: UserRole | null) => void;
  entregas: Delivery[];
  setEntregas: React.Dispatch<React.SetStateAction<Delivery[]>>;
  productos: Product[];
  participantes: Participant[];
  setParticipantes: React.Dispatch<React.SetStateAction<Participant[]>>;
  iniciarEntrega: (id: string) => void;
  finalizarEntrega: (id: string) => void;
  agregarEntrega: (nueva: Omit<Delivery, 'id'>) => void;
  logout: () => void;
  registrarProducto: (
    entregaId: string,
    producto: { id: string; nombre: string },
    voluntarioNombre: string
  ) => void;
  agregarProducto: (nuevo: Omit<Product, 'id'>) => void;
  agregarParticipante: (nombre: string) => Promise<void>; // nueva función
}

// Creo el contexto de datos, empezando vacío
const DataContext = createContext<DataContextValue | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Mis estados principales: rol del usuario, entregas, productos y participantes
  const [rol, setRol] = useState<UserRole | null>(null);
  const [entregas, setEntregas] = useState<Delivery[]>(entregasSeed);
  const [productos, setProductos] = useState<Product[]>(productosSeed);
  const [participantes, setParticipantes] = useState<Participant[]>([]);

  // Este useEffect me mantiene sincronizados los participantes desde Firestore
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'participants'), snapshot => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Participant[];
      setParticipantes(data);
    });

    // Cleanup para no dejar listeners colgados
    return () => unsub();
  }, []);

  // Función para agregar un participante nuevo a Firestore
  const agregarParticipante = async (nombre: string) => {
    await addDoc(collection(db, 'participants'), {
      nombre,
      clave: generarClave(), // le pongo una clave random
      lastLogin: null, // todavía no ha hecho login
    });
  };

  // Cambio el estado de una entrega a "activo"
  const iniciarEntrega = (id: string) => {
    setEntregas(prev => prev.map(e => (e.id === id ? { ...e, estado: 'activo' } : e)));
  };

  // Cambio el estado de una entrega a "pasado"
  const finalizarEntrega = (id: string) => {
    setEntregas(prev => prev.map(e => (e.id === id ? { ...e, estado: 'pasado' } : e)));
  };

  // Agrego una entrega nueva con un id generado
  const agregarEntrega = (nueva: Omit<Delivery, 'id'>) => {
    const id = `ent-${Math.random().toString(36).slice(2, 7)}`;
    setEntregas(prev => [{ id, registros: [], ...nueva }, ...prev]);
  };

  // Logout, simplemente reseteo el rol
  const logout = () => {
    setRol(null);
  };

  // Registro un producto entregado en una entrega específica
  const registrarProducto = (
    entregaId: string,
    producto: { id: string; nombre: string },
    voluntarioNombre: string
  ) => {
    const record: DeliveryRecord = {
      id: `reg-${Math.random().toString(36).slice(2, 7)}`, // id random para el registro
      productoId: producto.id,
      productoNombre: producto.nombre,
      voluntarioNombre,
      fechaHora: '2025-09-17 10:00', // hardcodeado por ahora
    };

    // Actualizo la entrega con el nuevo registro
    setEntregas(prev =>
      prev.map(e =>
        e.id === entregaId
          ? { ...e, registros: [...(e.registros || []), record] }
          : e
      )
    );
  };

  // Agrego un producto nuevo a la lista
  const agregarProducto = (nuevo: Omit<Product, 'id'>) => {
    const id = `prod-${Math.random().toString(36).slice(2, 7)}`;
    setProductos(prev => [{ id, ...nuevo }, ...prev]);
  };

  // Memoizo todo el valor del contexto para que no se re-renderice sin necesidad
  const value = useMemo(
    () => ({
      rol,
      setRol,
      entregas,
      setEntregas,
      productos,
      participantes,
      setParticipantes,
      iniciarEntrega,
      finalizarEntrega,
      agregarEntrega,
      logout,
      registrarProducto,
      agregarProducto,
      agregarParticipante, 
    }),
    [rol, entregas, productos, participantes]
  );

  // Y regreso mi provider con todos los datos
  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

// Hook para usar el contexto fácilmente en cualquier componente
export const useData = () => {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData debe usarse dentro de DataProvider');
  return ctx;
};
