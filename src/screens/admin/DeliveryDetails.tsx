import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useData } from '../../context/DataContext';
import { theme, commonStyles } from '../../styles/theme';

// Componente que muestra detalles de una entrega
const DeliveryDetails: React.FC = () => {
  const route = useRoute<any>();
  const { id } = route.params || {};
  const { entregas, participantes } = useData();

  // Buscar la entrega por ID
  const entrega = entregas.find(e => e.id === id);

  if (!entrega)
    return (
      <View style={styles.container}>
        <Text>No encontrada</Text>
      </View>
    );

  // Participantes de esta entrega
  const participantesData = participantes.filter(p =>
    entrega.participantes?.includes(p.id)
  );

  // Productos asignados a esta entrega
  const productosEntrega = entrega.productos || [];

  return (
    <View style={styles.container}>
      {/* === Información general === */}
      <Text style={styles.titulo}>{entrega.titulo}</Text>
      <Text style={styles.detalle}>
        {entrega.fecha} · {entrega.ubicacion} · Camión {entrega.camion}
      </Text>

      {/* === Participantes === */}
      <Text style={styles.seccion}>Participantes</Text>
      <FlatList
        data={participantesData}
        keyExtractor={i => i.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.itemTxt}>{item.nombre}</Text>
          </View>
        )}
        contentContainerStyle={{ gap: 8 }}
      />

      {/* === Productos de la entrega === */}
      <Text style={[styles.seccion, { marginTop: 20 }]}>Productos asignados</Text>

      <FlatList
        data={productosEntrega}
        keyExtractor={i => i.id}
        renderItem={({ item }) => (
          <View
            style={[
              styles.item,
              item.estado === 'entregado' && { backgroundColor: '#c8e6c9' },
            ]}
          >
            <Text style={styles.itemTxt}>{item.nombre}</Text>
            <Text style={styles.detalle}>
              Estado: {item.estado === 'entregado' ? '✅ Entregado' : '⏳ No entregado'}
            </Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.detalle}>No hay productos asignados a esta entrega.</Text>
        }
        contentContainerStyle={{ gap: 8 }}
      />

      {/* === Registros de entrega (historial) === */}
      <Text style={[styles.seccion, { marginTop: 20 }]}>
        Registros de productos
      </Text>
      <FlatList
        data={entrega.registros || []}
        keyExtractor={i => i.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.itemTxt}>{item.productoNombre}</Text>
            <Text style={styles.detalle}>
              Por {item.voluntarioNombre} · {item.fechaHora}
            </Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.detalle}>Sin registros aún.</Text>
        }
        contentContainerStyle={{ gap: 8 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.lg,
  },
  titulo: {
    ...theme.typography.h2,
    marginBottom: theme.spacing.xs,
    color: theme.colors.text,
  },
  detalle: {
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.lg,
    ...theme.typography.body,
  },
  seccion: {
    ...theme.typography.h4,
    marginBottom: theme.spacing.sm,
    color: theme.colors.text,
  },
  item: {
    ...commonStyles.card,
    marginBottom: theme.spacing.sm,
  },
  itemTxt: {
    ...theme.typography.bodyBold,
    color: theme.colors.text,
  },
});

export default DeliveryDetails;
