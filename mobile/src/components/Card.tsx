import React from 'react';
import { View, StyleSheet, ViewStyle, ViewProps } from 'react-native';
import { Colors, Spacing, BorderRadius } from '../constants/theme';

interface CardProps extends ViewProps {
  style?: ViewStyle;
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ style, children, ...props }) => {
  return (
    <View style={[styles.card, style]} {...props}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginVertical: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.sm,
  },
});
