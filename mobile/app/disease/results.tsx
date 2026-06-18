import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Header } from '../../src/components/Header';
import { Card } from '../../src/components/Card';
import { Colors, Spacing, Typography } from '../../src/constants/theme';
import { Button } from '../../src/components/Button';

export default function ResultsScreen() {
  const { report } = useLocalSearchParams<{ report: string }>();
  const router = useRouter();
  
  let reportData = null;
  if (report) {
    try {
      reportData = JSON.parse(report);
    } catch (e) {
      console.error('Failed to parse report data');
    }
  }

  if (!reportData) {
    return (
      <View style={styles.container}>
        <Header title="Results" showBack onBack={() => router.back()} />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>No results available.</Text>
        </View>
      </View>
    );
  }

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'low': return Colors.success;
      case 'medium': return Colors.warning;
      case 'high': return Colors.error;
      case 'critical': return '#991B1B'; // Dark red
      default: return Colors.primary;
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Analysis Results" showBack onBack={() => router.back()} />
      <ScrollView contentContainerStyle={styles.content}>
        
        <Card style={styles.headerCard}>
          <Text style={styles.title}>Diagnosis</Text>
          <Text style={styles.diseaseName}>{reportData.prediction.replace(/_/g, ' ')}</Text>
          <View style={styles.badges}>
            <View style={[styles.badge, { backgroundColor: getSeverityColor(reportData.severity) }]}>
              <Text style={styles.badgeText}>Severity: {reportData.severity.toUpperCase()}</Text>
            </View>
            <View style={[styles.badge, { backgroundColor: Colors.primaryDark }]}>
              <Text style={styles.badgeText}>Confidence: {(reportData.confidence * 100).toFixed(1)}%</Text>
            </View>
          </View>
        </Card>

        <Card>
          <Text style={styles.sectionTitle}>Treatment Recommendation</Text>
          <Text style={styles.bodyText}>{reportData.recommendation}</Text>
        </Card>

        <Card>
          <Text style={styles.sectionTitle}>Preventive Measures</Text>
          <Text style={styles.bodyText}>{reportData.preventive_measures}</Text>
        </Card>

        <Button 
          title="Done" 
          onPress={() => router.push('/disease')} 
          style={styles.doneBtn} 
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
    padding: Spacing.md,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    ...Typography.body,
    color: Colors.error,
  },
  headerCard: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  title: {
    ...Typography.caption,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  diseaseName: {
    ...Typography.header,
    fontSize: 28,
    color: Colors.text,
    textAlign: 'center',
    marginVertical: Spacing.sm,
  },
  badges: {
    flexDirection: 'row',
    marginTop: Spacing.md,
    gap: Spacing.sm,
  },
  badge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: 16,
  },
  badgeText: {
    ...Typography.caption,
    color: Colors.surface,
    fontWeight: 'bold',
  },
  sectionTitle: {
    ...Typography.subheader,
    color: Colors.primaryDark,
    marginBottom: Spacing.sm,
  },
  bodyText: {
    ...Typography.body,
    color: Colors.text,
    lineHeight: 24,
  },
  doneBtn: {
    marginTop: Spacing.xl,
    marginBottom: Spacing.xl,
  }
});
