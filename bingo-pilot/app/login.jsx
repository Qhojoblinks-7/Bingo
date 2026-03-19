// BinGo Pilot - Login Screen
// Pilot authentication screen
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import useAuthStore from '../stores/useAuthStore';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../constants';
import BinGoButton from '../components/shared/BinGoButton';
import InputField from '../components/shared/InputField';

export default function LoginScreen() {
  const router = useRouter();
  const { login, isLoading, error, clearError } = useAuthStore();

  // Skip auth - redirect directly to tabs on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/(tabs)');
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formErrors, setFormErrors] = useState({});

  // Validate form
  const validateForm = () => {
    const errors = {};
    
    if (!email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Please enter a valid email';
    }
    
    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle login
  const handleLogin = async () => {
    // Clear previous errors
    clearError();
    setFormErrors({});
    
    if (!validateForm()) {
      return;
    }

    const result = await login(email.trim(), password);
    
    if (result.success) {
      // Navigate to home (tabs)
      router.replace('/(tabs)');
    } else {
      // Show error alert
      Alert.alert('Login Failed', result.error || 'Please check your credentials and try again.');
    }
  };

  // Navigate to registration
  const handleRegister = () => {
    router.push('/register');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header Section */}
        <View style={styles.header}>
          {/* Logo */}
          <View style={styles.logoContainer}>
            <Text style={styles.logoIcon}>🚛</Text>
          </View>
          
          {/* Welcome Text */}
          <Text style={styles.welcomeText}>Welcome Back</Text>
          <Text style={styles.subtitleText}>Sign in to start your shift</Text>
        </View>

        {/* Form Section */}
        <View style={styles.form}>
          {/* Email Input */}
          <InputField
            label="Email Address"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              if (formErrors.email) {
                setFormErrors({ ...formErrors, email: null });
              }
            }}
            placeholder="pilot@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            error={formErrors.email}
            leftIcon={<Text style={styles.inputIcon}>📧</Text>}
          />

          {/* Password Input */}
          <InputField
            label="Password"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              if (formErrors.password) {
                setFormErrors({ ...formErrors, password: null });
              }
            }}
            placeholder="Enter your password"
            secureTextEntry
            error={formErrors.password}
            leftIcon={<Text style={styles.inputIcon}>🔒</Text>}
          />

          {/* Forgot Password */}
          <TouchableOpacity
            style={styles.forgotPassword}
            onPress={() => {
              // TODO: Implement forgot password
              Alert.alert('Coming Soon', 'Password reset functionality will be available soon.');
            }}
          >
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>

          {/* Login Button */}
          <BinGoButton
            title="Sign In"
            onPress={handleLogin}
            loading={isLoading}
            fullWidth
            size="lg"
            style={styles.loginButton}
          />
        </View>

        {/* Register Link */}
        <View style={styles.registerContainer}>
          <Text style={styles.registerText}>Don't have an account? </Text>
          <TouchableOpacity onPress={handleRegister}>
            <Text style={styles.registerLink}>Sign Up</Text>
          </TouchableOpacity>
        </View>

        {/* Demo Credentials */}
        <View style={styles.demoContainer}>
          <Text style={styles.demoTitle}>Demo Credentials</Text>
          <Text style={styles.demoText}>Email: pilot@bingo.com</Text>
          <Text style={styles.demoText}>Password: demo123</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xl * 2,
    paddingBottom: SPACING.xl,
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: BORDER_RADIUS.lg,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.lg,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 8,
  },
  logoIcon: {
    fontSize: 40,
  },
  welcomeText: {
    fontSize: TYPOGRAPHY.fontSize.xl + 4,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.white,
    marginBottom: SPACING.xs,
  },
  subtitleText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.muted,
  },
  form: {
    marginBottom: SPACING.lg,
  },
  inputIcon: {
    fontSize: 18,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: SPACING.lg,
    marginTop: SPACING.xs,
  },
  forgotPasswordText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.primary,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  },
  loginButton: {
    marginTop: SPACING.sm,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SPACING.md,
  },
  registerText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.muted,
  },
  registerLink: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.primary,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
  },
  demoContainer: {
    marginTop: SPACING.xl,
    padding: SPACING.md,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
  },
  demoTitle: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.primary,
    marginBottom: SPACING.xs,
  },
  demoText: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.muted,
  },
});
