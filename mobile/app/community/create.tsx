import React, { useState } from 'react';
import { View, StyleSheet, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { Header } from '../../src/components/Header';
import { Button } from '../../src/components/Button';
import { Colors, Spacing, Typography } from '../../src/constants/theme';
import { api } from '../../src/services/api';

export default function CreatePostScreen() {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handlePost = async () => {
    if (!content.trim()) return;
    setLoading(true);
    try {
      await api.post('/community/posts', { content });
      router.back();
    } catch (error) {
      console.error(error);
      // Even if API fails, go back for MVP demo
      router.back();
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Create Post" showBack onBack={() => router.back()} />
      <View style={styles.content}>
        <TextInput
          style={styles.input}
          placeholder="What's on your mind? Ask a question or share an update..."
          placeholderTextColor={Colors.textMuted}
          multiline
          autoFocus
          value={content}
          onChangeText={setContent}
        />
        <Button 
          title="Post" 
          onPress={handlePost} 
          loading={loading} 
          disabled={!content.trim()} 
          style={styles.postBtn}
        />
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
  input: {
    flex: 1,
    ...Typography.body,
    textAlignVertical: 'top',
  },
  postBtn: {
    marginTop: Spacing.md,
    marginBottom: Spacing.xl,
  }
});
