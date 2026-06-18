import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Button } from '../../src/components/Button';
import { Input } from '../../src/components/Input';
import { LanguageSelector } from '../../src/components/LanguageSelector';
import { api } from '../../src/services/api';
import { useAuthStore } from '../../src/stores/authStore';
import { Colors, Spacing, Typography } from '../../src/constants/theme';

export default function LoginScreen() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const router = useRouter();
  const { t } = useTranslation();
  const { setAuth } = useAuthStore();

  const handleLogin = async () => {
    if (!phone || !password) {
      setError('Please fill in all fields');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // API call to login
      const response = await api.post('/auth/login', { phone, password });
      
      // We don't have the user details yet, ideally the login response returns it.
      // For now we simulate getting user details.
      const mockUser = { id: '1', full_name: 'Farmer', phone, role: 'farmer' };
      setAuth(mockUser, response.data.access_token);
      
      // Root layout will automatically redirect to (tabs) due to state change
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
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={{ fontSize: 64, marginBottom: 8 }}>🌱</Text>
          <Text style={styles.title}>Farmkitti</Text>
          <Text style={styles.subtitle}>Smart Farming in Your Pocket</Text>
        </View>

        <View style={{ alignItems: 'flex-end', marginBottom: 24 }}>
          <LanguageSelector />
        </View>

        <View style={styles.form}>
          <Input
            label={t('auth.phone')}
            placeholder="+211900000000"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            autoCapitalize="none"
          />
          <Input
            label={t('auth.password')}
            placeholder="********"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          
          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <Button
            title={t('common.login')}
            onPress={handleLogin}
            loading={loading}
            style={styles.loginButton}
          />

          <Button
            title={t('common.register')}
            onPress={() => router.push('/register')}
            variant="ghost"
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: Spacing.xl,
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  title: {
    ...Typography.header,
    fontSize: 36,
    color: Colors.primary,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    ...Typography.subheader,
    color: Colors.textMuted,
  },
  form: {
    width: '100%',
  },
  loginButton: {
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
  },
  errorText: {
    ...Typography.caption,
    color: Colors.error,
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
});
