import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS } from '../constants/Colors';
import { useAppTheme } from '../hooks/useThemeContext';

export default function LoginScreen() {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { isDark } = useAppTheme();
  
  const theme = isDark ? COLORS.dark : COLORS.light;

  const handleLogin = async () => {
    if (!phoneNumber || !password) {
      alert('Please enter both phone number and password');
      return;
    }

    setIsLoading(true);
    
    try {
      // TODO: Implement actual authentication
      // For demo, navigate to tabs after "successful" login
      setTimeout(() => {
        router.replace('/(tabs)');
      }, 500);
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkipLogin = () => {
    // For demo purposes - skip to main app
    router.replace('/(tabs)');
  };

  return (
    <KeyboardAvoidingView 
      style={[styles.container, { backgroundColor: theme.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={[styles.logoContainer, { backgroundColor: COLORS.primary }]}>
            <Text style={styles.logoIcon}>🗑️</Text>
          </View>
          <Text style={[styles.title, { color: theme.text }]}>Welcome to BinGo</Text>
          <Text style={[styles.subtitle, { color: COLORS.muted }]}>Sign in to continue</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          {/* Phone Number Input */}
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: theme.text }]}>Phone Number</Text>
            <TextInput
              style={[
                styles.input, 
                { 
                  backgroundColor: theme.inputBg, 
                  borderColor: theme.border,
                  color: theme.text 
                }
              ]}
              placeholder="Enter your phone number"
              placeholderTextColor={COLORS.muted}
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
              autoComplete="tel"
            />
          </View>

          {/* Password Input */}
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: theme.text }]}>Password</Text>
            <TextInput
              style={[
                styles.input, 
                { 
                  backgroundColor: theme.inputBg, 
                  borderColor: theme.border,
                  color: theme.text 
                }
              ]}
              placeholder="Enter your password"
              placeholderTextColor={COLORS.muted}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoComplete="password"
            />
          </View>

          {/* Forgot Password */}
          <TouchableOpacity 
            style={styles.forgotPassword}
            onPress={() => router.push('/forgot-password')}
          >
            <Text style={[styles.forgotPasswordText, { color: COLORS.primary }]}>Forgot Password?</Text>
          </TouchableOpacity>

          {/* Login Button */}
          <TouchableOpacity 
            style={[
              styles.loginButton, 
              isLoading && styles.loginButtonDisabled,
              { backgroundColor: COLORS.primary }
            ]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            <Text style={styles.loginButtonText}>
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Text>
          </TouchableOpacity>

          {/* Skip for Demo */}
          <TouchableOpacity 
            style={styles.skipButton}
            onPress={handleSkipLogin}
          >
            <Text style={[styles.skipButtonText, { color: COLORS.muted }]}>Skip (Demo)</Text>
          </TouchableOpacity>
        </View>

        {/* Sign Up Link */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: COLORS.muted }]}>Don&apos;t have an account?</Text>
          <TouchableOpacity>
            <Text style={[styles.signUpText, { color: COLORS.primary }]} onPress={() => router.push('/onboarding')}> Sign Up</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  logoIcon: {
    fontSize: 36,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
  },
  form: {
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontSize: 14,
    fontWeight: '500',
  },
  loginButton: {
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  skipButton: {
    marginTop: 12,
    alignItems: 'center',
  },
  skipButtonText: {
    fontSize: 14,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
  },
  signUpText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
