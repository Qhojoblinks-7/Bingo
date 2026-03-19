import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { COLORS } from '../constants/Colors';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: COLORS.background },
          animation: 'fade',
        }}
      >
        {/* Login/Register - Full screen stack screens (no tabs) */}
        <Stack.Screen name="login" options={{ gestureEnabled: false }} />
        <Stack.Screen name="register" options={{ gestureEnabled: false }} />
        
        {/* Main app with tabs */}
        <Stack.Screen name="(tabs)" options={{ gestureEnabled: false }} />
        
        {/* Mission detail - Modal style */}
        <Stack.Screen 
          name="mission/[id]" 
          options={{ 
            presentation: 'modal',
            animation: 'slide_from_bottom',
          }} 
        />
        
        {/* Wallet screens */}
        <Stack.Screen name="wallet/DailyDetail" options={{ presentation: 'card' }} />
        <Stack.Screen name="wallet/earnings" options={{ presentation: 'card' }} />
        <Stack.Screen name="wallet/cashout" options={{ presentation: 'card' }} />
        <Stack.Screen name="wallet/BalanceDetails" options={{ presentation: 'card' }} />
      </Stack>
    </>
  );
}
