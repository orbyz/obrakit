import { View, Text, FlatList, StyleSheet, ActivityIndicator, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useRentabilidad } from '@/features/rentabilidad/rentabilidad.queries';

export default function RentabilidadScreen() {
  const { data, isLoading, error } = useRentabilidad();
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
        <Text>No se pudo cargar la rentabilidad.</Text>
      </View>
    );
  }

  return (
    <FlatList
      contentContainerStyle={{ padding: 16 }}
      data={data}
      keyExtractor={(item) => item.id}
      ListEmptyComponent={
        <View style={styles.center}>
          <Text>Aún no hay obras cerradas para analizar.</Text>
        </View>
      }
      renderItem={({ item }) => (
        <Pressable style={styles.card} onPress={() => router.push(`/(tabs)/obras/${item.id}`)}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>{item.nombre}</Text>
            <Text style={[styles.margenPct, item.margen_pct < 0 ? styles.negativo : styles.positivo]}>
              {item.margen_pct.toFixed(1)}%
            </Text>
          </View>
          {item.tipo_obra ? <Text style={styles.cardSubtitle}>{item.tipo_obra}</Text> : null}
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Facturado</Text>
            <Text>{item.importe_cerrado.toFixed(2)} €</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Gastado</Text>
            <Text>{item.gastado.toFixed(2)} €</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Margen</Text>
            <Text style={item.margen_eur < 0 ? styles.negativo : styles.positivo}>
              {item.margen_eur.toFixed(2)} €
            </Text>
          </View>
        </Pressable>
      )}
    />
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: '#eee' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { fontSize: 16, fontWeight: '700' },
  cardSubtitle: { fontSize: 13, color: '#666', marginBottom: 6 },
  margenPct: { fontSize: 15, fontWeight: '700' },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 2 },
  rowLabel: { color: '#666' },
  positivo: { color: '#16a34a' },
  negativo: { color: '#dc2626' },
});
