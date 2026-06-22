import React from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Header } from '../../src/components/Header';
import { Button } from '../../src/components/Button';
import { Card } from '../../src/components/Card';
import { EmptyState } from '../../src/components/EmptyState';
import { Colors, Spacing, Typography } from '../../src/constants/theme';

export default function DiseaseScreen() {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Header title={t('disease.scan_crop')} />
      <ScrollView contentContainerStyle={styles.content}>
        
        <Card style={styles.scanCard}>
          <Text style={styles.title}>AI Disease Detection</Text>
          <Text style={styles.subtitle}>Take a photo of a sick plant to get an instant diagnosis and treatment plan.</Text>
          <Button 
            title={t('disease.scan_crop')} 
            onPress={() => router.push('/disease/camera')} 
            style={styles.scanBtn}
          />
        </Card>

        <Text style={styles.historyTitle}>Recent Scans</Text>
        <EmptyState
          title="No Scans Yet"
          message="Your scan history will appear here once you take a photo of a plant."
          icon="history"
        />

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
  },
  scanCard: {
    alignItems: 'center',
    padding: Spacing.xl,
    backgroundColor: Colors.primaryLight,
    borderWidth: 0,
  },
  title: {
    ...Typography.subheader,
    color: Colors.primaryDark,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    ...Typography.body,
    color: Colors.textMuted,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  scanBtn: {
    width: '100%',
  },
  historyTitle: {
    ...Typography.subheader,
    marginTop: Spacing.xl,
    marginBottom: Spacing.sm,
  }
});
