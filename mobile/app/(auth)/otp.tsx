import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { LinearGradient } from 'expo-linear-gradient';
import { Button } from '../../src/components/Button';
import { Input } from '../../src/components/Input';
import { api } from '../../src/services/api';
import { useAuthStore } from '../../src/stores/authStore';
import { Colors, Spacing, Typography } from '../../src/constants/theme';

export default function OTPScreen() {
  const { phone } = useLocalSearchParams<{ phone: string }>();
  // Fix URL decoding issue where '+' is turned into a space
  const safePhone = phone?.replace(' ', '+') || phone;
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const router = useRouter();
  const { t } = useTranslation();
  const { setAuth } = useAuthStore();

  const handleVerify = async () => {
    if (!otp || otp.length < 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // API call to verify OTP
      const response = await api.post('/auth/verify-otp', { phone: safePhone, otp });
      
      const mockUser = { id: '1', full_name: 'Farmer', phone: safePhone || '', role: 'farmer' };
      setAuth(mockUser, response.data.access_token || 'mock_token');
      
    } catch (err: any) {
      setError(err.response?.data?.detail || t('common.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.mainContainer}>
      <LinearGradient
        colors={[Colors.primaryDark, Colors.primaryLight]}
        style={styles.gradientBackground}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      <KeyboardAvoidingView 
        style={styles.container} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Verification</Text>
          <Text style={styles.subtitle}>
            {t('auth.otp_prompt')} {safePhone}
          </Text>
        </View>

        <View style={styles.formCard}>
          <View style={styles.form}>
            <Input
              placeholder="123456"
              value={otp}
              onChangeText={setOtp}
              keyboardType="number-pad"
              maxLength={6}
              textAlign="center"
              style={{ fontSize: 24, letterSpacing: 8 }}
            />
            
            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <Button
              title={t('common.submit')}
              onPress={handleVerify}
              loading={loading}
              style={styles.verifyButton}
            />

            <Button
              title="Go Back"
              onPress={() => router.back()}
              variant="ghost"
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: Colors.primaryDark,
  },
  gradientBackground: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: '100%',
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    paddingTop: 100,
    paddingBottom: 40,
    paddingHorizontal: Spacing.xl,
  },
  title: {
    ...Typography.header,
    fontSize: 32,
    color: Colors.surface,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    ...Typography.body,
    color: Colors.surface,
    opacity: 0.9,
    textAlign: 'center',
  },
  formCard: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: Spacing.xl,
    paddingTop: Spacing.xl,
    flex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 10,
  },
  form: {
    width: '100%',
  },
  verifyButton: {
    marginTop: Spacing.lg,
    marginBottom: Spacing.md,
  },
  errorText: {
    ...Typography.caption,
    color: Colors.error,
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
});
