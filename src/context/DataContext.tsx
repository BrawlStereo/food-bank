import React, { createContext, useContext, useMemo, useState, useEffect } from 'react';
import { Delivery, Participant, Product, UserRole, NewDeliveryPayload, DeliveryProduct, DeliveryRecord } from '../types';
import { collection, onSnapshot, addDoc, doc, updateDoc, getDoc, deleteDoc, DocumentData } from 'firebase/firestore';
import { db } from '../fireBase/firebaseConfig';

// Generador de clave aleatoria de 6 caracteres
// Se usa cada que se crea un nuevo participante desde la pantalla AllParticipants
function generarClave(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  return Array.from({ length: 6 }, () =>
    chars.charAt(Math.floor(Math.random() * chars.length))
  ).join('');
}

// Interfaz del contexto global
// Aqui está todo lo que estará disponible en la app con useData()
interface DataContextType {

  rol: UserRole | null; // 'admin' o 'voluntario'. Usado en LoginScreen y dashboards
  setRol: React.Dispatch<React.SetStateAction<UserRole | null>>;

  entregas: Delivery[]; // Lista completa de entregas. AdminDashboard
  entregasAsignadas: Delivery[]; // Solo entregas activas asignadas al voluntario. VolunteerDashboard 
  setEntregas: React.Dispatch<React.SetStateAction<Delivery[]>>;

  productos: Product[]; // Lista de productos. AllProducts y DeliveryDetails
  participantes: Participant[]; // Lista de voluntarios. AllParticipantes y Login
  setParticipantes: React.Dispatch<React.SetStateAction<Participant[]>>;
  
  iniciarEntrega: (id: string) => Promise<void>; // Cambia estado de entrega a 'activo'. AdminDashboard
  finalizarEntrega: (id: string) => Promise<void>; // Cambia estado de entrega a 'pasado'. AdminDashboard

  agregarEntrega: (nueva: NewDeliveryPayload) => Promise<void>; // Crear nueva entrega. AdminDashboard

  logout: () => void; // Cierra sesión. LoginScreen y dashboards

  registrarProducto: (entregaId: string, productoId: string, voluntarioNombre: string, voluntarioClave?: string) => Promise<void>; // Marca producto 'entregado' en Firebase. DeliveryDetails
  
  agregarProducto: (nuevo: Omit<Product, 'id'>) => Promise<void>; // Agregar nuevo producto. AllProducts (nuevo incluye categoria opcional)
  actualizarProducto: (id: string, updates: Partial<Omit<Product, 'id'>>) => Promise<void>;
  eliminarProducto: (id: string) => Promise<void>;

  agregarParticipante: (nombre: string) => Promise<void>; // Crear nuevo voluntario. AllProducts
  actualizarParticipante: (id: string, updates: Partial<Pick<Participant, 'nombre' | 'lastLogin'>>) => Promise<void>;
  eliminarParticipante: (id: string) => Promise<void>;
  
  registrarEntregaProducto: (entregaId: string, productoId: string, voluntarioNombre: string, voluntarioClave?: string) => void; // Marca producto entregado localmente. VolunteerDashboard

  claveUsuario: string | null; // Clave del voluntario o admin. Login y VolunteerDashboard
  setClaveUsuario: React.Dispatch<React.SetStateAction<string | null>>;

  // Datos del usuario actual en sesión
  currentUserNombre: string | null;
  setCurrentUserNombre: React.Dispatch<React.SetStateAction<string | null>>;
  currentUserClave: string | null;
  setCurrentUserClave: React.Dispatch<React.SetStateAction<string | null>>;
  currentUserId: string | null;
  setCurrentUserId: React.Dispatch<React.SetStateAction<string | null>>;
}

// Crea el contexto
const DataContext = createContext<DataContextType | null>(null);

