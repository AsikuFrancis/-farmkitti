import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Button } from '../../src/components/Button';
import { Input } from '../../src/components/Input';
import { Header } from '../../src/components/Header';
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
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Header title="Verify OTP" showBack onBack={() => router.back()} />
      <View style={styles.content}>
        <Text style={styles.title}>Verification</Text>
        <Text style={styles.subtitle}>
          {t('auth.otp_prompt')} {safePhone}
        </Text>

        <View style={styles.form}>
          <Input
            placeholder="123456"
            value={otp}
            onChangeText={setOtp}
            keyboardType="number-pad"
            maxLength={6}
            textAlign="center"
          />
          
          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <Button
            title={t('common.submit')}
            onPress={handleVerify}
            loading={loading}
            style={styles.verifyButton}
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    padding: Spacing.xl,
    justifyContent: 'center',
  },
  title: {
    ...Typography.header,
    color: Colors.primary,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    ...Typography.body,
    color: Colors.textMuted,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  form: {
    width: '100%',
  },
  verifyButton: {
    marginTop: Spacing.lg,
  },
  errorText: {
    ...Typography.caption,
    color: Colors.error,
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
});
