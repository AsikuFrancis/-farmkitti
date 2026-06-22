import { Platform } from 'react-native';

export const Colors = {
  primary: '#059669', // Emerald 600
  primaryDark: '#047857', // Emerald 700
  primaryLight: '#D1FAE5', // Emerald 100
  secondary: '#F59E0B', // Amber 500
  secondaryLight: '#FEF3C7', // Amber 100
  background: '#F8FAFC', // Slate 50 (softer, cooler white)
  surface: '#FFFFFF', 
  text: '#0F172A', // Slate 900
  textMuted: '#64748B', // Slate 500
  error: '#EF4444',
  errorLight: '#FEE2E2',
  success: '#10B981',
  successLight: '#D1FAE5',
  warning: '#F59E0B',
  border: '#E2E8F0', // Slate 200
  inputBg: '#F1F5F9', // Slate 100
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const Typography = {
  header: {
    fontSize: 28,
    fontWeight: '800' as const,
    letterSpacing: -0.5,
  },
  subheader: {
    fontSize: 20,
    fontWeight: '700' as const,
    letterSpacing: -0.3,
  },
  title: {
    fontSize: 18,
    fontWeight: '600' as const,
  },
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 24,
  },
  caption: {
    fontSize: 14,
    fontWeight: '400' as const,
    color: Colors.textMuted,
  },
};

export const BorderRadius = {
  sm: 6,
  md: 12,
  lg: 16,
  xl: 24,
  round: 9999,
};

export const Shadows = {
  sm: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
    },
    android: { elevation: 2 },
  }),
  md: Platform.select({
    ios: {
      shadowColor: '#0F172A',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
    },
    android: { elevation: 4 },
  }),
};
