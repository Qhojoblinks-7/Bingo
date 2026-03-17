import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { BinGoHeader } from '@/components/BinGoHeader';
import { BinGoInput } from '@/components/BinGoInput';
import { BinGoButton } from '@/components/BinGoButton';
import { useAppTheme } from '@/hooks/useThemeContext';

export default function ChangePassword() {
  const router = useRouter();
  const { isDark } = useAppTheme();
  
  const colors = isDark ? {
    background: '#121212',
    card: '#1E1E1E',
    text: '#FFFFFF',
    muted: '#A0A0A0',
    primary: '#10B981',
    white: '#FFFFFF',
    border: '#333333',
    inputBg: '#2A2A2A',
  } : {
    background: '#F9FAFB',
    card: '#FFFFFF',
    text: '#111827',
    muted: '#6B7280',
    primary: '#10B981',
    white: '#FFFFFF',
    border: '#E5E7EB',
    inputBg: '#F3F4F6',
  };

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validatePassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return regex.test(password);
  };

  const handleSubmit = () => {
    if (!currentPassword) {
      Alert.alert('Error', 'Please enter your current password');
      return;
    }

    if (!newPassword) {
      Alert.alert('Error', 'Please enter a new password');
      return;
    }

    if (!validatePassword(newPassword)) {
      Alert.alert(
        'Weak Password',
        'Password must be at least 8 characters with 1 uppercase letter and 1 number'
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'New passwords do not match');
      return;
    }

    if (currentPassword === newPassword) {
      Alert.alert('Error', 'New password must be different from current password');
      return;
    }

    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert(
        'Success',
        'Your password has been changed successfully',
        [
          {
            text: 'OK',
            onPress: () => router.back()
          }
        ]
      );
    }, 1500);
  };

  const styles = useMemo(() => StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      padding: 20,
      paddingBottom: 40,
    },
    infoCard: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 10,
      backgroundColor: isDark ? '#1A3A2A' : '#F0FDF4',
      padding: 14,
      borderRadius: 12,
      marginBottom: 20,
    },
    infoText: {
      flex: 1,
      fontSize: 13,
      color: colors.text,
      lineHeight: 18,
    },
    requirementsCard: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 16,
      marginBottom: 24,
      borderWidth: 1,
      borderColor: colors.border,
    },
    requirementsTitle: {
      fontSize: 14,
      fontWeight: '700',
      color: colors.text,
      marginBottom: 12,
    },
    requirementRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginBottom: 8,
    },
    requirementText: {
      fontSize: 13,
      color: colors.muted,
    },
    formSection: {
      marginBottom: 24,
    },
    inputLabel: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 8,
      marginTop: 16,
    },
    showPassword: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      marginTop: 8,
      marginBottom: 8,
    },
    showPasswordText: {
      fontSize: 13,
      color: colors.primary,
      fontWeight: '600',
    },
    buttonSection: {
      gap: 12,
    },
  }), [colors, isDark]);

  return (
    <View style={styles.container}>
      <BinGoHeader 
        title="Change Password" 
        showBack 
      />

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.infoCard}>
          <Ionicons name="information-circle" size={20} color={colors.primary} />
          <Text style={styles.infoText}>
            For your security, password changes require you to log in again on all devices
          </Text>
        </View>

        <View style={styles.requirementsCard}>
          <Text style={styles.requirementsTitle}>Password Requirements</Text>
          <View style={styles.requirementRow}>
            <Ionicons name="checkmark-circle" size={16} color={colors.muted} />
            <Text style={styles.requirementText}>At least 8 characters</Text>
          </View>
          <View style={styles.requirementRow}>
            <Ionicons name="checkmark-circle" size={16} color={colors.muted} />
            <Text style={styles.requirementText}>At least 1 uppercase letter (A-Z)</Text>
          </View>
          <View style={styles.requirementRow}>
            <Ionicons name="checkmark-circle" size={16} color={colors.muted} />
            <Text style={styles.requirementText}>At least 1 number (0-9)</Text>
          </View>
        </View>

        <View style={styles.formSection}>
          <Text style={styles.inputLabel}>Current Password</Text>
          <BinGoInput
            value={currentPassword}
            onChangeText={setCurrentPassword}
            placeholder="Enter current password"
            secureTextEntry={!showCurrent}
            editable={true}
          />
          <Pressable 
            style={styles.showPassword}
            onPress={() => setShowCurrent(!showCurrent)}
          >
            <Ionicons 
              name={showCurrent ? 'eye-off' : 'eye'} 
              size={18} 
              color={colors.muted} 
            />
            <Text style={styles.showPasswordText}>
              {showCurrent ? 'Hide' : 'Show'} password
            </Text>
          </Pressable>

          <Text style={styles.inputLabel}>New Password</Text>
          <BinGoInput
            value={newPassword}
            onChangeText={setNewPassword}
            placeholder="Enter new password"
            secureTextEntry={!showNew}
            editable={true}
          />
          <Pressable 
            style={styles.showPassword}
            onPress={() => setShowNew(!showNew)}
          >
            <Ionicons 
              name={showNew ? 'eye-off' : 'eye'} 
              size={18} 
              color={colors.muted} 
            />
            <Text style={styles.showPasswordText}>
              {showNew ? 'Hide' : 'Show'} password
            </Text>
          </Pressable>

          <Text style={styles.inputLabel}>Confirm New Password</Text>
          <BinGoInput
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Confirm new password"
            secureTextEntry={!showConfirm}
            editable={true}
          />
          <Pressable 
            style={styles.showPassword}
            onPress={() => setShowConfirm(!showConfirm)}
          >
            <Ionicons 
              name={showConfirm ? 'eye-off' : 'eye'} 
              size={18} 
              color={colors.muted} 
            />
            <Text style={styles.showPasswordText}>
              {showConfirm ? 'Hide' : 'Show'} password
            </Text>
          </Pressable>
        </View>

        <View style={styles.buttonSection}>
          <BinGoButton
            title="Update Password"
            onPress={handleSubmit}
            loading={isLoading}
          />
          <BinGoButton
            title="Cancel"
            onPress={() => router.back()}
            variant="outline"
          />
        </View>
      </ScrollView>
    </View>
  );
}
