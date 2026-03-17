import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { AppThemeProvider, useAppTheme } from '@/hooks/useThemeContext';
import { COLORS } from '@/constants/Colors';
import { usePushNotifications } from '@/hooks/usePushNotifications';

export const unstable_settings = {
  anchor: '(tabs)',
};

function RootLayoutContent() {
  const colorScheme = useColorScheme();
  const { resolvedScheme, isDark } = useAppTheme();
  
  // Initialize push notifications
  const { expoPushToken, notification } = usePushNotifications();
  
  // Log push token for testing
  if (expoPushToken) {
    console.log('Push token ready:', expoPushToken);
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack
        screenOptions={{
          contentStyle: { backgroundColor: isDark ? '#121212' : '#F9FAFB' },
        }}
      >
        {/* Splash Screen - Initial loading screen */}
        <Stack.Screen 
          name="index" 
          options={{ 
            headerShown: false,
            animation: 'fade',
          }} 
        />
        
        {/* Login Screen */}
        <Stack.Screen 
          name="login" 
          options={{ 
            headerShown: false,
            animation: 'fade',
          }} 
        />
        
        {/* Onboarding Screen */}
        <Stack.Screen 
          name="onboarding" 
          options={{ 
            headerShown: false,
            animation: 'fade',
          }} 
        />
        
        {/* Tab Navigation - Main app shell */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        
        {/* Stack Screens - Slide in from right for focused transactions */}
        <Stack.Screen 
          name="request/index" 
          options={{ 
            headerShown: false,
            presentation: 'card',
          }} 
        />
        <Stack.Screen 
          name="topup" 
          options={{ 
            headerShown: false,
            presentation: 'card',
          }} 
        />
        <Stack.Screen 
          name="activity/[id]" 
          options={{ 
            headerShown: false,
            presentation: 'card',
          }} 
        />
        
        {/* Chat Screen */}
        <Stack.Screen 
          name="chat/index" 
          options={{ 
            headerShown: false,
            presentation: 'card',
          }} 
        />
        
        {/* Profile Sub-Screens */}
        <Stack.Screen 
          name="profile/edit" 
          options={{ 
            headerShown: false,
            presentation: 'card',
          }} 
        />
        <Stack.Screen 
          name="profile/locations" 
          options={{ 
            headerShown: false,
            presentation: 'card',
          }} 
        />
        <Stack.Screen 
          name="profile/payments" 
          options={{ 
            headerShown: false,
            presentation: 'card',
          }} 
        />
        <Stack.Screen 
          name="profile/support" 
          options={{ 
            headerShown: false,
            presentation: 'card',
          }} 
        />
        <Stack.Screen 
          name="profile/security" 
          options={{ 
            headerShown: false,
            presentation: 'card',
          }} 
        />
        <Stack.Screen 
          name="profile/privacy" 
          options={{ 
            headerShown: false,
            presentation: 'card',
          }} 
        />
        <Stack.Screen 
          name="profile/change-password" 
          options={{ 
            headerShown: false,
            presentation: 'card',
          }} 
        />
        
        {/* Modal Layer - Center popup for confirmations */}
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar 
        style={isDark ? 'light' : 'dark'} 
        backgroundColor={isDark ? COLORS.dark.background : COLORS.light.background} 
      />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <AppThemeProvider>
      <RootLayoutContent />
    </AppThemeProvider>
  );
}
