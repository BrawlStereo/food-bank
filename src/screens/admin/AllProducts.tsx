import React, { useState, useMemo } from 'react';
import { FlatList, Image, StyleSheet, Text, View, TextInput, Pressable } from 'react-native';
import { useData } from '../../context/DataContext';
import { theme, commonStyles } from '../../styles/theme';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';

const AllProducts: React.FC = () => {
  const { productos } = useData();
  const navigation = useNavigation<any>();

  const [query, setQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'id'>('name');
  const [showSortMenu, setShowSortMenu] = useState(false);

  const resultados = useMemo(() => {
    const q = query.trim().toLowerCase();
    let filtered = !q ? productos : productos.filter(p => p.nombre.toLowerCase().includes(q));
    if (sortBy === 'name') {
      filtered = [...filtered].sort((a, b) => a.nombre.localeCompare(b.nombre, 'es', { sensitivity: 'base' }));
    } else {
      filtered = [...filtered].sort((a, b) => b.id.localeCompare(a.id));
    }
    return filtered;
  }, [productos, query, sortBy]);

  return (
    <View style={styles.container}>
      {/* Header */}

      {/* Search Bar */}
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
      {showSortMenu && (
        <View style={styles.sortMenu}>
          <Pressable style={styles.sortMenuItem} onPress={() => { setSortBy('name'); setShowSortMenu(false); }}>
            <Text style={[styles.sortMenuText, sortBy === 'name' && styles.sortMenuTextActive]}>Alfabético</Text>
          </Pressable>
          <Pressable style={styles.sortMenuItem} onPress={() => { setSortBy('id'); setShowSortMenu(false); }}>
            <Text style={[styles.sortMenuText, sortBy === 'id' && styles.sortMenuTextActive]}>Fecha de creación</Text>
          </Pressable>
        </View>
      )}

      {/* Product Grid */}
      <FlatList
        data={resultados}
        keyExtractor={i => i.id}
        numColumns={2}
        columnWrapperStyle={{ gap: 16 }}
        contentContainerStyle={{ gap: 16, paddingBottom: 80, paddingTop: 8 }}
        renderItem={({ item }) => (
          <View style={styles.itemCard}>
            <Image source={{ uri: item.imagen }} style={styles.imagen} />
            <Text style={styles.nombre}>{item.nombre.toUpperCase()}</Text>
          </View>
        )}
      />

      <Pressable
        style={styles.fab}
        onPress={() => navigation.navigate('AddProduct')}
        android_ripple={{ color: theme.colors.primaryDark }}
      >
        <Text style={styles.fabText}>+ Añadir un producto</Text>
      </Pressable>
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
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 2,
    marginTop: 2,
    letterSpacing: 0.5,
    textAlign: 'center',
    flex: 1,
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
    backgroundColor: 'transparent',
    borderWidth: 0,
    paddingHorizontal: 0,
  },
  searchIcon: {
    marginLeft: 4,
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
  sortBtnText: {
    fontSize: 13,
    color: '#333',
    fontWeight: 'bold',
    marginRight: 2,
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
  itemCard: {
    backgroundColor: '#FFD7A6',
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginBottom: 0,
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
  fab: {
    position: 'absolute',
    bottom: 32,
    alignSelf: 'center',
    backgroundColor: theme.colors.primary,
    borderRadius: 32,
    width: 350,
    height: 64,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  fabText: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: -2,
  },
});

export default AllProducts;
