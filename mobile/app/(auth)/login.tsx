import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { LinearGradient } from 'expo-linear-gradient';
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
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Text style={{ fontSize: 56 }}>🌱</Text>
            </View>
            <Text style={styles.title}>Farmkitti</Text>
            <Text style={styles.subtitle}>Smart Farming in Your Pocket</Text>
          </View>

          <View style={styles.formCard}>
            <View style={{ alignItems: 'flex-end', marginBottom: Spacing.md }}>
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
          </View>
        </ScrollView>
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
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    paddingTop: 80,
    paddingBottom: 40,
  },
  logoContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: Spacing.md,
    borderRadius: 40,
    marginBottom: Spacing.md,
  },
  title: {
    ...Typography.header,
    fontSize: 36,
    color: Colors.surface,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    ...Typography.body,
    color: Colors.surface,
    opacity: 0.9,
  },
  formCard: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: Spacing.xl,
    paddingTop: Spacing.lg,
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
