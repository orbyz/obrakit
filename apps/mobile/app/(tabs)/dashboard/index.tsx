import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useDashboard } from '@/features/dashboard/dashboard.queries';
import { colors } from '@/theme/colors';

export default function DashboardScreen() {
  const { data, isLoading, error, refetch, isRefetching } = useDashboard();
  const router = useRouter();

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error || !data) {
    return (
      <View style={styles.center}>
        <Text>No se pudo cargar el dashboard.</Text>
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      onRefresh={refetch}
      refreshing={isRefetching}
    >
      <View style={styles.cardsRow}>
        <Pressable
          style={[styles.card, styles.cardHalf]}
          onPress={() => router.push('/(tabs)/obras')}
        >
          <Text style={styles.cardLabel}>Obras activas</Text>
          <Text style={styles.cardValue}>{data.obrasActivas}</Text>
        </Pressable>

        <View style={[styles.card, styles.cardHalf]}>
          <Text style={styles.cardLabel}>Materiales gastados</Text>
          <Text style={styles.cardValue}>{data.materialesTotalGastado.toFixed(0)} €</Text>
        </View>
      </View>

      <Pressable style={styles.card} onPress={() => router.push('/(tabs)/rentabilidad')}>
        <Text style={styles.cardLabel}>Rentabilidad total (obras cerradas)</Text>
        <View style={styles.rentabilidadRow}>
          <Text style={[styles.cardValue, data.margenTotalEur < 0 ? styles.negativo : styles.positivo]}>
            {data.margenTotalEur.toFixed(0)} €
          </Text>
          <Text style={[styles.cardValueSmall, data.margenTotalPct < 0 ? styles.negativo : styles.positivo]}>
            {data.margenTotalPct.toFixed(1)}%
          </Text>
        </View>
        <Text style={styles.cardHint}>
          Facturado {data.totalFacturado.toFixed(0)} € · Gastado {data.totalGastadoCerradas.toFixed(0)} €
        </Text>
      </Pressable>

      <Text style={styles.sectionTitle}>Alertas de plazo</Text>
      {data.alertas.length === 0 ? (
        <View style={styles.card}>
          <Text style={styles.cardHint}>No hay obras próximas a vencer plazo. 🎉</Text>
        </View>
      ) : (
        data.alertas.map((a) => (
          <Pressable
            key={a.id}
            style={[styles.card, styles.alertaCard]}
            onPress={() => router.push(`/(tabs)/obras/${a.id}`)}
          >
            <Text style={styles.cardLabel}>{a.nombre}</Text>
            <Text style={[styles.alertaTexto, a.diasRestantes < 0 && styles.negativo]}>
              {a.diasRestantes < 0
                ? `Vencida hace ${Math.abs(a.diasRestantes)} día(s)`
                : a.diasRestantes === 0
                  ? 'Vence hoy'
                  : `Vence en ${a.diasRestantes} día(s)`}
            </Text>
          </Pressable>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, paddingBottom: 40, gap: 12 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  cardsRow: { flexDirection: 'row', gap: 12 },
  cardHalf: { flex: 1 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardLabel: { fontSize: 13, color: colors.textMuted, marginBottom: 6 },
  cardValue: { fontSize: 26, fontWeight: '700', color: colors.text },
  cardValueSmall: { fontSize: 16, fontWeight: '700' },
  cardHint: { fontSize: 12, color: colors.textMuted, marginTop: 6 },
  rentabilidadRow: { flexDirection: 'row', alignItems: 'baseline', gap: 10 },
  positivo: { color: colors.success },
  negativo: { color: colors.danger },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginTop: 8, marginBottom: -4 },
  alertaCard: { borderColor: '#f5c542' },
  alertaTexto: { fontSize: 14, fontWeight: '600', color: '#b45309', marginTop: 2 },
});
