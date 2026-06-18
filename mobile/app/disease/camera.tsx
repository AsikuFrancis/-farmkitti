import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
// import { CameraView, useCameraPermissions } from 'expo-camera'; // Will be available after install
import * as ImagePicker from 'expo-image-picker';
import { Header } from '../../src/components/Header';
import { Button } from '../../src/components/Button';
import { Colors, Spacing, Typography } from '../../src/constants/theme';
import { api } from '../../src/services/api';

export default function CameraScreen() {
  const router = useRouter();
  // const [permission, requestPermission] = useCameraPermissions();
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const uploadAndAnalyze = async () => {
    if (!imageUri) return;
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('file', {
        uri: imageUri,
        name: 'plant.jpg',
        type: 'image/jpeg',
      } as any);
      formData.append('crop_type', 'Maize'); // Hardcoded for MVP

      const response = await api.post('/disease/detect', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Redirect to results with the report data
      router.push({
        pathname: '/disease/results',
        params: { report: JSON.stringify(response.data) }
      });
    } catch (error) {
      console.error(error);
      alert('Failed to analyze image');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Scan Crop" showBack onBack={() => router.back()} />
      
      <View style={styles.content}>
        {imageUri ? (
          <View style={styles.previewContainer}>
            <Image source={{ uri: imageUri }} style={styles.preview} />
            <View style={styles.actions}>
              <Button title="Retake" onPress={() => setImageUri(null)} variant="outline" style={{flex: 1, marginRight: Spacing.sm}} />
              <Button title="Analyze" onPress={uploadAndAnalyze} loading={loading} style={{flex: 1, marginLeft: Spacing.sm}} />
            </View>
          </View>
        ) : (
          <View style={styles.placeholderContainer}>
            <Text style={styles.placeholderText}>Camera Preview Here</Text>
            {/* In a real app, <CameraView /> goes here */}
            <Button title="Open Gallery" onPress={pickImage} style={styles.galleryBtn} />
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    padding: Spacing.md,
  },
  previewContainer: {
    flex: 1,
  },
  preview: {
    flex: 1,
    borderRadius: 12,
    marginBottom: Spacing.md,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  placeholderContainer: {
    flex: 1,
    backgroundColor: Colors.border,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    ...Typography.body,
    color: Colors.textMuted,
  },
  galleryBtn: {
    marginTop: Spacing.xl,
  }
});
