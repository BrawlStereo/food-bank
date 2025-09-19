import React from 'react';
import { FlatList, StyleSheet, Text, View, Pressable, Alert, Image, Dimensions  } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useData } from '../../context/DataContext';
import { theme, commonStyles } from '../../styles/theme';

const AdminDashboard: React.FC = () => {
  const { entregas, finalizarEntrega, logout } = useData();
  const navigation = useNavigation<any>();

  const actuales = entregas.filter(e => e.estado === 'activo');
  const pasadas = entregas.filter(e => e.estado === 'pasado');
  const screenHeight = Dimensions.get('window').height;

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

  const Card = ({ item }: any) => (
    <View style={styles.card}>
      <View style={{ flex: 1, paddingRight: 10, justifyContent: 'space-between' }}>
        <View>
          <Text style={styles.cardTitulo}>{item.titulo}</Text>
          <Text style={styles.cardDetalle}>{item.fecha} · {item.ubicacion}</Text>
        </View>
        {item.estado === 'activo' && (
          <Pressable
            style={[styles.primario, { marginTop: 7 }]}
            onPress={() =>
              Alert.alert(
                'Finalizar entrega',
                '¿Quieres marcar esta entrega como finalizada?',
                [
                  { text: 'Cancelar', style: 'cancel' },
                  { text: 'Finalizar', style: 'destructive', onPress: () => finalizarEntrega(item.id) }
                ]
              )
            }
          >
            <Text style={styles.primarioTxt}>Finalizar</Text>
          </Pressable>
        )}
      </View>

      <View style={{ alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <Image
          source={item.estado === 'activo' ? require('../../../assets/Camion.png') : require('../../../assets/Ready.png')}
          style={{ width: 70, height: 60, borderRadius: 8 }}
          resizeMode="cover"
        />
        <Pressable
          onPress={() => navigation.navigate('DetallesEntrega', { id: item.id })}
          style={styles.linkBtn}
        >
          <Text style={styles.linkBtnTxt}>Ver más</Text>
        </Pressable>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Top bar con título y botones centrados */}
      <View style={styles.topBar}>
        <Text style={styles.titulo}>Entregas</Text>

        {/* Botones centrados arriba */}
        <View style={styles.topBarBtns}>
          <Pressable style={styles.addBtn} onPress={() => navigation.navigate('NuevaEntrega')}>
            <Text style={styles.addBtnTxt}>Nueva Entrega</Text>
          </Pressable>
          <Pressable style={styles.addBtn} onPress={() => navigation.navigate('TodosProductos')}>
            <Text style={styles.addBtnTxt}>Productos</Text>
          </Pressable>
          <Pressable style={styles.addBtn} onPress={() => navigation.navigate('TodosParticipantes')}>
            <Text style={styles.addBtnTxt}>Participantes</Text>
          </Pressable>
        </View>

        {/* Botón Cerrar sesión debajo */}
        <Pressable style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutBtnTxt}>Cerrar sesión</Text>
        </Pressable>
      </View>

      <Text style={styles.seccionTitulo}>Actuales</Text>
      <FlatList
        data={actuales}
        keyExtractor={i => i.id}
        renderItem={({ item }) => <Card item={item} />}
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

      <Text style={[styles.seccionTitulo, { marginTop: theme.spacing.lg }]}>Entregas pasadas</Text>
      <View style={{ maxHeight: screenHeight * 0.3 }}>
        <FlatList
          data={pasadas}
          keyExtractor={i => i.id}
          renderItem={({ item }) => <Card item={item} />}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No hay entregas pasadas</Text>
          }
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background, padding: theme.spacing.lg },
  topBar: { flexDirection: 'column', alignItems: 'center', marginBottom: theme.spacing.sm },
  titulo: { ...theme.typography.h2, color: theme.colors.text, marginBottom: theme.spacing.sm },
  topBarBtns: { flexDirection: 'row', gap: theme.spacing.sm, marginBottom: theme.spacing.sm },
  addBtn: { backgroundColor: theme.colors.primary, borderRadius: theme.borderRadius.md, paddingHorizontal: theme.spacing.md, paddingVertical: theme.spacing.sm },
  addBtnTxt: { color: theme.colors.background, ...theme.typography.caption },
  logoutBtn: { backgroundColor: theme.colors.surfaceLight, borderRadius: theme.borderRadius.md, paddingHorizontal: theme.spacing.sm, paddingVertical: theme.spacing.sm },
  logoutBtnTxt: { color: theme.colors.textSecondary, fontWeight: '600', fontSize: 12 },
  seccionTitulo: { ...theme.typography.h4, marginVertical: theme.spacing.sm, color: theme.colors.text },
  list: { gap: theme.spacing.sm },
  card: { ...commonStyles.card, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: theme.spacing.sm },
  cardTitulo: { ...theme.typography.h4, color: theme.colors.text },
  cardDetalle: { color: theme.colors.textSecondary, ...theme.typography.body },
  linkBtn: { paddingHorizontal: theme.spacing.sm, paddingVertical: theme.spacing.xs },
  linkBtnTxt: { color: theme.colors.textSecondary, ...theme.typography.caption },
  primario: { backgroundColor: theme.colors.primary, borderRadius: theme.borderRadius.sm, paddingHorizontal: theme.spacing.md, paddingVertical: theme.spacing.sm },
  primarioTxt: { color: theme.colors.background, ...theme.typography.caption },
  emptyText: {
    textAlign: 'center',
    color: theme.colors.textSecondary,
    fontStyle: 'italic',
    marginVertical: theme.spacing.md,
  },
  emptyBox: {
  alignItems: 'center',
  justifyContent: 'center',
  marginVertical: theme.spacing.lg,
},
});

export default AdminDashboard;
