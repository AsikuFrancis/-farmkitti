import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { Header } from '../../src/components/Header';
import { Card } from '../../src/components/Card';
import { Colors, Spacing, Typography } from '../../src/constants/theme';
import { api } from '../../src/services/api';

export default function CommunityScreen() {
  const router = useRouter();
  const [posts, setPosts] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      // Mock posts since DB might be empty
      setPosts([
        { id: '1', author_name: 'John Deng', content: 'What is the best fertilizer for maize?', created_at: new Date().toISOString(), likes: 5, comments: 2 },
        { id: '2', author_name: 'Mary Akol', content: 'Just harvested my first batch of tomatoes!', created_at: new Date().toISOString(), likes: 12, comments: 4 }
      ]);
      // In production:
      // const response = await api.get('/community/posts');
      // setPosts(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchPosts();
    setRefreshing(false);
  };

  const renderPost = ({ item }: { item: any }) => (
    <Card style={styles.postCard}>
      <View style={styles.postHeader}>
        <View style={styles.avatar} />
        <View>
          <Text style={styles.author}>{item.author_name}</Text>
          <Text style={styles.time}>{new Date(item.created_at).toLocaleDateString()}</Text>
        </View>
      </View>
      <Text style={styles.content}>{item.content}</Text>
      <View style={styles.postFooter}>
        <Text style={styles.footerText}>👍 {item.likes} Likes</Text>
        <Text style={styles.footerText}>💬 {item.comments} Comments</Text>
      </View>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Header 
        title="Community" 
        rightElement={
          <View style={{flexDirection: 'row', gap: 16}}>
            <TouchableOpacity onPress={() => router.push('/messages')}>
               <Text style={styles.headerIcon}>💬</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/community/create')}>
               <Text style={styles.headerIcon}>➕</Text>
            </TouchableOpacity>
          </View>
        }
      />
      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={<Text style={{textAlign: 'center', marginTop: 20}}>No posts yet.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  headerIcon: {
    fontSize: 20,
  },
  list: {
    padding: Spacing.md,
  },
  postCard: {
    marginBottom: Spacing.md,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primaryLight,
    marginRight: Spacing.sm,
  },
  author: {
    ...Typography.body,
    fontWeight: 'bold',
  },
  time: {
    ...Typography.caption,
    color: Colors.textMuted,
  },
  content: {
    ...Typography.body,
    marginBottom: Spacing.md,
  },
  postFooter: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: Spacing.sm,
    gap: Spacing.lg,
  },
  footerText: {
    ...Typography.caption,
    color: Colors.textMuted,
  }
});
