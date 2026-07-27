import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Alert, TextInput, Image } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { BinGoHeader } from '../components/BinGoHeader';
import { BinGoButton } from '../components/BinGoButton';
import { COLORS } from '../constants/Colors';
import { useAppTheme } from '../hooks/useThemeContext';
import { supabase } from '../lib/supabase';

export default function VerifyEmail() {
  const router = useRouter();
  const { isDark } = useAppTheme();
  const theme = isDark ? COLORS.dark : COLORS.light;
  
  const { email } = useLocalSearchParams();
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef([]);

  // Countdown timer for resend
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => {
        setResendTimer(resendTimer - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [resendTimer]);

  const handleCodeChange = (value, index) => {
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    const fullCode = newCode.join('');
    if (fullCode.length === 6) {
      handleVerify(fullCode);
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async (verificationCode) => {
    if (!verificationCode || verificationCode.length !== 6) {
      Alert.alert('Error', 'Please enter the complete 6-digit code');
      return;
    }

    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.verifyOtp({
        type: 'signup',
        token: verificationCode,
        email: email,
      });

      if (error) throw error;

      Alert.alert(
        'Email Verified!',
        'Your email has been successfully verified.',
        [
          {
            text: 'Continue',
            onPress: () => router.replace('/(tabs)'),
          },
        ]
      );
    } catch (_error) {
      Alert.alert('Error', 'Invalid verification code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend || !email) return;
    
    setResendTimer(60);
    setCanResend(false);
    
    try {
      const { error } = await supabase.auth.resend({ type: 'signup', email: email });
      if (error) throw error;

      Alert.alert('Code Resent', `A new verification code has been sent to ${email}.`);
    } catch (_error) {
      Alert.alert('Error', 'Failed to resend code. Please try again.');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <BinGoHeader 
        title="Verify Email" 
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
          {/* Logo */}
          <View style={styles.logoContainer}>
            <Image
              source={require('../assets/images/logo2.png')}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>

          {/* Title */}
          <Text style={[styles.title, { color: theme.text }]}>
            Check your email
          </Text>
          
          {/* Subtitle */}
          <Text style={[styles.subtitle, { color: COLORS.muted }]}>
            We&apos;ve sent a 6-digit verification code to{'\n'}
            <Text style={{ color: COLORS.primary, fontWeight: '600' }}>
              {email || 'your email'}
            </Text>
          </Text>

          {/* OTP Inputs */}
          <View style={styles.otpContainer}>
            {code.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => { inputRefs.current[index] = ref; }}
                style={[
                  styles.otpInput,
                  { 
                    backgroundColor: theme.card,
                    borderColor: digit ? COLORS.primary : theme.border 
                  }
                ]}
                value={digit}
                onChangeText={(text) => handleCodeChange(text, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                maxLength={1}
                keyboardType="number-pad"
                textContentType="oneTimeCode"
                selectTextOnFocus
              />
            ))}
          </View>

          {/* Verify Button */}
          <BinGoButton
            title="Verify Email"
            onPress={() => handleVerify()}
            loading={isLoading}
            disabled={isLoading}
            style={styles.button}
          />

          {/* Resend Timer */}
          <View style={styles.resendContainer}>
            {canResend ? (
              <View style={styles.resendRow}>
                <Text style={[styles.resendText, { color: COLORS.muted }]}>
                  Didn&apos;t receive the code?{' '}
                </Text>
                <Text 
                  style={[styles.resendLink, { color: COLORS.primary }]}
                  onPress={handleResend}
                >
                  Resend
                </Text>
              </View>
            ) : (
              <Text style={[styles.timerText, { color: COLORS.muted }]}>
                Resend code in {resendTimer}s
              </Text>
            )}
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
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 24,
  },
  otpInput: {
    width: 48,
    height: 56,
    borderRadius: 12,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  otpText: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
  },
  hiddenInputs: {
    position: 'absolute',
    opacity: 0,
    height: 0,
  },
  button: {
    marginBottom: 24,
  },
  resendContainer: {
    alignItems: 'center',
  },
  resendRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  resendText: {
    fontSize: 14,
  },
  resendLink: {
    fontSize: 14,
    fontWeight: '600',
  },
  timerText: {
    fontSize: 14,
  },
});
