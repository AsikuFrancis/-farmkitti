import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Header } from '../../src/components/Header';
import { Colors, Spacing, Typography } from '../../src/constants/theme';

export default function MessagesInboxScreen() {
  const router = useRouter();
  const [conversations, setConversations] = useState<any[]>([]);

  useEffect(() => {
    // Mock data for MVP
    setConversations([
      { id: 'ext_1', name: 'James (Extension Officer)', lastMessage: 'Make sure to water the crops early morning.', unread: 1, time: '10:00 AM' },
      { id: 'farmer_2', name: 'Peter Atem', lastMessage: 'How much are you selling the maize for?', unread: 0, time: 'Yesterday' }
    ]);
  }, []);

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={styles.conversationItem}
      onPress={() => router.push(`/messages/${item.id}?name=${encodeURIComponent(item.name)}`)}
    >
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{item.name.charAt(0)}</Text>
      </View>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.time}>{item.time}</Text>
        </View>
        <Text style={styles.lastMessage} numberOfLines={1}>{item.lastMessage}</Text>
      </View>
      {item.unread > 0 && (
        <View style={styles.unreadBadge}>
          <Text style={styles.unreadText}>{item.unread}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Header title="Messages" showBack onBack={() => router.back()} />
      <FlatList
        data={conversations}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
      />
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
  },
  conversationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  avatarText: {
    color: Colors.surface,
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  name: {
    ...Typography.body,
    fontWeight: 'bold',
  },
  time: {
    ...Typography.caption,
    color: Colors.textMuted,
  },
  lastMessage: {
    ...Typography.body,
    color: Colors.textMuted,
  },
  unreadBadge: {
    backgroundColor: Colors.primary,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: Spacing.sm,
  },
  unreadText: {
    color: Colors.surface,
    fontSize: 12,
    fontWeight: 'bold',
  }
});
