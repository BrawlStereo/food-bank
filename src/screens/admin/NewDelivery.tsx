import React, { useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useData } from '../../context/DataContext';
import { theme, commonStyles } from '../../styles/theme';

// Componente para crear una nueva entrega
const NewDelivery: React.FC = () => {
  const navigation = useNavigation<any>(); // Hook de navegación para moverse entre pantallas
  const { agregarEntrega } = useData(); // Función para agregar una entrega al contexto

  // Estados para almacenar los valores de los inputs
  const [titulo, setTitulo] = useState('');
  const [fecha, setFecha] = useState('');
  const [camion, setCamion] = useState('');
  const [participantes, setParticipantes] = useState<string[]>([]);
  const [calle, setCalle] = useState('');
  const [colonia, setColonia] = useState('');
  const [codigoPostal, setCodigoPostal] = useState('');

// Validación de confirmación
  const puedeConfirmar = useMemo(
    () => titulo && fecha && calle && colonia && codigoPostal && camion,
    [titulo, fecha, calle, colonia, codigoPostal, camion]
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Inputs para llenar la información de la entrega */}
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
    // quitar todo lo que no sea número
    let cleaned = text.replace(/[^0-9]/g, "");

    // limitar a 8 números (DDMMYYYY)
    if (cleaned.length > 8) cleaned = cleaned.slice(0, 8);

    // agregar las barras automáticamente
    if (cleaned.length >= 5) {
      cleaned = cleaned.replace(/(\d{2})(\d{2})(\d{1,4})/, "$1/$2/$3");
    } else if (cleaned.length >= 3) {
      cleaned = cleaned.replace(/(\d{2})(\d{1,2})/, "$1/$2");
    }

    setFecha(cleaned);
  }} 
  keyboardType="numeric"
  maxLength={10} // 10 caracteres incluyendo las barras
/>

      {/* Sección ubicación */}
      <Text style={styles.ubicacionTitulo}>Ubicación</Text>

      <TextInput 
        style={styles.input} 
        placeholder="Calle" 
        value={calle} 
        onChangeText={setCalle} 
      />
      <TextInput 
        style={styles.input} 
        placeholder="Colonia" 
        value={colonia} 
        onChangeText={setColonia} 
      />
      <TextInput 
        style={styles.input} 
        placeholder="Código Postal" 
        value={codigoPostal} 
        onChangeText={(text) => {
          const numericText = text.replace(/[^0-9]/g, "");
          setCodigoPostal(numericText);
        }} 
        keyboardType="numeric"
        maxLength={5}
      />
      <Text style={styles.ubicacionTitulo}>Camión</Text>
      <TextInput 
        style={styles.input} 
        placeholder="No. Camion" 
        value={camion} 
        onChangeText={setCamion} 
      />

      {/* Botón para agregar participantes */}
      <Pressable 
        style={styles.secBtn} 
        onPress={() => 
          navigation.navigate('Participantes', { 
            seleccionados: participantes, // pasa los participantes actuales
            onDone: setParticipantes // función que actualiza la lista cuando se seleccionan
          })
        }
      >
        <Text style={styles.secBtnTxt}>
          Agregar participantes ({participantes.length})
        </Text>
      </Pressable>

      {/* Botón principal para confirmar la creación de la entrega */}
      <Pressable
        style={[styles.primario, !puedeConfirmar && { opacity: 0.5 }]} // Se atenúa si no se puede confirmar
        disabled={!puedeConfirmar} // Deshabilitado si faltan datos
        onPress={() => {
          // Se agrega la entrega al contexto
           agregarEntrega({ 
            titulo, 
            fecha, 
            ubicacion: `${calle}, ${colonia}, CP ${codigoPostal}`, 
            camion, 
            estado: 'activo', 
            participantes 
          });
          // Mensaje de éxito
          Alert.alert('Entrega creada', 'La nueva entrega ha sido registrada.');
          // Regresa a la pantalla anterior
          navigation.goBack();
        }}
      >
        <Text style={styles.primarioTxt}>Confirmar</Text>
      </Pressable>
    </ScrollView>
  );
};

// Estilos del componente
const styles = StyleSheet.create({
  container: { 
    padding: theme.spacing.lg, 
    backgroundColor: theme.colors.background 
  },
  titulo: { 
    ...theme.typography.h2, 
    marginBottom: theme.spacing.md,
    color: theme.colors.text,
  },
  input: { 
    ...commonStyles.input, 
    marginBottom: theme.spacing.md 
  },
  secBtn: { 
    ...commonStyles.buttonSecondary, 
    padding: theme.spacing.md, 
    marginBottom: theme.spacing.lg 
  },
  secBtnTxt: { 
    ...commonStyles.buttonTextSecondary,
  },
  primario: { 
    ...commonStyles.buttonPrimary, 
    paddingVertical: theme.spacing.md + 2 
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
