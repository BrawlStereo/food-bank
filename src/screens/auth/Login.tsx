import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TextInput, Pressable, ToastAndroid, Alert, ImageBackground } from 'react-native';
import { useData } from '../../context/DataContext';
import { UserRole } from '../../types';

const ADMIN_KEY = 'ADMIN123'; // clave por defecto para Admin
const VOLUNTARIO_KEY = 'ABC123'; // clave genérica para voluntario (ver todas las entregas)

export default function App() {
  const { setRol, participantes, setParticipantes, setClaveUsuario, setCurrentUserNombre, setCurrentUserClave, setCurrentUserId } = useData();
  const [clave, setClave] = useState('');
  const [rolLocal, setRolLocal] = useState<UserRole>('voluntario');

  const onLogin = () => {
    const typed = clave.trim().toUpperCase();

    // ADMIN con clave específica
    if (rolLocal === 'admin') {
      if (typed === ADMIN_KEY) {
        setRol('admin');
        setClaveUsuario(typed);
        setCurrentUserNombre('Administrador');
        setCurrentUserClave(typed);
        setCurrentUserId('admin');
        ToastAndroid.show('Bienvenido Administrador', ToastAndroid.LONG);
      } else {
        Alert.alert('Acceso denegado', 'Clave incorrecta para administrador.');
      }
      return;
    }

    // VOLUNTARIO: genérica o individual
    if (rolLocal === 'voluntario') {
      if (typed === VOLUNTARIO_KEY) {
        setRol('voluntario');
        setClaveUsuario(VOLUNTARIO_KEY); // especial para ver todas las entregas
        setCurrentUserNombre('Voluntario');
        setCurrentUserClave(VOLUNTARIO_KEY);
        setCurrentUserId('generic');
        ToastAndroid.show('Bienvenido Voluntario', ToastAndroid.LONG);
        return;
      }

      if (typed.length !== 6) {
        Alert.alert('Error', 'La clave debe tener 6 caracteres.');
        return;
      }

      const participante = participantes.find(p => p.clave === typed);
      if (!participante) {
        Alert.alert('Acceso denegado', 'Clave incorrecta.');
        return;
      }

      // Actualizar lastLogin localmente
      const ahora = new Date().toLocaleString();
      setParticipantes(prev =>
        prev.map(p => p.id === participante.id ? { ...p, lastLogin: ahora } : p)
      );

  setRol('voluntario');
  setClaveUsuario(participante.id); // guarda el ID real del voluntario
  setCurrentUserNombre(participante.nombre);
  setCurrentUserClave(participante.clave ?? '');
  setCurrentUserId(participante.id);
      ToastAndroid.show(`Bienvenido ${participante.nombre}`, ToastAndroid.LONG);
    }
  };

  return (
    <ImageBackground source={require('../../../assets/background.png')} style={styles.container} imageStyle={styles.bgImage}>
      <View style={styles.headerLogoWrap} pointerEvents="none">
        <View style={styles.logoBackdrop}>
          <Image source={require('../../../assets/BAMX.png')} style={styles.logoImage} />
        </View>
      </View>

      <View style={styles.loginCard}>
        <Text style={styles.formText}>Inicie sesión</Text>

        <View style={styles.sliderContainer}>
          <Pressable style={[styles.sliderBtn, rolLocal === 'voluntario' && styles.sliderBtnActivo]} onPress={() => { setRolLocal('voluntario'); setClave(''); }}>
            <Text style={[styles.sliderTexto, rolLocal === 'voluntario' && styles.sliderTextoActivo]}>Voluntario</Text>
          </Pressable>
          <Pressable style={[styles.sliderBtn, rolLocal === 'admin' && styles.sliderBtnActivo]} onPress={() => { setRolLocal('admin'); setClave(''); }}>
            <Text style={[styles.sliderTexto, rolLocal === 'admin' && styles.sliderTextoActivo]}>Administrador</Text>
          </Pressable>
        </View>

        <TextInput
          key={rolLocal}
          style={styles.formTextInput}
          placeholder={rolLocal === 'voluntario' ? 'Clave de 6 caracteres' : 'Clave de administrador'}
          value={clave}
          onChangeText={setClave}
          {...(rolLocal === 'voluntario' ? { maxLength: 6 } : {})}
          autoCapitalize="characters"
          secureTextEntry={true}
          autoCorrect={false}
          textAlign="center"
        />

        <Pressable style={styles.boton} onPress={onLogin}>
          <Text style={styles.botonTexto}>ENTRAR</Text>
        </Pressable>
      </View>

      <StatusBar style="light" />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bgImage: {
    opacity: 0.6,
  },
  headerLogoWrap: {
    position: 'absolute',
    top: '12%',
    alignItems: 'center',
  },
  logoBackdrop: {
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderRadius: 16,
    paddingVertical: 7.5,
    paddingHorizontal: 2,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
  },
  logoImage: {
    width: 250,
    height: 130,
    resizeMode: 'contain',
  },
  loginCard: {
    width: '86%',
    minHeight: 260,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 22,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
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
    color: '#000',
  },
  sliderContainer: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    marginBottom: 20,
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
