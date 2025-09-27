import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TextInput, Pressable, ToastAndroid, Alert } from 'react-native';
import { useData } from '../../context/DataContext';
import { UserRole } from '../../types';

const CLAVE_DEFAULT = 'ABC123'; // clave por defecto para admin y voluntario

export default function App() {
  const { setRol, participantes, setParticipantes } = useData(); // ahora también traemos setParticipantes
  const [clave, setClave] = useState('');
  const [rolLocal, setRolLocal] = useState<UserRole>('voluntario');

  const onLogin = () => {
    if (clave.trim().length !== 6) {
      Alert.alert('Error', 'La clave debe tener 6 caracteres.');
      return;
    }

    // Si se selecciona ADMIN, solo puede entrar con la clave genérica
    if (rolLocal === 'admin') {
      if (clave === CLAVE_DEFAULT) {
        setRol('admin');
        ToastAndroid.show('Bienvenido Administrador', ToastAndroid.LONG);
      } else {
        Alert.alert('Acceso denegado', 'Clave incorrecta para administrador.');
      }
      return; // salimos de la función
    }

    // Si se selecciona VOLUNTARIO, puede entrar con la genérica o su clave personal
    if (rolLocal === 'voluntario') {
      // Entrada con la clave genérica
      if (clave === CLAVE_DEFAULT) {
        setRol('voluntario');
        ToastAndroid.show('Bienvenido Voluntario', ToastAndroid.LONG);
        return;
      }

      // Buscamos participante cuya clave coincida
      const participante = participantes.find(p => p.clave === clave);

      if (!participante) {
        Alert.alert('Acceso denegado', 'Clave incorrecta.');
        return;
      }

      // Actualizas lastLogin del participante
      const ahora = new Date().toLocaleString(); // cadena con fecha y hora local
      setParticipantes(prev =>
        prev.map(p => (p.id === participante.id ? { ...p, lastLogin: ahora } : p))
      );

      // acceso con clave personalizada de participante
      setRol('voluntario');
      ToastAndroid.show(`Bienvenido ${participante.nombre}`, ToastAndroid.LONG);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../../../assets/BANCO_DE_ALIMENTOS.jpg')}
        style={styles.ImageBackground}
      />

      <View style={styles.logoContainer}>
        <Image
          source={require('../../../assets/BA_image.png')}
          style={styles.logoImage}
        />
        <Text style={styles.logoText}>Banco Alimentos</Text>
      </View>

      {/* Formulario blanco */}
      <View style={styles.form}>
        <Text style={styles.formText}>Inicie sesión</Text>

        {/* Selector de rol */}
        <View style={styles.sliderContainer}>
          <Pressable
            style={[styles.sliderBtn, rolLocal === 'voluntario' && styles.sliderBtnActivo]}
            onPress={() => setRolLocal('voluntario')}
          >
            <Text style={[styles.sliderTexto, rolLocal === 'voluntario' && styles.sliderTextoActivo]}>Voluntario</Text>
          </Pressable>
          <Pressable
            style={[styles.sliderBtn, rolLocal === 'admin' && styles.sliderBtnActivo]}
            onPress={() => setRolLocal('admin')}
          >
            <Text style={[styles.sliderTexto, rolLocal === 'admin' && styles.sliderTextoActivo]}>Administrador</Text>
          </Pressable>
        </View>

        {/* Input de clave */}
        <View style={styles.formInput}>
          <TextInput
            style={styles.formTextInput}
            placeholder="Clave de 6 caracteres"
            value={clave}
            onChangeText={setClave}
            maxLength={6}
            autoCapitalize="characters"
            secureTextEntry
            textAlign='center'
          />
        </View>

        {/* Botón ingresar */}
        <View style={{ marginTop: 20 }}>
          <Pressable style={styles.boton} onPress={onLogin}>
            <Text style={styles.botonTexto}>ENTRAR</Text>
          </Pressable>
        </View>
      </View>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ImageBackground: {
    width: '100%',
    height: '100%',
    opacity: 0.6,
  },
  logoContainer: {
    position: 'absolute',
    alignSelf: 'center',
    top: '15%',
    alignItems: 'center',
  },
  logoImage: {
    width: 200,
    height: 210,
  },
  logoText: {
    color: 'white',
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  form: {
    width: '100%',
    height: '40%',
    backgroundColor: 'white',
    position: 'absolute',
    bottom: 0,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    padding: 30,
  },
  formText: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 20,
    justifyContent: 'center'
  },
  formInput: {
    flexDirection: 'row',
    marginTop: 20,
  },
  formTextInput: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#EBEBEB',
    marginLeft: 5,
    paddingVertical: 5,
  },
  sliderContainer: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    marginVertical: 20,
  },
  sliderBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
  },
  sliderBtnActivo: {
    backgroundColor: 'orange',
    borderRadius: 20,
  },
  sliderTexto: {
    fontSize: 14,
    color: '#555',
  },
  sliderTextoActivo: {
    color: 'white',
    fontWeight: 'bold',
  },
  boton: {
    backgroundColor: 'orange',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  botonTexto: {
    color: 'white',
    fontWeight: 'bold',
  },
});
