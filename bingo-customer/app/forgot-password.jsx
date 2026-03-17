import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { BinGoHeader } from '../components/BinGoHeader';
import { BinGoInput } from '../components/BinGoInput';
import { BinGoButton } from '../components/BinGoButton';
import { COLORS } from '../constants/Colors';
import { useAppTheme } from '../hooks/useThemeContext';

export default function ForgotPassword() {
  const router = useRouter();
  const { isDark } = useAppTheme();
  const theme = isDark ? COLORS.dark : COLORS.light;
  
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState('');

  const validateEmail = () => {
    if (!email.trim()) {
      setEmailError('Email is required');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email');
      return false;
    }
    setEmailError('');
    return true;
  };

  const handleSubmit = async () => {
    if (!validateEmail()) return;
    
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In production, this would call the Django API
      Alert.alert(
        'Reset Link Sent!',
        `We've sent a password reset link to ${email}. Please check your inbox and follow the instructions.`,
        [
          {
            text: 'OK',
            onPress: () => router.replace('/login'),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to send reset link. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <BinGoHeader 
        title="Reset Password" 
        showBack={true} 
        onBack={() => router.back()} 
      />

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView 
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          {/* Icon */}
          <View style={styles.iconContainer}>
            <View style={[styles.iconCircle, { backgroundColor: COLORS.primary + '15' }]}>
              <Ionicons name="lock-closed" size={40} color={COLORS.primary} />
            </View>
          </View>

          {/* Title */}
          <Text style={[styles.title, { color: theme.text }]}>
            Forgot your password?
          </Text>
          
          {/* Subtitle */}
          <Text style={[styles.subtitle, { color: COLORS.muted }]}>
            Enter your email address and we&apos;ll send you a link to reset your password.
          </Text>

          {/* Email Input */}
          <View style={styles.inputContainer}>
            <BinGoInput
              label="Email Address"
              placeholder="Enter your email"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (emailError) setEmailError('');
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              error={emailError}
              leftIcon="mail-outline"
            />
          </View>

          {/* Submit Button */}
          <BinGoButton
            title="Send Reset Link"
            onPress={handleSubmit}
            loading={isLoading}
            disabled={isLoading}
            style={styles.button}
          />

          {/* Or use OTP instead */}
          <View style={styles.orContainer}>
            <View style={[styles.orLine, { backgroundColor: theme.border }]} />
            <Text style={[styles.orText, { color: COLORS.muted }]}>or</Text>
            <View style={[styles.orLine, { backgroundColor: theme.border }]} />
          </View>

          {/* Use OTP Button */}
          <BinGoButton
            title="Verify with OTP Instead"
            onPress={() => router.push(`/verify-email?email=${encodeURIComponent(email)}`)}
            variant="outline"
            disabled={!email.trim()}
            style={styles.otpButton}
          />

          {/* Back to Login */}
          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: COLORS.muted }]}>
              Remember your password?{' '}
            </Text>
            <Text 
              style={[styles.linkText, { color: COLORS.primary }]}
              onPress={() => router.replace('/login')}
            >
              Sign In
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    padding: 24,
    paddingTop: 40,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  inputContainer: {
    marginBottom: 24,
  },
  button: {
    marginBottom: 24,
  },
  orContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  orLine: {
    flex: 1,
    height: 1,
  },
  orText: {
    marginHorizontal: 12,
    fontSize: 12,
  },
  otpButton: {
    marginBottom: 24,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
  },
  linkText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
