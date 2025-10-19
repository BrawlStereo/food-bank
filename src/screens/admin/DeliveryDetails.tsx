import React, { useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, View, Pressable, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
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

  // Mapa de conteos por producto según registros
  const conteos: Record<string, number> = useMemo(() => {
    const map: Record<string, number> = {};
    (entrega.registros || []).forEach(r => {
      map[r.productoId] = (map[r.productoId] || 0) + 1;
    });
    return map;
  }, [entrega.registros]);

  // Agrupar productos por categoría
  // Nota: los productos en una entrega solo tienen id/nombre/estado; usamos productos del catálogo para leer categoria
  const { productos } = useData();
  const productosPorId = useMemo(() => Object.fromEntries(productos.map(p => [p.id, p])), [productos]);
  const grupos = useMemo(() => {
    const map: Record<string, { categoria: string; items: { id: string; nombre: string }[] }> = {};
    for (const p of productosEntrega) {
      const cat = (productosPorId[p.id]?.categoria as string) || 'Sin categoría';
      if (!map[cat]) map[cat] = { categoria: cat, items: [] };
      map[cat].items.push({ id: p.id, nombre: p.nombre });
    }
    return Object.values(map).sort((a, b) => a.categoria.localeCompare(b.categoria, 'es', { sensitivity: 'base' }));
  }, [productosEntrega, productosPorId]);

  const [expandedCats, setExpandedCats] = useState<Record<string, boolean>>({});
  const toggleCat = (c: string) => setExpandedCats(prev => ({ ...prev, [c]: !prev[c] }));

  return (
  <View style={styles.container}>
      {/* === Información general === */}
      <Text style={styles.titulo}>{entrega.titulo}</Text>
      <Text style={styles.detalle}>
        {entrega.fecha} · {entrega.ubicacion} · Camión {entrega.camion}
      </Text>

      <View style={styles.sectionsContainer}>
        {/* === Participantes === */}
        <View style={styles.participantesSection}>
          <Text style={styles.seccion}>Participantes</Text>
          <FlatList
            data={participantesData}
            keyExtractor={i => i.id}
            renderItem={({ item }) => (
              <View style={styles.item}>
                <Text style={styles.itemTxt}>{item.nombre}</Text>
              </View>
            )}
            contentContainerStyle={{ gap: 8, paddingBottom: 4 }}
          />
        </View>

        {/* === Categorías y productos (agrupado) === */}
        <View style={styles.categoriesSection}>
          <Text style={styles.seccion}>Categorías</Text>
          {grupos.length === 0 ? (
            <Text style={styles.detalle}>No hay productos asignados a esta entrega.</Text>
          ) : (
            <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 4 }}>
              {grupos.map(grupo => {
                const expanded = !!expandedCats[grupo.categoria];
                return (
                  <View key={grupo.categoria} style={styles.categoryCard}>
                    <Pressable style={styles.categoryHeader} onPress={() => toggleCat(grupo.categoria)}>
                      <Text style={styles.categoryTitle}>{grupo.categoria}</Text>
                      <View style={styles.categoryHeaderRight}>
                        <Text style={styles.categoryCount}>{grupo.items.length} productos</Text>
                        <MaterialIcons
                          name="chevron-right"
                          size={22}
                          color={theme.colors.text}
                          style={[styles.chevron, expanded && { transform: [{ rotate: '90deg' }] }]}
                        />
                      </View>
                    </Pressable>
                    {expanded && (
                      <View style={styles.categoryItems}>
                        {grupo.items.map(it => (
                          <View key={it.id} style={styles.item}>
                            <Text style={styles.itemTxt}>{it.nombre}</Text>
                            <Text style={styles.detalle}>Entregado: {conteos[it.id] || 0} veces</Text>
                          </View>
                        ))}
                      </View>
                    )}
                  </View>
                );
              })}
            </ScrollView>
          )}
        </View>

        {/* === Registros de entrega (historial) === */}
        <View style={styles.registrosSection}>
          <Text style={styles.seccion}>Registros de productos</Text>
          <FlatList
            data={entrega.registros || []}
            keyExtractor={i => i.id}
            renderItem={({ item }) => (
              <View style={styles.item}>
                <Text style={styles.itemTxt}>{item.productoNombre}</Text>
                <Text style={styles.detalle}>
                  Por {item.nombre || item.voluntarioNombre}
                  {item.clave ? ` (${item.clave})` : ''} · {item.fechaHora}
                </Text>
              </View>
            )}
            ListEmptyComponent={<Text style={styles.detalle}>Sin registros aún.</Text>}
            contentContainerStyle={{ gap: 8, paddingBottom: 4 }}
          />
        </View>
      </View>
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
  categoryCard: {
    ...commonStyles.card,
    marginBottom: theme.spacing.sm,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  categoryHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  categoryTitle: {
    ...theme.typography.bodyBold,
    color: theme.colors.text,
  },
  categoryCount: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
  },
  categoryItems: {
    marginTop: theme.spacing.sm,
  },
  sectionsContainer: {
    flex: 1,
  },
  chevron: {
    marginLeft: 6,
  },
  participantesSection: {
    flex: 0.9,
  },
  categoriesSection: {
    flex: 1.2,
    marginTop: theme.spacing.md,
  },
  registrosSection: {
    flex: 1.3,
    marginTop: theme.spacing.md,
  },
});

export default DeliveryDetails;
