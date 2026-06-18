import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
// Using conditional import or require since react-native-maps might not be fully linked yet
import MapView, { Marker, Polygon } from 'react-native-maps';
import { Header } from '../../src/components/Header';
import { Colors } from '../../src/constants/theme';

export default function FarmMapScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  // Mock Juba coordinates
  const initialRegion = {
    latitude: 4.8517,
    longitude: 31.5825,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  };

  const mockFarms = [
    {
      id: '1',
      name: "John's Maize Farm",
      latitude: 4.8520,
      longitude: 31.5830,
      polygon: [
        { latitude: 4.8525, longitude: 31.5825 },
        { latitude: 4.8525, longitude: 31.5835 },
        { latitude: 4.8515, longitude: 31.5835 },
        { latitude: 4.8515, longitude: 31.5825 },
      ]
    },
    {
      id: '2',
      name: "Mary's Sorghum Farm",
      latitude: 4.8600,
      longitude: 31.5700,
      polygon: [
        { latitude: 4.8610, longitude: 31.5690 },
        { latitude: 4.8610, longitude: 31.5710 },
        { latitude: 4.8590, longitude: 31.5710 },
        { latitude: 4.8590, longitude: 31.5690 },
      ]
    }
  ];

  useEffect(() => {
    // Simulate loading map data
    setTimeout(() => setLoading(false), 500);
  }, []);

  return (
    <View style={styles.container}>
      <Header title="Farm Map" showBack onBack={() => router.back()} />
      {loading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : (
        <MapView 
          style={styles.map} 
          initialRegion={initialRegion}
          mapType="satellite"
        >
          {mockFarms.map(farm => (
            <React.Fragment key={farm.id}>
              <Marker
                coordinate={{ latitude: farm.latitude, longitude: farm.longitude }}
                title={farm.name}
              />
              <Polygon
                coordinates={farm.polygon}
                fillColor="rgba(46, 125, 50, 0.4)"
                strokeColor={Colors.primary}
                strokeWidth={2}
              />
            </React.Fragment>
          ))}
        </MapView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    flex: 1,
  }
});
