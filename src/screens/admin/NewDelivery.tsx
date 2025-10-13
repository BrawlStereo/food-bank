import React, { useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useData } from '../../context/DataContext';
import { Product } from '../../types';
import { theme, commonStyles } from '../../styles/theme';
import { NewDeliveryPayload } from '../../types';

const NewDelivery: React.FC = () => {
  const navigation = useNavigation<any>();
  const { agregarEntrega } = useData(); 

  // === Estados del formulario ===
  const [titulo, setTitulo] = useState('');
  const [fecha, setFecha] = useState('');
  const [camion, setCamion] = useState('');
  const [calle, setCalle] = useState('');
  const [colonia, setColonia] = useState('');
  const [codigoPostal, setCodigoPostal] = useState('');
  const [participantes, setParticipantes] = useState<string[]>([]);
  const [productosSeleccionados, setProductosSeleccionados] = useState<Product[]>([]);

  // === Validación para habilitar el botón Confirmar ===
  const puedeConfirmar = useMemo(
    () => titulo && fecha && calle && colonia && codigoPostal && camion,
    [titulo, fecha, calle, colonia, codigoPostal, camion]
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* --- Campos de entrada --- */}
      <Text style={styles.ubicacionTitulo}>Nombre de orden</Text>
      <TextInput
        style={styles.input}
        placeholder="Título"
        value={titulo}
        onChangeText={setTitulo}
      />

      <Text style={styles.ubicacionTitulo}>Fecha de entrega</Text>
      <TextInput
        style={styles.input}
        placeholder="DD/MM/YYYY"
        value={fecha}
        onChangeText={(text) => {
          let cleaned = text.replace(/[^0-9]/g, "");
          if (cleaned.length > 8) cleaned = cleaned.slice(0, 8);
          if (cleaned.length >= 5) cleaned = cleaned.replace(/(\d{2})(\d{2})(\d{1,4})/, "$1/$2/$3");
          else if (cleaned.length >= 3) cleaned = cleaned.replace(/(\d{2})(\d{1,2})/, "$1/$2");
          setFecha(cleaned);
        }}
        keyboardType="numeric"
        maxLength={10}
      />

      <Text style={styles.ubicacionTitulo}>Ubicación</Text>
      <TextInput style={styles.input} placeholder="Calle" value={calle} onChangeText={setCalle} />
      <TextInput style={styles.input} placeholder="Colonia" value={colonia} onChangeText={setColonia} />
      <TextInput
        style={styles.input}
        placeholder="Código Postal"
        value={codigoPostal}
        onChangeText={(text) => setCodigoPostal(text.replace(/[^0-9]/g, ""))}
        keyboardType="numeric"
        maxLength={5}
      />

      <Text style={styles.ubicacionTitulo}>Camión</Text>
      <TextInput style={styles.input} placeholder="No. Camión" value={camion} onChangeText={setCamion} />

      {/* --- Botones secundarios para agregar participantes y productos --- */}
      <Pressable
        style={styles.secBtn}
        onPress={() =>
          navigation.navigate('Participantes', {
            seleccionados: participantes,
            onDone: setParticipantes
          })
        }
      >
        <Text style={styles.secBtnTxt}>Agregar participantes ({participantes.length})</Text>
      </Pressable>

      <Pressable
        style={[styles.secBtn, { backgroundColor: theme.colors.primary }]}
        onPress={() =>
          navigation.navigate('AddProductToDeliveries', {
            seleccionados: productosSeleccionados,
            onDone: setProductosSeleccionados
          })
        }
      >
        <Text style={[styles.secBtnTxt, { color: 'white' }]}>
          Agregar productos ({productosSeleccionados.length})
        </Text>
      </Pressable>

      {/* --- Botón principal Confirmar --- */}
      <Pressable
        style={[styles.primario, !puedeConfirmar && { opacity: 0.5 }]}
        disabled={!puedeConfirmar}
        onPress={async () => {
          try {
            // Estructura lista para Firestore (sin 'id', ya que Firestore la genera)
            const nuevaEntrega: NewDeliveryPayload = {
            titulo,
            fecha,
            camion,
            ubicacion: `${calle}, ${colonia}, CP ${codigoPostal}`,
            estado: 'activo',
            participantes,
            productos: productosSeleccionados.map(p => ({
              id: p.id,
              nombre: p.nombre,
              estado: 'no entregado',
            })),
            registros: [],
            creadoEn: new Date().toISOString(),
          };

          await agregarEntrega(nuevaEntrega);
            Alert.alert('Entrega creada', 'La nueva entrega ha sido registrada.');
            navigation.goBack();
          } catch (e) {
            console.error("Error al crear entrega:", e);
            Alert.alert('Error', 'No se pudo registrar la entrega.');
          }
        }}
      >
        <Text style={styles.primarioTxt}>Confirmar</Text>
      </Pressable>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.background,
  },
  input: {
    ...commonStyles.input,
    marginBottom: theme.spacing.md,
  },
  secBtn: {
    ...commonStyles.buttonSecondary,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  secBtnTxt: {
    ...commonStyles.buttonTextSecondary,
  },
  primario: {
    ...commonStyles.buttonPrimary,
    paddingVertical: theme.spacing.md + 2,
  },
  primarioTxt: {
    ...commonStyles.buttonText,
  },
  ubicacionTitulo: {
    backgroundColor: 'orange',
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
    marginBottom: theme.spacing.sm,
  },
});

export default NewDelivery;
