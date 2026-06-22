import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, RefreshControl } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Header } from '../../src/components/Header';
import { Card } from '../../src/components/Card';
import { Colors, Spacing, Typography } from '../../src/constants/theme';
import { api } from '../../src/services/api';

export default function WeatherScreen() {
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchWeather();
  }, []);

  const fetchWeather = async () => {
    try {
      const response = await api.get('/weather/forecast?latitude=4.8517&longitude=31.5825&county=Juba');
      setWeather(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchWeather();
    setRefreshing(false);
  };

  const getWeatherIcon = (precip: number) => {
    if (precip > 10) return "weather-pouring";
    if (precip > 0) return "weather-rainy";
    return "weather-sunny";
  };

  if (loading && !weather) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Weather Intelligence" />
      <ScrollView 
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />}
      >
        
        {weather && (
          <>
            <LinearGradient
              colors={[Colors.secondary, Colors.primary]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.currentWeatherCard}
            >
              <View style={styles.currentWeatherHeader}>
                <Text style={styles.county}>{weather.county}</Text>
                <MaterialCommunityIcons name="map-marker" size={20} color={Colors.surface} />
              </View>
              
              <View style={styles.mainTempContainer}>
                <MaterialCommunityIcons 
                  name={getWeatherIcon(weather.daily_forecasts?.[0]?.precipitation_sum || 0)} 
                  size={64} 
                  color={Colors.surface} 
                />
                <Text style={styles.temperature}>{weather.current_temperature}°</Text>
              </View>

              <View style={styles.detailsRow}>
                <View style={styles.detailBox}>
                  <MaterialCommunityIcons name="water-percent" size={20} color={Colors.surface} />
                  <Text style={styles.detailsText}>{weather.current_humidity}%</Text>
                  <Text style={styles.detailsLabel}>Humidity</Text>
                </View>
                <View style={styles.detailBox}>
                  <MaterialCommunityIcons name="weather-windy" size={20} color={Colors.surface} />
                  <Text style={styles.detailsText}>{weather.current_wind_speed} km/h</Text>
                  <Text style={styles.detailsLabel}>Wind</Text>
                </View>
              </View>
            </LinearGradient>

            <Text style={styles.sectionTitle}>7-Day Forecast</Text>
            
            <View style={styles.forecastContainer}>
              {weather.daily_forecasts.map((day: any, index: number) => (
                <View key={index} style={styles.forecastRow}>
                  <Text style={styles.date}>
                    {index === 0 ? 'Today' : new Date(day.date).toLocaleDateString(undefined, {weekday: 'short', month: 'short', day: 'numeric'})}
                  </Text>
                  
                  <View style={styles.forecastCenter}>
                    <MaterialCommunityIcons 
                      name={getWeatherIcon(day.precipitation_sum)} 
                      size={24} 
                      color={day.precipitation_sum > 0 ? Colors.secondary : Colors.primaryDark} 
                    />
                    <Text style={styles.precipText}>
                      {day.precipitation_sum > 0 ? `${day.precipitation_sum}mm` : 'Clear'}
                    </Text>
                  </View>

                  <View style={styles.tempHighLow}>
                    <Text style={styles.tempHigh}>{day.temperature_max}°</Text>
                    <Text style={styles.tempLow}>{day.temperature_min}°</Text>
                  </View>
                </View>
              ))}
            </View>
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
    padding: Spacing.xl,
    paddingBottom: Spacing.xxl,
  },
  currentWeatherCard: {
    borderRadius: 24,
    padding: Spacing.xl,
    marginBottom: Spacing.xl,
    shadowColor: Colors.primaryDark,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  currentWeatherHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  county: {
    ...Typography.title,
    color: Colors.surface,
  },
  mainTempContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.lg,
    marginVertical: Spacing.xl,
  },
  temperature: {
    ...Typography.header,
    fontSize: 64,
    color: Colors.surface,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: Spacing.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 16,
    padding: Spacing.md,
  },
  detailBox: {
    alignItems: 'center',
  },
  detailsText: {
    ...Typography.subheader,
    color: Colors.surface,
    marginTop: 4,
  },
  detailsLabel: {
    ...Typography.caption,
    color: Colors.surface,
    opacity: 0.8,
  },
  sectionTitle: {
    ...Typography.title,
    marginBottom: Spacing.md,
    color: Colors.text,
  },
  forecastContainer: {
    backgroundColor: Colors.surface,
    borderRadius: 24,
    padding: Spacing.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 4,
  },
  forecastRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  date: {
    ...Typography.body,
    fontWeight: '600',
    flex: 1,
  },
  forecastCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: Spacing.sm,
  },
  precipText: {
    ...Typography.caption,
    color: Colors.textMuted,
  },
  tempHighLow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    flex: 1,
    justifyContent: 'flex-end',
  },
  tempHigh: {
    ...Typography.body,
    fontWeight: '700',
    color: Colors.text,
  },
  tempLow: {
    ...Typography.body,
    color: Colors.textMuted,
  }
});
