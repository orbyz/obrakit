import { Stack } from 'expo-router';

export default function RentabilidadStackLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Rentabilidad' }} />
    </Stack>
  );
}
