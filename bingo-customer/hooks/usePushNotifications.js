import { useEffect, useRef, useState } from 'react';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

// Configure how notifications are handled
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export function usePushNotifications() {
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(null);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    // Register the device for push notifications
    async function registerForPushNotificationsAsync() {
      if (!Device.isDevice) {
        console.log('Must use physical device for Push Notifications');
        return;
      }

      // Check existing permissions
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      // Request permissions if not already granted
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.log('Failed to get push token for notifications');
        return;
      }

      // Get the push token
      try {
        const token = await Notifications.getExpoPushTokenAsync();
        setExpoPushToken(token.data);
        console.log('Push token:', token.data);
      } catch (error) {
        console.error('Error getting push token:', error);
      }
    }

    registerForPushNotificationsAsync();

    // Listen for incoming notifications
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
      console.log('Notification received:', notification);
    });

    // Listen for notification responses (when user taps)
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Notification response:', response);
    });

    return () => {
      notificationListener.current = null;
      responseListener.current = null;
    };
  }, []);

  return {
    expoPushToken,
    notification,
  };
}

// Function to schedule a local notification
export async function scheduleLocalNotification(title, body, data = {}) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: title,
      body: body,
      data: data,
      sound: true,
    },
    trigger: null, // null means send immediately
  });
}

// Function to send a test notification
export async function sendTestNotification() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'BinGo Test Notification',
      body: 'This is a test notification from BinGo!',
      sound: true,
    },
    trigger: null,
  });
}
