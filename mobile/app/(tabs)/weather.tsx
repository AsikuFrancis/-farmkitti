import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Header } from '../../src/components/Header';
import { Card } from '../../src/components/Card';
import { Colors, Spacing, Typography } from '../../src/constants/theme';
import { api } from '../../src/services/api';

export default function WeatherScreen() {
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWeather();
  }, []);

  const fetchWeather = async () => {
    try {
      // Mock coordinates for Juba, South Sudan
      const response = await api.get('/weather/forecast?latitude=4.8517&longitude=31.5825&county=Juba');
      setWeather(response.data);
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

  return (
    <View style={styles.container}>
      <Header title="Weather Intelligence" />
      <ScrollView contentContainerStyle={styles.content}>
        
        {weather && (
          <>
            <Card style={styles.currentWeatherCard}>
              <Text style={styles.county}>{weather.county}</Text>
              <Text style={styles.temperature}>{weather.current_temperature}°C</Text>
              <View style={styles.detailsRow}>
                <Text style={styles.detailsText}>Humidity: {weather.current_humidity}%</Text>
                <Text style={styles.detailsText}>Wind: {weather.current_wind_speed} km/h</Text>
              </View>
            </Card>

            <Text style={styles.sectionTitle}>7-Day Forecast</Text>
            
            {weather.daily_forecasts.map((day: any, index: number) => (
              <Card key={index} style={styles.forecastCard}>
                <Text style={styles.date}>{new Date(day.date).toLocaleDateString(undefined, {weekday: 'short', month: 'short', day: 'numeric'})}</Text>
                <View style={styles.forecastInfo}>
                  <Text style={styles.tempHighLow}>{day.temperature_max}° / {day.temperature_min}°</Text>
                  <Text style={styles.precip}>{day.precipitation_sum > 0 ? `🌧️ ${day.precipitation_sum}mm` : '☀️'}</Text>
                </View>
              </Card>
            ))}
          </>
        )}

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
  currentWeatherCard: {
    alignItems: 'center',
    padding: Spacing.xl,
    backgroundColor: Colors.primary,
    marginBottom: Spacing.xl,
  },
  county: {
    ...Typography.subheader,
    color: Colors.surface,
    marginBottom: Spacing.sm,
  },
  temperature: {
    ...Typography.header,
    fontSize: 48,
    color: Colors.surface,
  },
  detailsRow: {
    flexDirection: 'row',
    gap: Spacing.lg,
    marginTop: Spacing.md,
  },
  detailsText: {
    ...Typography.body,
    color: Colors.surface,
    opacity: 0.9,
  },
  sectionTitle: {
    ...Typography.subheader,
    marginBottom: Spacing.sm,
  },
  forecastCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  date: {
    ...Typography.body,
    fontWeight: '600',
    flex: 1,
  },
  forecastInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  tempHighLow: {
    ...Typography.body,
  },
  precip: {
    ...Typography.body,
    width: 60,
    textAlign: 'right',
  }
});
