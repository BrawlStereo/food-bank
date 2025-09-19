import React from 'react';
import { FlatList, StyleSheet, Text, View, Pressable, Alert, Image, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useData } from '../../context/DataContext';
import { theme, commonStyles } from '../../styles/theme';

const VolunteerDashboard: React.FC = () => {
  const { entregas, logout } = useData();
  const navigation = useNavigation<any>();

  const activas = entregas.filter(e => e.estado === 'activo');
  const pasadas = entregas.filter(e => e.estado === 'pasado');

  const handleLogout = () => {
    Alert.alert(
      'Cerrar sesión',
      '¿Estás seguro de que quieres cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Cerrar sesión', style: 'destructive', onPress: logout },
      ]
    );
  };

  const screenHeight = Dimensions.get('window').height;

  // Tarjeta de entrega activa
  const renderItem = ({ item }: any) => (
    <Pressable
      style={styles.card}
      onPress={() => navigation.navigate('BusquedaProductos', { entregaId: item.id })}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View style={{ flex: 1, paddingRight: 10 }}>
          <Text style={styles.cardTitulo}>{item.titulo}</Text>
          <Text style={styles.cardDetalle}>{item.fecha} · {item.ubicacion}</Text>
          <Text style={styles.cardAccion}>Registrar productos</Text>
        </View>
        <Image
          source={require('../../../assets/Camion.png')}
          style={{ width: 70, height: 60, borderRadius: 8 }}
          resizeMode="cover"
        />
      </View>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.seccionTitulo}>Entregas activas</Text>
        <Pressable style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutBtnTxt}>Cerrar sesión</Text>
        </Pressable>
      </View>

      {/* Lista de entregas activas */}
      <FlatList
        data={activas}
        keyExtractor={i => i.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Image
              source={require('../../../assets/EmptyBox.png')}
              style={{ width: 80, height: 80, marginBottom: 10 }}
              resizeMode="contain"
            />
            <Text style={styles.emptyText}>No hay entregas activas</Text>
          </View>
  }
      />

      {/* Entregas pasadas con maxHeight 40% */}
      <Text style={[styles.seccionTitulo, { marginTop: theme.spacing.lg }]}>Entregas pasadas</Text>
      <View style={{ maxHeight: screenHeight * 0.4 }}>
        <FlatList
          data={pasadas}
          keyExtractor={i => i.id}
          renderItem={({ item }) => (
            <View style={[styles.card, { opacity: 0.6 }]}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View style={{ flex: 1, paddingRight: 10 }}>
                  <Text style={styles.cardTitulo}>{item.titulo}</Text>
                  <Text style={styles.cardDetalle}>{item.fecha} · {item.ubicacion}</Text>
                  <Text style={styles.cardFinalizada}>Completada</Text>
                </View>
                <Image
                  source={require('../../../assets/Ready.png')}
                  style={{ width: 70, height: 60, borderRadius: 8 }}
                  resizeMode="cover"
                />
              </View>
            </View>
          )}
          contentContainerStyle={styles.list}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: theme.spacing.lg, 
    backgroundColor: theme.colors.background 
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  seccionTitulo: { 
    ...theme.typography.h3, 
    color: theme.colors.text,
  },
  logoutBtn: {
    backgroundColor: theme.colors.surfaceLight,
    borderRadius: theme.borderRadius.sm,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
  },
  logoutBtnTxt: {
    color: theme.colors.textSecondary,
    fontWeight: '600',
    fontSize: 12,
  },
  list: { gap: theme.spacing.sm },
  card: {
    ...commonStyles.card,
    marginBottom: theme.spacing.sm,
  },
  cardTitulo: { 
    ...theme.typography.h4, 
    marginBottom: theme.spacing.xs,
    color: theme.colors.text,
  },
  cardDetalle: { 
    color: theme.colors.textSecondary, 
    marginBottom: theme.spacing.sm,
    ...theme.typography.body,
  },
  cardAccion: { 
    color: theme.colors.primary, 
    ...theme.typography.body,
  },
  cardFinalizada: {
    color: 'green',
    ...theme.typography.body,
  },
emptyBox: {
  alignItems: 'center',
  justifyContent: 'center',
  marginVertical: theme.spacing.lg,
},
emptyText: {
  textAlign: 'center',
  color: theme.colors.textSecondary,
  fontStyle: 'italic',
},

});

export default VolunteerDashboard;
