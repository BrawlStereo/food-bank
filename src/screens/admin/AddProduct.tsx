import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useData } from '../../context/DataContext';
import { theme } from '../../styles/theme';
import { useRoute } from '@react-navigation/native';

const AddProductScreen: React.FC = ({ navigation }: any) => {
  const { agregarProducto, actualizarProducto, eliminarProducto, productos } = useData();
  const route = useRoute<any>();
  const productId = route.params?.productId as string | undefined;
  const product = useMemo(() => productos.find(p => p.id === productId), [productos, productId]);
  const [nombre, setNombre] = useState('');
  const [imagen, setImagen] = useState('');
  const [categoria, setCategoria] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (product) {
      setNombre(product.nombre || '');
      setImagen(product.imagen || '');
      setCategoria(product.categoria || '');
    }
  }, [product]);

  const onSave = async () => {
  if (!nombre.trim()) {
    Alert.alert('Validación', 'El nombre es obligatorio');
    return;
  }
  if (!categoria.trim()) {
    Alert.alert('Validación', 'La categoría es obligatoria');
    return;
  }

  setBusy(true);
  if (productId) {
    await actualizarProducto(productId, {
      nombre: nombre.trim(),
      imagen: imagen.trim() || 'https://via.placeholder.com/64',
      categoria: categoria.trim(),
    });
  } else {
    await agregarProducto({
      nombre: nombre.trim(),
      imagen: imagen.trim() || 'https://via.placeholder.com/64',
      categoria: categoria.trim(),
    });
  }
  setBusy(false);
  navigation.goBack();
};

  const onDelete = async () => {
    if (!productId) return;
    Alert.alert(
      'Eliminar producto',
      'Esta acción no se puede deshacer. ¿Deseas eliminar este producto?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            setBusy(true);
            await eliminarProducto(productId);
            setBusy(false);
            navigation.goBack();
          },
        },
      ]
    );
  };


  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nombre del producto</Text>
      <TextInput
        value={nombre}
        onChangeText={setNombre}
        style={styles.input}
        placeholder="Ej: Lentejas"
      />
      <Text style={styles.label}>URL de imagen (opcional)</Text>
      <TextInput
        value={imagen}
        onChangeText={setImagen}
        style={styles.input}
        placeholder="https://..."
      />
      <Text style={styles.label}>Categoría</Text>
      <TextInput
        value={categoria}
        onChangeText={setCategoria}
        style={styles.input}
        placeholder="Ej: Legumbres"
      />
      <View style={{ marginTop: 24, gap: 12 }}>
        <Button title={busy ? 'Guardando...' : (productId ? 'Actualizar' : 'Guardar')} onPress={onSave} disabled={busy} />
        {productId ? (
          <Button color="#b00020" title={busy ? '...' : 'Eliminar producto'} onPress={onDelete} disabled={busy} />
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background, padding: theme.spacing.lg },
  label: { fontSize: 16, color: theme.colors.text, marginTop: 16 },
  input: { borderWidth: 1, borderColor: '#ddd', backgroundColor: '#fff', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, marginTop: 6 },
});

export default AddProductScreen;