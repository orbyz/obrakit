import { View, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ObraForm } from '@/components/obras/ObraForm';
import { useObra, useUpdateObra } from '@/features/obras/obras.queries';

export default function EditarObraScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data: obra, isLoading } = useObra(id);
  const updateObra = useUpdateObra();

  if (isLoading || !obra) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ObraForm
      submitLabel="Guardar cambios"
      submitting={updateObra.isPending}
      initialValues={{
        nombre: obra.nombre,
        telefono: obra.telefono,
        email: obra.email,
        direccion: obra.direccion,
        tipo_obra: obra.tipo_obra,
        origen: obra.origen,
        fecha_fin_estimada: obra.fecha_fin_estimada,
        importe_ofertado: obra.importe_ofertado,
        importe_cerrado: obra.importe_cerrado,
        }}
      onSubmit={(values) => {
        updateObra.mutate(
          { id: obra.id, values },
          {
            onSuccess: () => router.back(),
            onError: (err) => {
              console.error('Error al actualizar obra:', err);
              Alert.alert('Error', err instanceof Error ? err.message : 'No se pudo guardar los cambios');
            },
          }
        );
      }}
    />
  );
}
