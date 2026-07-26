import { useEffect, useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, ScrollView, Keyboard } from 'react-native';
import { colors } from '@/theme/colors';
import { TIPOS_OBRA, TipoObra } from '@obrakit/shared/constants/estados';
import type { ObraFormValues } from '@/features/obras/obras.queries';

type Props = {
  initialValues?: Partial<ObraFormValues>;
  onSubmit: (values: ObraFormValues) => void;
  submitting: boolean;
  submitLabel: string;
};

// Suma días a una fecha 'YYYY-MM-DD' y devuelve otra 'YYYY-MM-DD'.
// Evitamos una librería de fechas extra por ahora; si el proyecto crece,
// vale la pena migrar a date-fns o dayjs para manejar timezones con más cuidado.
function sumarDias(fechaISO: string, dias: number): string {
  const [y, m, d] = fechaISO.split('-').map(Number);
  const fecha = new Date(Date.UTC(y, m - 1, d));
  fecha.setUTCDate(fecha.getUTCDate() + dias);
  return fecha.toISOString().slice(0, 10);
}

function hoyISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export function ObraForm({ initialValues, onSubmit, submitting, submitLabel }: Props) {
  const [nombre, setNombre] = useState(initialValues?.nombre ?? '');
  const [telefono, setTelefono] = useState(initialValues?.telefono ?? '');
  const [email, setEmail] = useState(initialValues?.email ?? '');
  const [direccion, setDireccion] = useState(initialValues?.direccion ?? '');
  const [tipoObra, setTipoObra] = useState<TipoObra | null>((initialValues?.tipo_obra as TipoObra) ?? null);
  const [fechaInicio, setFechaInicio] = useState(initialValues?.fecha_inicio ?? hoyISO());
  const [diasEstimados, setDiasEstimados] = useState(
    initialValues?.dias_estimados != null ? String(initialValues.dias_estimados) : ''
  );
  const [origen, setOrigen] = useState(initialValues?.origen ?? '');
  const [importeOfertado, setImporteOfertado] = useState(
    initialValues?.importe_ofertado != null ? String(initialValues.importe_ofertado) : ''
  );
  const [importeCerrado, setImporteCerrado] = useState(
    initialValues?.importe_cerrado != null ? String(initialValues.importe_cerrado) : ''
  );
  const [mostrarOpcionales, setMostrarOpcionales] = useState(!!initialValues?.origen);
  const [error, setError] = useState<string | null>(null);

  const diasNum = Number(diasEstimados);
  const fechaFinEstimada =
    fechaInicio && diasEstimados && diasNum > 0 ? sumarDias(fechaInicio, diasNum) : null;

  const handleSubmit = () => {
    if (!nombre.trim()) {
      setError('El nombre de la obra es obligatorio');
      return;
    }
    if (fechaInicio && !/^\d{4}-\d{2}-\d{2}$/.test(fechaInicio)) {
      setError('Fecha de inicio inválida, usá el formato AAAA-MM-DD');
      return;
    }
    setError(null);
    onSubmit({
      nombre: nombre.trim(),
      telefono: telefono.trim() || null,
      email: email.trim() || null,
      direccion: direccion.trim() || null,
      tipo_obra: tipoObra,
      origen: origen.trim() || null,
      fecha_inicio: fechaInicio || null,
      dias_estimados: diasEstimados ? diasNum : null,
      fecha_fin_estimada: fechaFinEstimada,
      importe_ofertado: importeOfertado ? Number(importeOfertado.replace(',', '.')) : null,
      importe_cerrado: importeCerrado ? Number(importeCerrado.replace(',', '.')) : null,
      });
  };

  return (
    <Pressable style={{ flex: 1 }} onPress={Keyboard.dismiss} accessible={false}>
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.label}>Nombre de la obra *</Text>
      <TextInput
        style={styles.input}
        placeholder="Ej. Reforma cocina C/ Mayor 12"
        placeholderTextColor={colors.placeholder}
        value={nombre}
        onChangeText={setNombre}
      />

      <Text style={styles.label}>Teléfono</Text>
      <TextInput
        style={styles.input}
        placeholder="Ej. 600 123 456"
        placeholderTextColor={colors.placeholder}
        keyboardType="phone-pad"
        value={telefono}
        onChangeText={setTelefono}
      />

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        placeholder="cliente@email.com"
        placeholderTextColor={colors.placeholder}
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      <Text style={styles.label}>Dirección</Text>
      <TextInput
        style={styles.input}
        placeholder="Calle, número, ciudad"
        placeholderTextColor={colors.placeholder}
        value={direccion}
        onChangeText={setDireccion}
      />

      <Text style={styles.label}>Tipo de obra</Text>
      <View style={styles.chipsRow}>
        {TIPOS_OBRA.map((t) => (
          <Pressable
            key={t}
            onPress={() => setTipoObra(t)}
            style={[styles.chip, tipoObra === t && styles.chipActive]}
          >
            <Text style={[styles.chipText, tipoObra === t && styles.chipTextActive]}>{t}</Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.row2}>
        <View style={styles.flex1}>
          <Text style={styles.label}>Fecha de inicio</Text>
          <TextInput
            style={styles.input}
            placeholder="AAAA-MM-DD"
            placeholderTextColor={colors.placeholder}
            value={fechaInicio}
            onChangeText={setFechaInicio}
          />
        </View>
        <View style={styles.flex1}>
          <Text style={styles.label}>Días estimados</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej. 15"
            placeholderTextColor={colors.placeholder}
            keyboardType="number-pad"
            value={diasEstimados}
            onChangeText={setDiasEstimados}
          />
        </View>
      </View>

      {fechaFinEstimada ? (
        <Text style={styles.calculada}>Fecha fin estimada: {fechaFinEstimada}</Text>
        ) : null}

      <View style={styles.row2}>
        <View style={styles.flex1}>
          <Text style={styles.label}>Importe ofertado (€)</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej. 3500"
            placeholderTextColor={colors.placeholder}
            keyboardType="decimal-pad"
            value={importeOfertado}
            onChangeText={setImporteOfertado}
          />
        </View>
        <View style={styles.flex1}>
          <Text style={styles.label}>Importe cerrado (€)</Text>
          <TextInput
            style={styles.input}
            placeholder="Al cerrar la obra"
            placeholderTextColor={colors.placeholder}
            keyboardType="decimal-pad"
            value={importeCerrado}
            onChangeText={setImporteCerrado}
          />
        </View>
      </View>

        <Pressable style={styles.toggle} onPress={() => setMostrarOpcionales((v) => !v)}>
        <Text style={styles.toggleText}>{mostrarOpcionales ? '▾' : '▸'} Más campos (opcional)</Text>
      </Pressable>

      {mostrarOpcionales ? (
        <>
          <Text style={styles.label}>Origen</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej. Referido, redes sociales, web..."
            placeholderTextColor={colors.placeholder}
            value={origen}
            onChangeText={setOrigen}
          />
        </>
      ) : null}

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Pressable style={styles.submitButton} onPress={handleSubmit} disabled={submitting}>
        <Text style={styles.submitButtonText}>{submitting ? 'Guardando…' : submitLabel}</Text>
      </Pressable>
    </ScrollView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, paddingBottom: 40, gap: 4 },
  label: { fontSize: 13, fontWeight: '600', color: colors.textMuted, marginTop: 10, marginBottom: 4 },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
    color: colors.text,
  },
  row2: { flexDirection: 'row', gap: 12 },
  flex1: { flex: 1 },
  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  chip: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 18, borderWidth: 1, borderColor: colors.border },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { fontSize: 13, color: colors.text },
  chipTextActive: { color: '#fff' },
  calculada: { marginTop: 8, fontSize: 13, color: colors.textMuted, fontStyle: 'italic' },
  toggle: { marginTop: 16, marginBottom: 4 },
  toggleText: { color: colors.accent, fontWeight: '600' },
  error: { color: colors.danger, marginTop: 10 },
  submitButton: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
});
