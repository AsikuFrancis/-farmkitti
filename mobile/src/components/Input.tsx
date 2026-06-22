import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TextInputProps, ViewStyle } from 'react-native';
import { Colors, Spacing, BorderRadius, Typography, Shadows } from '../constants/theme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
}

export const Input: React.FC<InputProps> = ({ label, error, containerStyle, onFocus, onBlur, ...props }) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[
          styles.input,
          isFocused ? styles.inputFocused : null,
          error ? styles.inputError : null,
          props.multiline ? styles.inputMultiline : null,
        ]}
        placeholderTextColor={Colors.textMuted}
        onFocus={(e) => {
          setIsFocused(true);
          onFocus && onFocus(e);
        }}
        onBlur={(e) => {
          setIsFocused(false);
          onBlur && onBlur(e);
        }}
        {...props}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.lg,
  },
  label: {
    ...Typography.body,
    fontWeight: '600',
    marginBottom: Spacing.xs,
    color: Colors.text,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    minHeight: 52,
    color: Colors.text,
    backgroundColor: Colors.inputBg,
    ...Typography.body,
  },
  inputFocused: {
    borderColor: Colors.primary,
    backgroundColor: Colors.surface,
    ...Shadows.sm,
  },
  inputMultiline: {
    minHeight: 120,
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: Colors.error,
    backgroundColor: Colors.errorLight,
  },
  errorText: {
    ...Typography.caption,
    color: Colors.error,
    marginTop: Spacing.xs,
  },
});
