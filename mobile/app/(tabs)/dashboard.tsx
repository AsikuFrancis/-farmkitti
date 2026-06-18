import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import { Header } from '../../src/components/Header';
import { Card } from '../../src/components/Card';
import { Button } from '../../src/components/Button';
import { Colors, Spacing, Typography } from '../../src/constants/theme';
import { useAuthStore } from '../../src/stores/authStore';

export default function DashboardScreen() {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Header title="Farmkiti" />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.welcome}>Hello, {user?.full_name}</Text>
        
        <Card style={styles.assistantCard}>
          <Text style={styles.sectionTitle}>AI Assistant</Text>
          <Text style={styles.bodyText}>Ask questions about farming, crops, and pest control.</Text>
          <Button 
            title="Chat Now" 
            onPress={() => router.push('/assistant/chat')} 
            style={{marginTop: Spacing.md}}
          />
        </Card>

        <Text style={styles.sectionTitle}>{t('dashboard.my_farms')}</Text>
        <Card>
          <Text style={styles.bodyText}>You have 2 active farms.</Text>
        </Card>

        <Text style={styles.sectionTitle}>{t('dashboard.weather')}</Text>
        <Card>
          <Text style={styles.bodyText}>Sunny, 28°C</Text>
        </Card>

        <Text style={styles.sectionTitle}>{t('dashboard.recent_activity')}</Text>
        <Card>
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
    padding: Spacing.md,
  },
  welcome: {
    ...Typography.header,
    color: Colors.text,
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    ...Typography.subheader,
    color: Colors.text,
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
  },
  bodyText: {
    ...Typography.body,
    color: Colors.text,
  },
  assistantCard: {
    backgroundColor: Colors.secondaryLight,
    borderWidth: 0,
  }
});
