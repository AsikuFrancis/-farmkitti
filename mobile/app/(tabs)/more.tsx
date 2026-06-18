import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Header } from '../../src/components/Header';
import { Button } from '../../src/components/Button';
import { useAuthStore } from '../../src/stores/authStore';
import { Colors, Spacing } from '../../src/constants/theme';

export default function MoreScreen() {
  const { logout } = useAuthStore();
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Header title="Settings & More" />
      <View style={styles.content}>
        <Button 
          title="Analytics Dashboard (Admin)" 
          onPress={() => router.push('/analytics')} 
          style={{marginBottom: Spacing.md}}
        />
        <Button title="Logout" onPress={logout} variant="secondary" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: Spacing.xl,
  }
});
