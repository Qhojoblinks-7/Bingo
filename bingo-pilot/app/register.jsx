// BinGo Pilot - Registration Screen
// Pilot onboarding/registration
import React, { useState } from 'react';
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

export default function RegisterScreen() {
  const router = useRouter();
  const { register, isLoading, error, clearError } = useAuthStore();

  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    vehicleType: 'car',
    licenseNumber: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // Update form field
  const updateField = (field, value) => {
    setFormData({ ...formData, [field]: value });
    if (formErrors[field]) {
      setFormErrors({ ...formErrors, [field]: null });
    }
  };

  // Validate form
  const validateForm = () => {
    const errors = {};
    
    if (!formData.firstName.trim()) {
      errors.firstName = 'First name is required';
    }
    
    if (!formData.lastName.trim()) {
      errors.lastName = 'Last name is required';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email';
    }
    
    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!/^\+?[\d\s-]{10,}$/.test(formData.phone.replace(/\s/g, ''))) {
      errors.phone = 'Please enter a valid phone number';
    }
    
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    }
    
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    if (!agreedToTerms) {
      errors.terms = 'You must agree to the terms and conditions';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle registration
  const handleRegister = async () => {
    // Clear previous errors
    clearError();
    setFormErrors({});
    
    if (!validateForm()) {
      if (formErrors.terms) {
        Alert.alert('Terms Required', 'Please agree to the terms and conditions to continue.');
      }
      return;
    }

    const pilotData = {
      email: formData.email.trim(),
      password: formData.password,
      first_name: formData.firstName.trim(),
      last_name: formData.lastName.trim(),
      phone: formData.phone.trim(),
      vehicle_type: formData.vehicleType,
      license_number: formData.licenseNumber.trim(),
    };

    const result = await register(pilotData);
    
    if (result.success) {
      if (result.requiresVerification) {
        // Needs email verification
        Alert.alert(
          'Registration Successful',
          'Please check your email to verify your account before logging in.',
          [
            {
              text: 'OK',
              onPress: () => router.replace('/login'),
            },
          ]
        );
      } else {
        // Automatically logged in
        router.replace('/(tabs)');
      }
    } else {
      // Show error alert
      Alert.alert('Registration Failed', result.error || 'Please try again.');
    }
  };

  // Navigate to login
  const handleLogin = () => {
    router.back();
  };

  // Vehicle type options
  const vehicleTypes = [
    { value: 'car', label: '🚗 Car' },
    { value: 'motorcycle', label: '🏍️ Motorcycle' },
    { value: 'bicycle', label: '🚴 Bicycle' },
  ];

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
          <Text style={styles.title}>Join BinGo</Text>
          <Text style={styles.subtitle}>Create your pilot account</Text>
        </View>

        {/* Form Section */}
        <View style={styles.form}>
          {/* Name Row */}
          <View style={styles.nameRow}>
            <View style={styles.nameField}>
              <InputField
                label="First Name"
                value={formData.firstName}
                onChangeText={(text) => updateField('firstName', text)}
                placeholder="John"
                autoCapitalize="words"
                error={formErrors.firstName}
              />
            </View>
            <View style={styles.nameField}>
              <InputField
                label="Last Name"
                value={formData.lastName}
                onChangeText={(text) => updateField('lastName', text)}
                placeholder="Doe"
                autoCapitalize="words"
                error={formErrors.lastName}
              />
            </View>
          </View>

          {/* Email Input */}
          <InputField
            label="Email Address"
            value={formData.email}
            onChangeText={(text) => updateField('email', text)}
            placeholder="pilot@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            error={formErrors.email}
            leftIcon={<Text style={styles.inputIcon}>📧</Text>}
          />

          {/* Phone Input */}
          <InputField
            label="Phone Number"
            value={formData.phone}
            onChangeText={(text) => updateField('phone', text)}
            placeholder="+1 234 567 8900"
            keyboardType="phone-pad"
            error={formErrors.phone}
            leftIcon={<Text style={styles.inputIcon}>📱</Text>}
          />

          {/* Vehicle Type */}
          <View style={styles.vehicleContainer}>
            <Text style={styles.label}>Vehicle Type</Text>
            <View style={styles.vehicleOptions}>
              {vehicleTypes.map((type) => (
                <TouchableOpacity
                  key={type.value}
                  style={[
                    styles.vehicleOption,
                    formData.vehicleType === type.value && styles.vehicleOptionSelected,
                  ]}
                  onPress={() => updateField('vehicleType', type.value)}
                >
                  <Text
                    style={[
                      styles.vehicleOptionText,
                      formData.vehicleType === type.value && styles.vehicleOptionTextSelected,
                    ]}
                  >
                    {type.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* License Number */}
          <InputField
            label="License Number (Optional)"
            value={formData.licenseNumber}
            onChangeText={(text) => updateField('licenseNumber', text)}
            placeholder="DL-123456789"
            autoCapitalize="characters"
            error={formErrors.licenseNumber}
            leftIcon={<Text style={styles.inputIcon}>🔖</Text>}
          />

          {/* Password Input */}
          <InputField
            label="Password"
            value={formData.password}
            onChangeText={(text) => updateField('password', text)}
            placeholder="Create a strong password"
            secureTextEntry
            error={formErrors.password}
            leftIcon={<Text style={styles.inputIcon}>🔒</Text>}
          />

          {/* Confirm Password Input */}
          <InputField
            label="Confirm Password"
            value={formData.confirmPassword}
            onChangeText={(text) => updateField('confirmPassword', text)}
            placeholder="Confirm your password"
            secureTextEntry
            error={formErrors.confirmPassword}
            leftIcon={<Text style={styles.inputIcon}>🔒</Text>}
          />

          {/* Terms Checkbox */}
          <TouchableOpacity
            style={styles.termsContainer}
            onPress={() => setAgreedToTerms(!agreedToTerms)}
          >
            <View style={[styles.checkbox, agreedToTerms && styles.checkboxChecked]}>
              {agreedToTerms && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={styles.termsText}>
              I agree to the{' '}
              <Text style={styles.termsLink}>Terms of Service</Text> and{' '}
              <Text style={styles.termsLink}>Privacy Policy</Text>
            </Text>
          </TouchableOpacity>
          {formErrors.terms && (
            <Text style={styles.errorText}>{formErrors.terms}</Text>
          )}

          {/* Register Button */}
          <BinGoButton
            title="Create Account"
            onPress={handleRegister}
            loading={isLoading}
            fullWidth
            size="lg"
            style={styles.registerButton}
          />
        </View>

        {/* Login Link */}
        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>Already have an account? </Text>
          <TouchableOpacity onPress={handleLogin}>
            <Text style={styles.loginLink}>Sign In</Text>
          </TouchableOpacity>
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
    marginBottom: SPACING.xl,
  },
  title: {
    fontSize: TYPOGRAPHY.fontSize.xl + 4,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.white,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.muted,
  },
  form: {
    marginBottom: SPACING.lg,
  },
  nameRow: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  nameField: {
    flex: 1,
  },
  inputIcon: {
    fontSize: 18,
  },
  label: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  vehicleContainer: {
    marginBottom: SPACING.md,
  },
  vehicleOptions: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  vehicleOption: {
    flex: 1,
    paddingVertical: SPACING.sm + 2,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    backgroundColor: COLORS.inputBackground,
  },
  vehicleOptionSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary + '20',
  },
  vehicleOptionText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.muted,
  },
  vehicleOptionTextSelected: {
    color: COLORS.primary,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.lg,
    marginTop: SPACING.sm,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: BORDER_RADIUS.xs,
    borderWidth: 2,
    borderColor: COLORS.border,
    marginRight: SPACING.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  checkmark: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: 'bold',
  },
  termsText: {
    flex: 1,
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.muted,
    lineHeight: 20,
  },
  termsLink: {
    color: COLORS.primary,
  },
  errorText: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.error,
    marginTop: -SPACING.sm,
    marginBottom: SPACING.md,
  },
  registerButton: {
    marginTop: SPACING.sm,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.muted,
  },
  loginLink: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.primary,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
  },
});
