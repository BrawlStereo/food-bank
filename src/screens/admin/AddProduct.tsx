import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useData } from '../../context/DataContext';
import { theme } from '../../styles/theme';

const AddProductScreen: React.FC = ({ navigation }: any) => {
  const { agregarProducto } = useData();
  const [nombre, setNombre] = useState('');
  const [imagen, setImagen] = useState('');
  const [busy, setBusy] = useState(false);

  const onSave = async () => {
  if (!nombre.trim()) {
    Alert.alert('Validación', 'El nombre es obligatorio');
    return;
  }

  setBusy(true);
  await agregarProducto({
    nombre: nombre.trim(),
    imagen: imagen.trim() || 'https://via.placeholder.com/64',
  });
  setBusy(false);
  navigation.goBack();
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
      <View style={{ marginTop: 24 }}>
        <Button title={busy ? 'Guardando...' : 'Guardar'} onPress={onSave} disabled={busy} />
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