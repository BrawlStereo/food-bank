import React, { useMemo, useState, useRef } from 'react';
import { FlatList, Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useData } from '../../context/DataContext';
import { useRoute, useNavigation } from '@react-navigation/native';
import { theme } from '../../styles/theme';
import { MaterialIcons } from '@expo/vector-icons';

const ProductSearch: React.FC = () => {
  const { entregas, registrarProducto, registrarEntregaProducto, participantes, claveUsuario } = useData();
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const entregaId = route.params?.entregaId as string;

  // Obtén la entrega actual
  const entrega = useMemo(() => entregas.find(e => e.id === entregaId), [entregas, entregaId]);

  // Estados locales
  const [query, setQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'id'>('name');
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [snackbar, setSnackbar] = useState<{ visible: boolean; text: string }>({ visible: false, text: '' });
  const snackbarTimeout = useRef<NodeJS.Timeout | null>(null);

  // Filtrado y orden de productos (solo los de la entrega)
  const resultados = useMemo(() => {
    if (!entrega) return [];
    let filtered = entrega.productos || [];

    if (query.trim()) {
      const q = query.trim().toLowerCase();
      filtered = filtered.filter(p => p.nombre.toLowerCase().includes(q));
    }

    if (sortBy === 'name') {
      filtered = [...filtered].sort((a, b) => a.nombre.localeCompare(b.nombre, 'es', { sensitivity: 'base' }));
    } else {
      filtered = [...filtered].sort((a, b) => b.id.localeCompare(a.id));
    }

    return filtered;
  }, [entrega, query, sortBy]);

  // Registrar entrega de producto
  const registrar = async (productoId: string, productoNombre: string) => {
    if (!entrega) return;

    try {
      // Deriva nombre y clave del voluntario desde el contexto
      const clave = claveUsuario || undefined;
      const participante = participantes.find(p => p.clave === clave);
      const nombreVoluntario = participante?.nombre || 'Voluntario Demo';

      // Actualiza Firestore incluyendo la clave del voluntario
      await registrarProducto(entregaId, productoId, nombreVoluntario, clave);
      // Actualiza estado local global (incluye clave también)
      registrarEntregaProducto(entregaId, productoId, nombreVoluntario, clave);

      // Muestra snackbar
      setSnackbar({ visible: true, text: `Producto "${productoNombre}" entregado.` });
      if (snackbarTimeout.current) clearTimeout(snackbarTimeout.current);
      snackbarTimeout.current = setTimeout(() => setSnackbar({ visible: false, text: '' }), 4000);
    } catch (err) {
      console.error('Error al registrar producto:', err);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <Pressable style={styles.backBtn} onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={28} color="#333" />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>{entrega?.titulo || 'ENTREGA'}</Text>
          <Text style={styles.headerSubtitle}>
            <MaterialIcons name="location-on" size={16} color="#b71c1c" /> {entrega?.ubicacion || 'Ubicación desconocida'}
          </Text>
          <Text style={styles.headerSubtitle}>
            <MaterialIcons name="event" size={16} color="#b71c1c" /> {entrega?.fecha || 'Sin fecha'}
          </Text>
        </View>
      </View>

      {/* Barra de búsqueda */}
      <View style={styles.searchRow}>
        <TextInput
          placeholder="Buscar producto"
          placeholderTextColor="#333"
          style={styles.input}
          value={query}
          onChangeText={setQuery}
        />
        <MaterialIcons name="search" size={24} color="#333" style={styles.searchIcon} />
        <Pressable style={styles.sortBtn} onPress={() => setShowSortMenu(v => !v)}>
          <MaterialIcons name="sort" size={22} color="#333" />
          <MaterialIcons name="arrow-drop-down" size={22} color="#333" />
        </Pressable>
      </View>

      {/* Menú de orden */}
      {showSortMenu && (
        <View style={styles.sortMenu}>
          <Pressable style={styles.sortMenuItem} onPress={() => { setSortBy('name'); setShowSortMenu(false); }}>
            <Text style={[styles.sortMenuText, sortBy === 'name' && styles.sortMenuTextActive]}>Alfabético</Text>
          </Pressable>
          <Pressable style={styles.sortMenuItem} onPress={() => { setSortBy('id'); setShowSortMenu(false); }}>
            <Text style={[styles.sortMenuText, sortBy === 'id' && styles.sortMenuTextActive]}>ID</Text>
          </Pressable>
        </View>
      )}

      {/* Lista de productos */}
      <FlatList
        data={resultados}
        keyExtractor={i => i.id.toString()}
        numColumns={2}
        columnWrapperStyle={{ gap: 16 }}
        contentContainerStyle={{ gap: 16, paddingBottom: 32, paddingTop: 8 }}
        renderItem={({ item }) => {
          return (
            <View style={styles.itemCard} key={item.id}>
              <Image
                style={styles.imagen}
              />
              <Text style={styles.nombre}>{item.nombre.toUpperCase()}</Text>
              <Pressable
                style={styles.entregarBtn}
                onPress={() => registrar(item.id, item.nombre)}
              >
                <Text style={styles.entregarBtnTxt}>ENTREGAR</Text>
              </Pressable>
            </View>
          );
        }}
      />

      {/* Snackbar */}
      {snackbar.visible && (
        <View style={styles.snackbar}>
          <Text style={styles.snackbarText}>{snackbar.text}</Text>
        </View>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFB97A',
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  backBtn: {
    marginRight: 10,
    marginTop: 2,
    padding: 4,
    borderRadius: 20,
    backgroundColor: '#fff3',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 2,
    marginTop: 2,
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#fff',
    marginBottom: 0,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 12,
    marginBottom: 10,
    marginTop: 6,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 2,
  },
  input: {
    flex: 1,
    height: 38,
    fontSize: 16,
    color: '#333',
  },
  searchIcon: {
    marginLeft: 4,
  },
  itemCard: {
    backgroundColor: '#FFD7A6',
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    minHeight: 150,
    padding: 10,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  imagen: {
    width: 70,
    height: 70,
    borderRadius: 12,
    backgroundColor: '#fff',
    marginBottom: 8,
    resizeMode: 'contain',
  },
  nombre: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 6,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  sortBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#fff',
    elevation: 1,
  },
  sortMenu: {
    position: 'absolute',
    right: 24,
    top: 92,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    zIndex: 10,
    minWidth: 120,
  },
  sortMenuItem: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  sortMenuText: {
    fontSize: 15,
    color: '#333',
  },
  sortMenuTextActive: {
    color: theme.colors.primary,
    fontWeight: 'bold',
  },
  snackbar: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 24,
    backgroundColor: '#222',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    elevation: 8,
    zIndex: 100,
  },
  snackbarText: {
    color: '#fff',
    fontSize: 15,
    flex: 1,
  },
  entregarBtn: {
    backgroundColor: '#1E90FF',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 4,
    marginTop: 2,
  },
  entregarBtnTxt: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 13,
    letterSpacing: 0.5,
  },
});

export default ProductSearch;
