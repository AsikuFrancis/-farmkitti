import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Button } from '../../src/components/Button';
import { Input } from '../../src/components/Input';
import { Header } from '../../src/components/Header';
import { api } from '../../src/services/api';
import { Colors, Spacing, Typography } from '../../src/constants/theme';

export default function RegisterScreen() {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [county, setCounty] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const router = useRouter();
  const { t } = useTranslation();

  const handleRegister = async () => {
    if (!fullName || !phone || !password) {
      setError('Please fill in required fields');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      await api.post('/auth/register', { 
        full_name: fullName, 
        phone, 
        password,
        role: 'farmer',
        county
      });
      
      // Proceed to OTP screen
      router.push({ pathname: '/otp', params: { phone } });
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
      <View style={{ alignItems: 'center', paddingTop: Spacing.xl * 2, paddingBottom: Spacing.md }}>
        <Text style={{ fontSize: 48, marginBottom: 4 }}>🌱</Text>
        <Text style={{ ...Typography.header, fontSize: 28, color: Colors.primary }}>Create Account</Text>
        <Text style={{ ...Typography.body, color: Colors.textMuted }}>Join the Farmkitti Network</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        <View style={styles.form}>
          <Input
            label="Full Name"
            placeholder="John Doe"
            value={fullName}
            onChangeText={setFullName}
          />
          <Input
            label={t('auth.phone')}
            placeholder="+211900000000"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            autoCapitalize="none"
          />
          <Input
            label="County (Optional)"
            placeholder="Juba"
            value={county}
            onChangeText={setCounty}
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
            title={t('common.register')}
            onPress={handleRegister}
            loading={loading}
            style={styles.registerButton}
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
    padding: Spacing.xl,
  },
  form: {
    width: '100%',
    marginTop: Spacing.lg,
  },
  registerButton: {
    marginTop: Spacing.xl,
  },
  errorText: {
    ...Typography.caption,
    color: Colors.error,
    marginBottom: Spacing.md,
  },
});
