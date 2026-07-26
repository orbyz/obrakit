import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ObraForm } from '@/components/obras/ObraForm';
import { useCreateObra } from '@/features/obras/obras.queries';
import { useAuth } from '@/providers/AuthProvider';

export default function NuevaObraScreen() {
  const router = useRouter();
  const { tenantId, session } = useAuth();
  const createObra = useCreateObra();

  return (
    <ObraForm
      submitLabel="Crear obra"
      submitting={createObra.isPending}
      onSubmit={(values) => {
        if (!tenantId || !session?.user.id) {
          Alert.alert('Error', 'No se pudo determinar tu negocio. Vuelve a iniciar sesión.');
          return;
        }
        createObra.mutate(
          { ...values, tenant_id: tenantId, created_by: session.user.id },
          {
            onSuccess: (obra) => {
              router.replace(`/(tabs)/obras/${obra.id}`);
            },
            onError: (err) => {
              console.error('Error al crear obra:', err);
              Alert.alert('Error', err instanceof Error ? err.message : 'No se pudo crear la obra');
            },
          }
        );
      }}
    />
  );
}
