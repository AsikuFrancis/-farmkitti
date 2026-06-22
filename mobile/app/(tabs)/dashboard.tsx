import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Header } from '../../src/components/Header';
import { Card } from '../../src/components/Card';
import { Button } from '../../src/components/Button';
import { Colors, Spacing, Typography } from '../../src/constants/theme';
import { useAuthStore } from '../../src/stores/authStore';

export default function DashboardScreen() {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };

  const QUICK_ACTIONS = [
    { title: 'Add Farm', icon: 'sprout', route: '/farms/add', color: Colors.primary },
    { title: 'Disease', icon: 'leaf-off', route: '/disease', color: Colors.error },
    { title: 'Weather', icon: 'weather-sunny', route: '/weather', color: Colors.secondary },
    { title: 'Community', icon: 'account-group', route: '/community', color: Colors.info },
  ];

  return (
    <View style={styles.container}>
      <Header title="Farmkiti" />
      <ScrollView 
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />}
      >
        <View style={styles.greetingContainer}>
          <View>
            <Text style={styles.greetingSub}>Welcome back,</Text>
            <Text style={styles.welcome}>{user?.full_name}</Text>
          </View>
          <View style={styles.avatar}>
            <MaterialCommunityIcons name="account" size={32} color={Colors.primary} />
          </View>
        </View>
        
        <LinearGradient
          colors={[Colors.primaryDark, Colors.primary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.aiCardContainer}
        >
          <View style={styles.aiHeader}>
            <MaterialCommunityIcons name="robot-outline" size={28} color={Colors.surface} />
            <Text style={styles.aiTitle}>AI Assistant</Text>
          </View>
          <Text style={styles.aiBody}>Ask questions about farming, crops, and pest control.</Text>
          <Button 
            title="Chat Now" 
            onPress={() => router.push('/assistant/chat')} 
            variant="secondary"
            style={{marginTop: Spacing.md}}
          />
        </LinearGradient>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.quickActionsContainer}>
          {QUICK_ACTIONS.map((action, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.quickActionBtn}
              onPress={() => router.push(action.route as any)}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: action.color + '20' }]}>
                <MaterialCommunityIcons name={action.icon as any} size={28} color={action.color} />
              </View>
              <Text style={styles.quickActionText}>{action.title}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={styles.sectionTitle}>{t('dashboard.my_farms')}</Text>
        <TouchableOpacity activeOpacity={0.7} onPress={() => router.push('/farms')}>
          <Card style={styles.actionCard}>
            <View style={styles.cardIcon}>
              <MaterialCommunityIcons name="sprout" size={28} color={Colors.primary} />
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>2 Active Farms</Text>
              <Text style={styles.bodyText}>Manage your crops and yields.</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={24} color={Colors.textMuted} />
          </Card>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>{t('dashboard.weather')}</Text>
        <Card style={styles.actionCard}>
          <View style={[styles.cardIcon, { backgroundColor: Colors.secondaryLight }]}>
            <MaterialCommunityIcons name="weather-sunny" size={28} color={Colors.secondary} />
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Sunny, 28°C</Text>
            <Text style={styles.bodyText}>Perfect weather for planting.</Text>
          </View>
        </Card>

        <Text style={styles.sectionTitle}>{t('dashboard.recent_activity')}</Text>
        <Card style={styles.activityCard}>
          <MaterialCommunityIcons name="leaf-off" size={20} color={Colors.success} style={{ marginRight: Spacing.sm }} />
          <Text style={styles.bodyText}>Scanned Maize Crop - No disease found.</Text>
        </Card>
      </ScrollView>
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
    paddingBottom: Spacing.xxl * 2,
  },
  greetingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  greetingSub: {
    ...Typography.body,
    color: Colors.textMuted,
  },
  welcome: {
    ...Typography.header,
    color: Colors.text,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    ...Typography.title,
    color: Colors.text,
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  bodyText: {
    ...Typography.caption,
    color: Colors.textMuted,
  },
  aiCardContainer: {
    borderRadius: 24,
    padding: Spacing.xl,
    marginBottom: Spacing.sm,
    shadowColor: Colors.primaryDark,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  aiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  aiTitle: {
    ...Typography.subheader,
    color: Colors.surface,
    marginLeft: Spacing.sm,
  },
  aiBody: {
    ...Typography.body,
    color: Colors.surface,
    opacity: 0.9,
    marginBottom: Spacing.sm,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
  },
  cardIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    ...Typography.body,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 2,
  },
  activityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
  },
  quickActionsContainer: {
    paddingVertical: Spacing.md,
    gap: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  quickActionBtn: {
    alignItems: 'center',
    width: 76,
  },
  quickActionIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xs,
  },
  quickActionText: {
    ...Typography.caption,
    textAlign: 'center',
    color: Colors.text,
  }
});
