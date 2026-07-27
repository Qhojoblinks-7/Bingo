import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Alert, Image } from 'react-native';
import { useRouter, useNavigation } from 'expo-router';
import { BinGoInput } from '../components/BinGoInput';
import { BinGoButton } from '../components/BinGoButton';
import { COLORS } from '../constants/Colors';
import { useAppTheme } from '../hooks/useThemeContext';
import { useUserStore } from '../stores';

export default function SignUp() {
  const router = useRouter();
  const navigation = useNavigation();
  const { isDark } = useAppTheme();
  const { register } = useUserStore();

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);
  
  const theme = isDark ? COLORS.dark : COLORS.light;
  
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = async () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      const result = await register(email.trim(), password, fullName.trim());
      
      if (result.success) {
        Alert.alert(
          'Account Created!',
          'Please check your email to verify your account.',
          [
            {
              text: 'Verify Now',
              onPress: () => router.replace(`/verify-email?email=${encodeURIComponent(email)}`),
            },
          ]
        );
      } else {
        Alert.alert('Sign Up Failed', result.error || 'Please check your details and try again.');
      }
    } catch (_error) {
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    content: {
      flexGrow: 1,
      padding: 24,
      paddingTop: 40,
      justifyContent: 'center',
    },
    logoContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 24,
    },
    logoImage: {
      width: 140,
      height: 140,
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
      backgroundColor: theme.inputBg,
      borderColor: theme.border,
      color: theme.text,
    },
    inputError: {
      borderColor: COLORS.error,
    },
    errorText: {
      color: COLORS.error,
      fontSize: 12,
      marginTop: 4,
    },
    button: {
      marginBottom: 24,
      marginTop: 8,
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
    termsText: {
      fontSize: 12,
      textAlign: 'center',
      marginBottom: 24,
      lineHeight: 18,
    },
  });

  return (
    <KeyboardAvoidingView 
      style={[styles.container, { backgroundColor: theme.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        {/* Logo */}
        <View style={styles.logoContainer}>
          <Image
            source={require('../assets/images/logo2.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>

          {/* Full Name Input */}
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: theme.text }]}>Full Name</Text>
            <BinGoInput
              placeholder="Enter your full name"
              value={fullName}
              onChangeText={(text) => {
                setFullName(text);
                if (errors.fullName) setErrors({ ...errors, fullName: '' });
              }}
              leftIcon="person-outline"
              error={errors.fullName}
            />
          </View>

          {/* Email Input */}
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: theme.text }]}>Email Address</Text>
            <BinGoInput
              placeholder="Enter your email"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (errors.email) setErrors({ ...errors, email: '' });
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              leftIcon="mail-outline"
              error={errors.email}
            />
          </View>

          {/* Password Input */}
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: theme.text }]}>Password</Text>
            <BinGoInput
              placeholder="Create a password"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (errors.password) setErrors({ ...errors, password: '' });
              }}
              secureTextEntry
              leftIcon="lock-closed-outline"
              error={errors.password}
            />
          </View>

          {/* Confirm Password Input */}
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: theme.text }]}>Confirm Password</Text>
            <BinGoInput
              placeholder="Confirm your password"
              value={confirmPassword}
              onChangeText={(text) => {
                setConfirmPassword(text);
                if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: '' });
              }}
              secureTextEntry
              leftIcon="lock-closed-outline"
              error={errors.confirmPassword}
            />
          </View>

          {/* Terms */}
          <Text style={[styles.termsText, { color: COLORS.muted }]}>
            By creating an account, you agree to our Terms of Service and Privacy Policy.
          </Text>

          {/* Sign Up Button */}
          <BinGoButton
            title="Create Account"
            onPress={handleSignUp}
            loading={isLoading}
            disabled={isLoading}
            style={styles.button}
          />

          {/* Back to Login */}
          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: COLORS.muted }]}>
              Already have an account?{' '}
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
  );
}
