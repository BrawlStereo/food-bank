import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, View, Pressable, TextInput, Button } from 'react-native';
import { useData } from '../../context/DataContext';
import { theme, commonStyles } from '../../styles/theme';

const AllParticipants: React.FC = () => {
  const { participantes, agregarParticipante } = useData();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [nuevoNombre, setNuevoNombre] = useState('');

  const toggleExpand = (id: string) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  const handleAgregar = async () => {
    if (!nuevoNombre.trim()) return;
    await agregarParticipante(nuevoNombre.trim());
    setNuevoNombre('');
  };

  return (
    <View style={styles.container}>
      {/* Input + botón para agregar participante */}
      <View style={styles.addContainer}>
        <TextInput
          style={styles.input}
          placeholder="Nombre del participante a agregar"
          value={nuevoNombre}
          onChangeText={setNuevoNombre}
        />
        <Button title="Agregar" onPress={handleAgregar} />
      </View>

      {/* Lista de participantes */}
      <FlatList
        data={participantes}
        keyExtractor={i => i.id}
        contentContainerStyle={{ gap: theme.spacing.sm }}
        renderItem={({ item }) => {
          const expanded = expandedId === item.id;

          return (
            <Pressable onPress={() => toggleExpand(item.id)}>
              <View style={styles.item}>
                <Text style={styles.nombre}>{item.nombre}</Text>
                <Text style={styles.clave}>{item.clave ?? '------'}</Text>
              </View>

              {expanded && (
                <View style={styles.extraInfo}>
                  {item.lastLogin ? (
                    <Text style={styles.extraText}>Último ingreso: {item.lastLogin}</Text>
                  ) : (
                    <Text style={styles.extraText}>Aún no ha iniciado sesión con su clave personal</Text>
                  )}
                </View>
              )}
            </Pressable>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: theme.colors.background, 
    padding: theme.spacing.lg 
  },
  addContainer: {
    flexDirection: 'row',
    marginBottom: theme.spacing.md,
    alignItems: 'center',
    gap: 8,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 50,
  },
  item: {
    ...commonStyles.card, 
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 14,
  },
  nombre: { 
    ...theme.typography.bodyBold, 
    color: theme.colors.text 
  },
  clave: { 
    fontWeight: 'bold', 
    color: 'orange' 
  },
  extraInfo: {
    backgroundColor: '#f8f8f8',
    padding: 12,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    marginTop: -10,
  },
  extraText: {
    color: '#555',
    fontSize: 14,
  },
});

export default AllParticipants;
