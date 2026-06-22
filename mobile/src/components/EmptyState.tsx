import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors, Spacing, Typography } from '../constants/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface EmptyStateProps {
  title: string;
  message: string;
  icon?: keyof typeof MaterialCommunityIcons.glyphMap;
  action?: React.ReactNode;
  style?: ViewStyle;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ title, message, icon = "folder-open-outline", action, style }) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.iconContainer}>
        <MaterialCommunityIcons name={icon} size={64} color={Colors.primaryLight} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      {action && <View style={styles.actionContainer}>{action}</View>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
  },
  iconContainer: {
    marginBottom: Spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.surface,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 4,
  },
  title: {
    ...Typography.subheader,
    color: Colors.text,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  message: {
    ...Typography.body,
    color: Colors.textMuted,
    textAlign: 'center',
    marginBottom: Spacing.xl,
    paddingHorizontal: Spacing.md,
  },
  actionContainer: {
    marginTop: Spacing.sm,
    width: '100%',
  },
});
