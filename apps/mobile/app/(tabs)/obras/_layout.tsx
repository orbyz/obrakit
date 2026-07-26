import { Stack, useRouter } from 'expo-router';
import { Pressable, Text } from 'react-native';

export default function ObrasStackLayout() {
  const router = useRouter();
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: 'Obras',
          headerRight: () => (
            <Pressable onPress={() => router.push('/(tabs)/obras/nueva')} hitSlop={10}>
              <Text style={{ fontSize: 28, color: '#2563eb', marginRight: 4 }}>+</Text>
            </Pressable>
          ),
        }}
      />
      <Stack.Screen name="nueva" options={{ title: 'Nueva obra', presentation: 'modal' }} />
      <Stack.Screen name="[id]/index" options={{ title: 'Detalle de obra' }} />
      <Stack.Screen name="[id]/editar" options={{ title: 'Editar obra', presentation: 'modal' }} />
      <Stack.Screen name="[id]/gastos" options={{ title: 'Materiales' }} />
    </Stack>
  );
}
