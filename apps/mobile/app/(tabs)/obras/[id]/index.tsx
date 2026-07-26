import { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ActivityIndicator, Pressable, Linking, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  useAddSeguimiento,
  useObra,
  useSeguimientos,
  useUpdateObraEstado,
} from '@/features/obras/obras.queries';
import { useAuth } from '@/providers/AuthProvider';
import { ESTADOS_OBRA, ESTADO_LABELS } from '@obrakit/shared/constants/estados';
import { colors } from '@/theme/colors';

export default function ObraDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { tenantId, session } = useAuth();
  const { data: obra, isLoading } = useObra(id);
  const { data: seguimientos } = useSeguimientos(id);
  const updateEstado = useUpdateObraEstado();
  const addSeguimiento = useAddSeguimiento();

  const [nuevoSeguimiento, setNuevoSeguimiento] = useState('');

  if (isLoading || !obra) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const abrirEnMaps = () => {
    if (!obra.direccion) return;
    const url = `https://maps.google.com/?q=${encodeURIComponent(obra.direccion)}`;
    Linking.openURL(url);
  };

  const handleAddSeguimiento = () => {
    if (!nuevoSeguimiento.trim()) return;
    if (!tenantId || !session?.user.id) {
      Alert.alert('Error', 'No se pudo determinar tu negocio. Vuelve a iniciar sesión.');
      return;
    }
    addSeguimiento.mutate(
      {
        lead_id: obra.id,
        tenant_id: tenantId,
        created_by: session.user.id,
        descripcion: nuevoSeguimiento.trim(),
      },
      {
        onSuccess: () => setNuevoSeguimiento(''),
        onError: (err) => {
          console.error('Error al guardar seguimiento:', err);
          Alert.alert('Error', err instanceof Error ? err.message : 'No se pudo guardar el seguimiento');
        },
      }
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>{obra.nombre}</Text>
        <Pressable onPress={() => router.push(`/(tabs)/obras/${obra.id}/editar`)}>
          <Text style={styles.editLink}>Editar</Text>
        </Pressable>
      </View>
      {obra.tipo_obra ? <Text style={styles.meta}>Tipo: {obra.tipo_obra}</Text> : null}
      {obra.telefono ? <Text style={styles.meta}>Tel: {obra.telefono}</Text> : null}
      {obra.direccion ? (
        <Pressable onPress={abrirEnMaps}>
          <Text style={[styles.meta, styles.link]}>📍 {obra.direccion}</Text>
        </Pressable>
      ) : null}

      <Text style={styles.sectionLabel}>Estado</Text>
      <View style={styles.estadoRow}>
        {ESTADOS_OBRA.map((estado) => (
          <Pressable
            key={estado}
            onPress={() => {
              if (estado === 'cerrado' && !obra.importe_cerrado) {
                Alert.alert(
                  'Falta el importe cerrado',
                  'Para calcular la rentabilidad, primero indica el importe final de la obra.',
                  [
                    { text: 'Cancelar', style: 'cancel' },
                    { text: 'Añadir importe', onPress: () => router.push(`/(tabs)/obras/${obra.id}/editar`) },
                  ]
                );
                return;
              }
              updateEstado.mutate({ id: obra.id, estado });
            }}
            style={[styles.estadoChip, obra.estado === estado && styles.estadoChipActive]}
          >
            <Text style={[styles.estadoChipText, obra.estado === estado && styles.estadoChipTextActive]}>
              {ESTADO_LABELS[estado]}
            </Text>
          </Pressable>
        ))}
      </View>

      <Pressable style={styles.primaryButton} onPress={() => router.push(`/(tabs)/obras/${obra.id}/gastos`)}>
        <Text style={styles.primaryButtonText}>Ver materiales / gastos</Text>
      </Pressable>

      <Text style={styles.sectionLabel}>Seguimientos</Text>

      <View style={styles.seguimientoForm}>
        <TextInput
          style={styles.seguimientoInput}
          placeholder="Ej. Llamada a cliente para confirmar cambio de grifería. Informa cambiarla..."
          placeholderTextColor={colors.placeholder}
          value={nuevoSeguimiento}
          onChangeText={setNuevoSeguimiento}
          multiline
        />
        <Pressable
          style={styles.seguimientoButton}
          onPress={handleAddSeguimiento}
          disabled={addSeguimiento.isPending}
        >
          <Text style={styles.seguimientoButtonText}>
            {addSeguimiento.isPending ? 'Guardando…' : 'Añadir seguimiento'}
          </Text>
        </Pressable>
      </View>

      {(seguimientos ?? []).length === 0 ? (
        <Text style={styles.meta}>Sin seguimientos todavía.</Text>
      ) : (
        (seguimientos ?? []).map((s) => (
          <View key={s.id} style={styles.seguimientoItem}>
            {s.tipo ? <Text style={styles.seguimientoTipo}>{s.tipo}</Text> : null}
            <Text>{s.descripcion}</Text>
          </View>
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  editLink: { color: '#2563eb', fontWeight: '600' },
  title: { fontSize: 22, fontWeight: '700' },
  meta: { fontSize: 14, color: '#555', marginBottom: 4 },
  link: { color: '#2563eb' },
  sectionLabel: { fontSize: 15, fontWeight: '700', marginTop: 20, marginBottom: 8 },
  estadoRow: { flexDirection: 'row', gap: 8 },
  estadoChip: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  estadoChipActive: { backgroundColor: '#111', borderColor: '#111' },
  estadoChipText: { fontSize: 13, color: '#333' },
  estadoChipTextActive: { color: '#fff' },
  primaryButton: {
    backgroundColor: '#111',
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
    marginTop: 20,
  },
  primaryButtonText: { color: '#fff', fontWeight: '600' },
  seguimientoForm: { marginBottom: 12, gap: 8 },
  seguimientoInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
    minHeight: 70,
    textAlignVertical: 'top',
  },
  seguimientoButton: {
    backgroundColor: colors.accent,
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
  },
  seguimientoButtonText: { color: '#fff', fontWeight: '600' },
  seguimientoItem: {
    backgroundColor: '#f7f7f7',
    borderRadius: 8,
    padding: 10,
    marginBottom: 6,
  },
  seguimientoTipo: {
    fontSize: 11,
    fontWeight: '700',
    color: '#888',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
});
