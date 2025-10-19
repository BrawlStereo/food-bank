import React, { useEffect, useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useData } from '../../context/DataContext';
import { Product } from '../../types';
import { theme, commonStyles } from '../../styles/theme';

const AddProductToDeliveries: React.FC = () => {
  const { productos } = useData(); // Productos de la base de datos
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { seleccionados = [], onDone } = route.params || {};

  const [seleccion, setSeleccion] = useState<Product[]>(seleccionados);

  // Lista de categorías únicas seleccionadas
  const categoriasSeleccionadas = useMemo(
    () => Array.from(new Set(seleccion.map(p => (p as any).categoria).filter(Boolean))) as string[],
    [seleccion]
  );

  // Mostrar en el header cuántos productos se han seleccionado (solo el contador)
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ marginRight: 12 }}>
          <Text style={{ fontWeight: '700', textAlign: 'right' }}>{seleccion.length}</Text>
        </View>
      ),
    });
  }, [navigation, seleccion]);

  const toggleProducto = (producto: Product) => {
    setSeleccion(prev =>
      prev.find(p => p.id === producto.id)
        ? prev.filter(p => p.id !== producto.id)
        : [...prev, producto]
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={productos}
        keyExtractor={item => item.id}
        contentContainerStyle={{ gap: 8, paddingVertical: 8 }}
        renderItem={({ item }) => {
          const activo = seleccion.some(p => p.id === item.id);
          return (
            <Pressable
              style={[styles.item, activo && styles.itemActivo]}
              onPress={() => toggleProducto(item)}
            >
              <Text style={[styles.itemTxt, activo && styles.itemTxtActivo]}>
                {item.nombre}
                {item.categoria ? `  ·  ${item.categoria}` : ''}
              </Text>
            </Pressable>
          );
        }}
      />
      <Pressable
        style={styles.primario}
        onPress={() => {
          if (onDone) onDone(seleccion);
          navigation.goBack();
        }}
      >
        <Text style={styles.primarioTxt}>Confirmar selección ({seleccion.length})</Text>
      </Pressable>

      {/* Lista scrollable de categorías seleccionadas */}
      {categoriasSeleccionadas.length > 0 && (
        <View style={styles.categoriasWrap}>
          <Text style={styles.categoriasTitle}>Categorías seleccionadas</Text>
          <FlatList
            data={categoriasSeleccionadas}
            keyExtractor={(c) => c}
            renderItem={({ item }) => (
              <View style={styles.categoriaItem}>
                <Text style={styles.categoriaText}>{item}</Text>
              </View>
            )}
            style={{ maxHeight: 160 }}
            contentContainerStyle={{ gap: 8 }}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: theme.colors.background, 
    padding: theme.spacing.lg 
  },
  item: { 
    ...commonStyles.card,
    padding: theme.spacing.md + 2,
  },
  itemActivo: { 
    backgroundColor: theme.colors.primaryLight 
  },
  itemTxt: { 
    ...theme.typography.bodyBold,
    color: theme.colors.text,
  },
  itemTxtActivo: { 
    color: theme.colors.primary 
  },
  primario: { 
    ...commonStyles.buttonPrimary, 
    paddingVertical: theme.spacing.md + 2, 
    marginTop: theme.spacing.sm 
  },
  primarioTxt: { 
    ...commonStyles.buttonText,
  },
  categoriasWrap: {
    marginTop: theme.spacing.md,
  },
  categoriasTitle: {
    ...theme.typography.bodyBold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  categoriaItem: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#eee',
  },
  categoriaText: {
    ...theme.typography.body,
    color: theme.colors.text,
  },
});

export default AddProductToDeliveries;
