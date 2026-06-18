import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Header } from '../../src/components/Header';
import { Colors, Spacing, Typography } from '../../src/constants/theme';

export default function AddFarmScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Header title="Add New Farm" showBack onBack={() => router.back()} />
      <View style={styles.content}>
        <Text style={styles.text}>Add farm form goes here.</Text>
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
    alignItems: 'center',
  },
  text: {
    ...Typography.body,
    color: Colors.text,
  }
});
