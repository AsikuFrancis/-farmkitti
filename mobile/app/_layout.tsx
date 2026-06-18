import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { useAuthStore } from '../src/stores/authStore';
import '../src/i18n'; // Initialize i18n

export default function RootLayout() {
  const { user } = useAuthStore();

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* If not authenticated, show the auth group */}
      {/* If authenticated, show the tabs group */}
      {!user ? (
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      ) : (
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      )}
    </Stack>
  );
}
