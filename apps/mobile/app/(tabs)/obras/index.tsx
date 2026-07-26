import { View, Text, FlatList, Pressable, StyleSheet, ActivityIndicator, SectionList } from 'react-native';
import { useRouter } from 'expo-router';
import { useObras } from '@/features/obras/obras.queries';
import { ESTADOS_OBRA, ESTADO_LABELS } from '@obrakit/shared/constants/estados';

export default function ObrasListScreen() {
  const { data: obras, isLoading, error, refetch, isRefetching } = useObras();
  const router = useRouter();

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text>No se pudieron cargar las obras.</Text>
      </View>
    );
  }

  const sections = ESTADOS_OBRA.map((estado) => ({
    title: ESTADO_LABELS[estado],
    data: (obras ?? []).filter((o) => o.estado === estado),
  }));

  return (
    <SectionList
      contentContainerStyle={{ padding: 16 }}
      sections={sections}
      keyExtractor={(item) => item.id}
      onRefresh={refetch}
      refreshing={isRefetching}
      renderSectionHeader={({ section }) => (
        <Text style={styles.sectionHeader}>
          {section.title} ({section.data.length})
        </Text>
      )}
      renderItem={({ item }) => (
        <Pressable style={styles.card} onPress={() => router.push(`/(tabs)/obras/${item.id}`)}>
          <Text style={styles.cardTitle}>{item.nombre}</Text>
          {item.tipo_obra ? <Text style={styles.cardSubtitle}>{item.tipo_obra}</Text> : null}
          {item.direccion ? <Text style={styles.cardSubtitle}>{item.direccion}</Text> : null}
        </Pressable>
      )}
      ListEmptyComponent={
        <View style={styles.center}>
          <Text>Aún no tienes obras registradas.</Text>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  sectionHeader: { fontSize: 16, fontWeight: '700', marginTop: 16, marginBottom: 8, color: '#333' },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#eee',
  },
  cardTitle: { fontSize: 16, fontWeight: '600' },
  cardSubtitle: { fontSize: 13, color: '#666', marginTop: 2 },
});
