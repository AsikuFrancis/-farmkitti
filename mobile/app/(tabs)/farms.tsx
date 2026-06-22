import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Header } from '../../src/components/Header';
import { EmptyState } from '../../src/components/EmptyState';
import { Button } from '../../src/components/Button';
import { Card } from '../../src/components/Card';
import { useFarmStore } from '../../src/stores/farmStore';
import { Colors, Spacing, Typography } from '../../src/constants/theme';

export default function FarmsScreen() {
  const router = useRouter();
  const { farms, loading, fetchFarms } = useFarmStore();

  useEffect(() => {
    fetchFarms();
  }, []);

  const renderFarm = ({ item }: { item: any }) => (
    <Card style={styles.farmCard}>
      <View style={styles.farmHeader}>
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons name="sprout" size={24} color={Colors.primary} />
        </View>
        <View style={styles.farmTitleContainer}>
          <Text style={styles.farmName}>{item.name}</Text>
          <Text style={styles.cropType}>{item.crop_type}</Text>
        </View>
        <View style={[styles.statusBadge, item.status === 'active' ? styles.statusActive : styles.statusInactive]}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>
      <View style={styles.farmDetails}>
        <View style={styles.detailItem}>
          <MaterialCommunityIcons name="texture-box" size={16} color={Colors.textMuted} />
          <Text style={styles.detailText}>{item.size_acres} Acres</Text>
        </View>
        <View style={styles.detailItem}>
          <MaterialCommunityIcons name="map-marker-outline" size={16} color={Colors.textMuted} />
          <Text style={styles.detailText}>{item.location_lat}, {item.location_lng}</Text>
        </View>
      </View>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Header title="My Farms" rightElement={
        <TouchableOpacity onPress={() => router.push('/farms/map')}>
          <MaterialCommunityIcons name="map" size={24} color={Colors.primary} />
        </TouchableOpacity>
      } />
      
      <FlatList
        data={farms}
        keyExtractor={(item) => item.id}
        renderItem={renderFarm}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchFarms} tintColor={Colors.primary} />}
        ListEmptyComponent={
          !loading ? (
            <EmptyState 
              title="No Farms Yet" 
              message="Add your first farm to start managing crops."
            />
          ) : null
        }
      />

      <TouchableOpacity 
        style={styles.fab} 
        activeOpacity={0.8}
        onPress={() => router.push('/farms/add')}
      >
        <MaterialCommunityIcons name="plus" size={32} color={Colors.surface} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  list: {
    padding: Spacing.xl,
    paddingBottom: Spacing.xxl * 3, // space for fab
  },
  farmCard: {
    marginBottom: Spacing.lg,
  },
  farmHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  farmTitleContainer: {
    flex: 1,
  },
  farmName: {
    ...Typography.subheader,
    color: Colors.text,
  },
  cropType: {
    ...Typography.caption,
    color: Colors.textMuted,
  },
  statusBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusActive: {
    backgroundColor: Colors.success + '20',
  },
  statusInactive: {
    backgroundColor: Colors.textMuted + '20',
  },
  statusText: {
    ...Typography.caption,
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  farmDetails: {
    flexDirection: 'row',
    gap: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: Spacing.md,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    ...Typography.caption,
    color: Colors.text,
  },
  fab: {
    position: 'absolute',
    bottom: Spacing.xl,
    right: Spacing.xl,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primaryDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  }
});
