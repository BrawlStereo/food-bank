import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useData } from '../../context/DataContext';
import { theme, commonStyles } from '../../styles/theme';

const AllParticipants: React.FC = () => {
  const { participantes } = useData();

  return (
    <View style={styles.container}>
      <FlatList
        data={participantes}
        keyExtractor={i => i.id}
        contentContainerStyle={{ gap: theme.spacing.sm }}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.nombre}>{item.nombre}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.surfaceLight, padding: theme.spacing.lg },
  item: { ...commonStyles.card },
  nombre: { ...theme.typography.bodyBold, color: theme.colors.text },
});

export default AllParticipants;


