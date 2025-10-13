import React, { useEffect, useState } from 'react';
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

  // Mostrar en el header cuántos productos se han seleccionado
  useEffect(() => {
    navigation.setOptions({ headerRight: () => (
      <Text style={{ marginRight: 12, fontWeight: '700' }}>{seleccion.length}</Text>
    )});
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
              <Text style={[styles.itemTxt, activo && styles.itemTxtActivo]}>{item.nombre}</Text>
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
});

export default AddProductToDeliveries;
