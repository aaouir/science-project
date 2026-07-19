import React from 'react';
import { View } from 'react-native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider, useAuth } from '../src/context/AuthContext';
import { DrawerProvider } from '../src/context/DrawerContext';
import { SideDrawer } from '../src/components/SideDrawer';
import { useTheme } from '../src/theme';

function RootNavigator() {
  const { session, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  React.useEffect(() => {
    if (loading) return;
    const inAuthGroup = segments[0] === 'login';
    if (!session && !inAuthGroup) {
      router.replace('/login');
    } else if (session && inAuthGroup) {
      router.replace('/(tabs)');
    }
  }, [session, loading, segments]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="contact/[id]" />
      <Stack.Screen name="contact/add" />
      <Stack.Screen name="news/index" />
      <Stack.Screen name="news/compose" />
      <Stack.Screen name="followups/index" />
      <Stack.Screen name="settings/index" />
      <Stack.Screen name="notifications/index" />
      <Stack.Screen name="network-ai" />
    </Stack>
  );
}

export default function RootLayout() {
  const theme = useTheme();
  return (
    <AuthProvider>
      <DrawerProvider>
        <View style={{ flex: 1, backgroundColor: theme.paper }}>
          <StatusBar style="auto" />
          <RootNavigator />
          <SideDrawer />
        </View>
      </DrawerProvider>
    </AuthProvider>
  );
}
