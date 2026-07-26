import { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, FlatList, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useAddGasto, useGastos } from '@/features/gastos/gastos.queries';
import { useAuth } from '@/providers/AuthProvider';
import { UNIDADES_GASTO, UnidadGasto } from '@obrakit/shared/constants/estados';
import { colors } from '@/theme/colors';


export default function GastosScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { tenantId } = useAuth();
  const { data: gastos, isLoading } = useGastos(id);
  const addGasto = useAddGasto();

  const [material, setMaterial] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [unidad, setUnidad] = useState<UnidadGasto | null>(null);
  const [proveedor, setProveedor] = useState('');
  const [importe, setImporte] = useState('');

  const total = (gastos ?? []).reduce((sum, g) => sum + Number(g.importe), 0);

  const handleAdd = () => {
    const importeNum = Number(importe.replace(',', '.'));
    if (!material || !importeNum || importeNum <= 0) {
      Alert.alert('Datos incompletos', 'Indica al menos el material y un importe válido');
      return;
    }
    if (!tenantId) {
      Alert.alert('Error', 'No se pudo determinar tu negocio (tenant). Vuelve a iniciar sesión.');
      return;
    }
    addGasto.mutate(
      {
        lead_id: id,
        tenant_id: tenantId,
        material,
        cantidad: cantidad ? Number(cantidad.replace(',', '.')) : null,
        unidad: unidad,
        proveedor: proveedor || null,
        importe: importeNum,
        fecha: new Date().toISOString(),
      },
      {
        onSuccess: () => {
          setMaterial('');
          setCantidad('');
          setUnidad(null);
          setProveedor('');
          setImporte('');
        },
        onError: (err) => {
          console.error('Error al guardar gasto:', err);
          Alert.alert('Error', err instanceof Error ? err.message : 'No se pudo guardar el gasto');
        },
      }
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Material (ej. Azulejos baño)"
          placeholderTextColor={colors.placeholder}
          value={material}
          onChangeText={setMaterial}
        />
        <View style={styles.row2}>
          <TextInput
            style={[styles.input, styles.flex1]}
            placeholder="Cantidad"
            placeholderTextColor={colors.placeholder}
            keyboardType="decimal-pad"
            value={cantidad}
            onChangeText={setCantidad}
          />
        </View>
        <View style={styles.unidadRow}>
          {UNIDADES_GASTO.map((u) => (
            <Pressable
              key={u}
              onPress={() => setUnidad(u)}
              style={[styles.unidadChip, unidad === u && styles.unidadChipActive]}
            >
              <Text style={[styles.unidadText, unidad === u && styles.unidadTextActive]}>{u}</Text>
            </Pressable>
          ))}
        </View>
        <TextInput
          style={styles.input}
          placeholder="Proveedor (opcional)"
          placeholderTextColor={colors.placeholder}
          value={proveedor}
          onChangeText={setProveedor}
        />
        <TextInput
          style={styles.input}
          placeholder="Importe total (€)"
          placeholderTextColor={colors.placeholder}
          keyboardType="decimal-pad"
          value={importe}
          onChangeText={setImporte}
        />
        <Pressable style={styles.addButton} onPress={handleAdd} disabled={addGasto.isPending}>
          <Text style={styles.addButtonText}>{addGasto.isPending ? 'Guardando…' : 'Añadir gasto'}</Text>
        </Pressable>
      </View>

      <Text style={styles.total}>Total gastado: {total.toFixed(2)} €</Text>

      {isLoading ? (
        <ActivityIndicator style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={gastos ?? []}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 20 }}
          renderItem={({ item }) => (
            <View style={styles.gastoItem}>
              <View style={{ flex: 1 }}>
                <Text style={styles.gastoMaterial}>{item.material}</Text>
                {item.proveedor ? <Text style={styles.gastoMeta}>{item.proveedor}</Text> : null}
                {item.cantidad ? (
                  <Text style={styles.gastoMeta}>
                    {item.cantidad} {item.unidad ?? ''}
                  </Text>
                ) : null}
              </View>
              <Text style={styles.gastoImporte}>{Number(item.importe).toFixed(2)} €</Text>
            </View>
          )}
          ListEmptyComponent={<Text style={{ color: '#666' }}>Sin gastos registrados todavía.</Text>}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  form: { gap: 8, marginBottom: 16 },
  row2: { flexDirection: 'row', gap: 8 },
  unidadRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  unidadChip: { paddingVertical: 6, paddingHorizontal: 10, borderRadius: 16, borderWidth: 1, borderColor: '#ddd' },
  unidadChipActive: { backgroundColor: '#111', borderColor: '#111' },
  unidadText: { fontSize: 12, color: '#333' },
  unidadTextActive: { color: '#fff' },
  flex1: { flex: 1 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 10, padding: 12, fontSize: 15 },
  addButton: { backgroundColor: '#2563eb', borderRadius: 10, padding: 12, alignItems: 'center', marginTop: 4 },
  addButtonText: { color: '#fff', fontWeight: '600' },
  total: { fontSize: 16, fontWeight: '700', marginBottom: 10 },
  gastoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    backgroundColor: '#f7f7f7',
    borderRadius: 8,
    padding: 12,
    marginBottom: 6,
  },
  gastoMaterial: { fontSize: 14, fontWeight: '600' },
  gastoMeta: { fontSize: 12, color: '#888' },
  gastoImporte: { fontSize: 14, fontWeight: '600' },
});
