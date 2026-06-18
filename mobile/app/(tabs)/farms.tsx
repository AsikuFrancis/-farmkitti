import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Header } from '../../src/components/Header';
import { EmptyState } from '../../src/components/EmptyState';
import { Button } from '../../src/components/Button';
import { Colors } from '../../src/constants/theme';

export default function FarmsScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Header title="My Farms" rightElement={
        <Text style={styles.addText} onPress={() => router.push('/farms/add')}>+ Add</Text>
      } />
      
      <View style={{padding: Spacing.md}}>
        <Button 
          title="View Map" 
          variant="secondary"
          onPress={() => router.push('/farms/map')}
        />
      </View>

      <EmptyState 
        title="No Farms Yet" 
        message="Add your first farm to start managing crops."
        action={<Button title="Add Farm" onPress={() => router.push('/farms/add')} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  addText: {
    color: Colors.primary,
    fontWeight: 'bold',
    fontSize: 16,
  }
});
