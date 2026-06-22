import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Header } from '../../src/components/Header';
import { Card } from '../../src/components/Card';
import { Colors, Spacing, Typography } from '../../src/constants/theme';
import { api } from '../../src/services/api';

export default function CommunityScreen() {
  const router = useRouter();
  const [posts, setPosts] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      // Mock posts since DB might be empty
      setPosts([
        { id: '1', author_name: 'John Deng', content: 'What is the best fertilizer for maize?', created_at: new Date().toISOString(), likes: 5, comments: 2 },
        { id: '2', author_name: 'Mary Akol', content: 'Just harvested my first batch of tomatoes! The yield is amazing this season. Highly recommend crop rotation.', created_at: new Date().toISOString(), likes: 12, comments: 4 }
      ]);
    } catch (error) {
      console.error(error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchPosts();
    setTimeout(() => setRefreshing(false), 1000);
  };

  const toggleLike = (id: string) => {
    setLikedPosts(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const renderPost = ({ item }: { item: any }) => {
    const isLiked = likedPosts[item.id];
    
    return (
      <Card style={styles.postCard}>
        <View style={styles.postHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{item.author_name.charAt(0)}</Text>
          </View>
          <View>
            <Text style={styles.author}>{item.author_name}</Text>
            <Text style={styles.time}>{new Date(item.created_at).toLocaleDateString()}</Text>
          </View>
        </View>
        <Text style={styles.content}>{item.content}</Text>
        <View style={styles.postFooter}>
          <TouchableOpacity 
            style={styles.actionBtn} 
            onPress={() => toggleLike(item.id)}
            activeOpacity={0.6}
          >
            <MaterialCommunityIcons 
              name={isLiked ? "heart" : "heart-outline"} 
              size={20} 
              color={isLiked ? Colors.error : Colors.textMuted} 
            />
            <Text style={[styles.footerText, isLiked && { color: Colors.error }]}>
              {item.likes + (isLiked ? 1 : 0)} Likes
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} activeOpacity={0.6}>
            <MaterialCommunityIcons name="comment-outline" size={20} color={Colors.textMuted} />
            <Text style={styles.footerText}>{item.comments} Comments</Text>
          </TouchableOpacity>
        </View>
      </Card>
    );
  };

  return (
    <View style={styles.container}>
      <Header 
        title="Community" 
        rightElement={
          <TouchableOpacity onPress={() => router.push('/messages')}>
             <MaterialCommunityIcons name="message-text-outline" size={24} color={Colors.primary} />
          </TouchableOpacity>
        }
      />
      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />}
        ListEmptyComponent={<Text style={{textAlign: 'center', marginTop: 20}}>No posts yet.</Text>}
        showsVerticalScrollIndicator={false}
      />
      
      <TouchableOpacity 
        style={styles.fab} 
        activeOpacity={0.8}
        onPress={() => router.push('/community/create')}
      >
        <MaterialCommunityIcons name="pencil-outline" size={28} color={Colors.surface} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  list: {
    padding: Spacing.md,
    paddingBottom: Spacing.xxl * 3, // For FAB
  },
  postCard: {
    marginBottom: Spacing.lg,
    padding: Spacing.lg,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primaryLight,
    marginRight: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    ...Typography.subheader,
    color: Colors.primaryDark,
  },
  author: {
    ...Typography.subheader,
    color: Colors.text,
  },
  time: {
    ...Typography.caption,
    color: Colors.textMuted,
  },
  content: {
    ...Typography.body,
    lineHeight: 22,
    marginBottom: Spacing.lg,
    color: Colors.text,
  },
  postFooter: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: Spacing.md,
    gap: Spacing.xl,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  footerText: {
    ...Typography.body,
    fontWeight: '500',
    color: Colors.textMuted,
  },
  fab: {
    position: 'absolute',
    bottom: Spacing.xl,
    right: Spacing.xl,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primaryDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  }
});
