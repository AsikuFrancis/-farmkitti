import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Platform } from 'react-native';
import { Colors, Spacing, Typography, Shadows } from '../constants/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface HeaderProps {
  title: string;
  showBack?: boolean;
  onBack?: () => void;
  rightElement?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({ title, showBack, onBack, rightElement }) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.left}>
          {showBack && (
            <TouchableOpacity onPress={onBack} style={styles.backButton}>
              <MaterialCommunityIcons name="arrow-left" size={24} color={Colors.text} />
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.center}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
        </View>
        <View style={styles.right}>{rightElement}</View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: Colors.surface,
    ...Shadows.sm,
    zIndex: 10,
    paddingTop: Platform.OS === 'android' ? 24 : 0,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.surface,
  },
  left: {
    flex: 1,
    alignItems: 'flex-start',
  },
  center: {
    flex: 3,
    alignItems: 'center',
  },
  right: {
    flex: 1,
    alignItems: 'flex-end',
  },
  title: {
    ...Typography.title,
    color: Colors.text,
  },
  backButton: {
    padding: Spacing.xs,
    marginLeft: -Spacing.xs,
  },
});