// Proveedor del contexto global
export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Estados globales

  // Aqui basicamente son arreglos que guardan los datos especificos y la funcion de la derecha permite modificar esos datos
  const [rol, setRol] = useState<UserRole | null>(null); //setRol es la función que permite cambiar el rol.
  const [entregas, setEntregas] = useState<Delivery[]>([]);
  const [productos, setProductos] = useState<Product[]>([]); 
  const [participantes, setParticipantes] = useState<Participant[]>([]);
  const [claveUsuario, setClaveUsuario] = useState<string | null>(null);
  const [currentUserNombre, setCurrentUserNombre] = useState<string | null>(null);
  const [currentUserClave, setCurrentUserClave] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // Listeners en tiempo real desde Firebase
  // Se actualizan automáticamente cuando cambia la colección
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'participants'), (snap) => {
      // Actualiza la lista de participantes
      setParticipantes(snap.docs.map(d => ({ id: d.id, ...d.data() } as Participant)));
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'products'), (snap) => {
      // Actualiza la lista de productos
      setProductos(snap.docs.map(d => ({ id: d.id, ...d.data() } as Product))); //recorre todos los documentos de la colección y los convierte en objetos Participant, agregando el id del documento.
    });
    return () => unsub(); // limpia la suscripción de la firebase cuando el componente se desmonta.
  }, []);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'deliveries'), (snap) => {
      // Actualiza la lista de entregas
      setEntregas(snap.docs.map(d => ({ id: d.id, ...(d.data() as DocumentData) } as Delivery)));
    });
    return () => unsub();
  }, []);

  // Función para marcar un producto como entregado localmente
  // Se usa en VolunteerDashboard para mostrar cambios inmediatos sin recargar Firebase
  const marcarProductoEntregado = (entregaId: string, productoId: string, voluntarioNombre: string, voluntarioClave?: string) => {
    setEntregas(prev =>
      prev.map(ent => {
        if (ent.id !== entregaId) return ent;

        const productosActualizados: DeliveryProduct[] =
          ent.productos?.map(p => p.id === productoId ? { ...p, estado: 'entregado' } : p) || [];

        const nuevoRegistro: DeliveryRecord = {
          id: Date.now().toString(),
          productoId,
          productoNombre: productosActualizados.find(p => p.id === productoId)?.nombre || '',
          voluntarioNombre,
          voluntarioClave: voluntarioClave,
          nombre: currentUserNombre || voluntarioNombre,
          clave: currentUserClave || voluntarioClave,
          fechaHora: new Date().toLocaleString(),
        };

        return { ...ent, productos: productosActualizados, registros: [...(ent.registros || []), nuevoRegistro] };
      })
    );
  };

  // Alias para registrar localmente productos entregados
  const registrarEntregaProducto = marcarProductoEntregado;

  
  // Funciones para manipular Firebase

  // Agregar nueva entrega
  // AdminDashboard
  const agregarEntrega = async (nueva: NewDeliveryPayload) => {
    await addDoc(collection(db, 'deliveries'), {
      ...nueva,
      creadoEn: nueva.creadoEn || new Date().toISOString(),
    });
  };

  // Cambiar estado de entrega a activo
  // AdminDashboard
  const iniciarEntrega = async (id: string) => await updateDoc(doc(db, 'deliveries', id), { estado: 'activo' });

  // Cambiar estado de entrega a pasado
  // AdminDashboard
  const finalizarEntrega = async (id: string) => await updateDoc(doc(db, 'deliveries', id), { estado: 'pasado' });

  // Crear nuevo participante con clave aleatoria
  // TodosParticipantes
  const agregarParticipante = async (nombre: string) => {
    await addDoc(collection(db, 'participants'), { nombre, clave: generarClave(), lastLogin: null });
  };

  const actualizarParticipante = async (id: string, updates: Partial<Pick<Participant, 'nombre' | 'lastLogin'>>) => {
    await updateDoc(doc(db, 'participants', id), { ...updates });
  };

  const eliminarParticipante = async (id: string) => {
    await deleteDoc(doc(db, 'participants', id));
  };

  // Registrar un producto como entregado en Firebase
  // DeliveryDetails
  const registrarProducto = async (entregaId: string, productoId: string, voluntarioNombre: string, voluntarioClave?: string) => {
    try {
      const ref = doc(db, 'deliveries', entregaId);
      const snap = await getDoc(ref);
      if (!snap.exists()) return;

      const data = snap.data() as Delivery;
      const productosActualizados = data.productos?.map(p => p.id === productoId ? { ...p, estado: 'entregado' } : p) || [];
      const nuevosRegistros = [...(data.registros || []), {
        id: `${Date.now()}-${Math.random().toString(36).slice(2,5)}`,
        productoId,
        productoNombre: data.productos?.find(p => p.id === productoId)?.nombre || 'Desconocido',
        voluntarioNombre,
        voluntarioClave: voluntarioClave,
        nombre: currentUserNombre || voluntarioNombre,
        clave: currentUserClave || voluntarioClave,
        fechaHora: new Date().toISOString(),
      }];
      await updateDoc(ref, { productos: productosActualizados, registros: nuevosRegistros });
    } catch (err) {
      console.error(err);
    }
  };

  // Agregar un producto nuevo
  // TodosProductos
  const agregarProducto = async (nuevo: Omit<Product, 'id'>) => {
    await addDoc(collection(db, 'products'), {
      nombre: nuevo.nombre,
      imagen: nuevo.imagen || 'https://via.placeholder.com/64',
      categoria: (nuevo as any).categoria || null,
      creadoEn: new Date().toISOString(),
    });
  };

  const actualizarProducto = async (id: string, updates: Partial<Omit<Product, 'id'>>) => {
    await updateDoc(doc(db, 'products', id), { ...updates });
  };

  const eliminarProducto = async (id: string) => {
    await deleteDoc(doc(db, 'products', id));
  };

  // Cerrar sesión, limpiar rol y clave
  // LoginScreen, AdminDashboard, VolunteerDashboard
  const logout = () => {
    setRol(null);
    setClaveUsuario(null);
    setCurrentUserNombre(null);
    setCurrentUserClave(null);
    setCurrentUserId(null);
  };

  // Filtra entregas activas asignadas al voluntario actual
  // VolunteerDashboard
  const entregasAsignadas = useMemo(() => {
    if (!claveUsuario) return [];
    if (claveUsuario === 'ABC123') return entregas.filter(e => e.estado === 'activo'); // clave genérica
    return entregas.filter(e => e.estado === 'activo' && e.participantes?.includes(claveUsuario));
  }, [entregas, claveUsuario]);

  // Valor del contexto que se comparte en toda la app
  const value = useMemo(() => ({
    rol,
    setRol,
    entregas,
    entregasAsignadas,
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
  actualizarProducto,
  eliminarProducto,
    agregarParticipante,
  actualizarParticipante,
  eliminarParticipante,
    registrarEntregaProducto,
    claveUsuario,
    setClaveUsuario,
    currentUserNombre,
    setCurrentUserNombre,
    currentUserClave,
    setCurrentUserClave,
    currentUserId,
    setCurrentUserId,
  }), [rol, entregas, productos, participantes, claveUsuario, currentUserNombre, currentUserClave, currentUserId]);

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

// Hook personalizado para usar el contexto
// Se usa en cualquier pantalla que necesite datos: AdminDashboard, VolunteerDashboard, DeliveryDetails, etc.
export const useData = (): DataContextType => {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData debe usarse dentro de un DataProvider');
  return ctx;
};
