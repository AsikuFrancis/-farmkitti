import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Header } from '../src/components/Header';
import { Card } from '../src/components/Card';
import { Colors, Spacing, Typography } from '../src/constants/theme';
import { api } from '../src/services/api';

export default function AnalyticsScreen() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await api.get('/analytics/dashboard');
      setData(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!data) return null;

  return (
    <View style={styles.container}>
      <Header title="Analytics Dashboard" showBack onBack={() => router.back()} />
      <ScrollView contentContainerStyle={styles.content}>
        
        <View style={styles.summaryRow}>
          <Card style={styles.summaryCard}>
            <Text style={styles.summaryValue}>{data.total_farmers_onboarded.toLocaleString()}</Text>
            <Text style={styles.summaryLabel}>Farmers</Text>
          </Card>
          <Card style={styles.summaryCard}>
            <Text style={styles.summaryValue}>{data.total_land_area_hectares.toLocaleString()}</Text>
            <Text style={styles.summaryLabel}>Hectares</Text>
          </Card>
        </View>

        <Text style={styles.sectionTitle}>Regional Breakdown</Text>
        {data.regional_breakdown.map((region: any, i: number) => (
          <Card key={i} style={styles.rowCard}>
            <Text style={styles.rowTitle}>{region.region}</Text>
            <Text style={styles.rowValue}>{region.total_farms} farms</Text>
          </Card>
        ))}

        <Text style={styles.sectionTitle}>Crop Distribution</Text>
        {data.crop_distribution.map((crop: any, i: number) => (
          <View key={i} style={styles.progressContainer}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressLabel}>{crop.crop_type}</Text>
              <Text style={styles.progressValue}>{crop.percentage}%</Text>
            </View>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: `${crop.percentage}%` }]} />
            </View>
          </View>
        ))}

        <Text style={styles.sectionTitle}>Recent Disease Outbreaks</Text>
        {data.recent_disease_outbreaks.map((disease: any, i: number) => (
          <Card key={i} style={styles.diseaseCard}>
            <Text style={styles.diseaseName}>{disease.disease_name}</Text>
            <Text style={styles.diseaseCases}>{disease.reported_cases} cases reported</Text>
          </Card>
        ))}

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: Spacing.md,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  summaryCard: {
    flex: 1,
    alignItems: 'center',
    padding: Spacing.lg,
  },
  summaryValue: {
    ...Typography.header,
    color: Colors.primary,
    marginBottom: Spacing.xs,
  },
  summaryLabel: {
    ...Typography.caption,
    color: Colors.textMuted,
  },
  sectionTitle: {
    ...Typography.subheader,
    marginBottom: Spacing.sm,
    marginTop: Spacing.md,
  },
  rowCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
    marginBottom: Spacing.sm,
  },
  rowTitle: {
    ...Typography.body,
    fontWeight: 'bold',
  },
  rowValue: {
    ...Typography.body,
    color: Colors.textMuted,
  },
  progressContainer: {
    marginBottom: Spacing.md,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.xs,
  },
  progressLabel: {
    ...Typography.body,
  },
  progressValue: {
    ...Typography.caption,
    color: Colors.textMuted,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: Colors.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.primary,
  },
  diseaseCard: {
    borderLeftWidth: 4,
    borderLeftColor: Colors.error,
    marginBottom: Spacing.sm,
  },
  diseaseName: {
    ...Typography.body,
    fontWeight: 'bold',
  },
  diseaseCases: {
    ...Typography.caption,
    color: Colors.error,
    marginTop: 4,
  }
});
