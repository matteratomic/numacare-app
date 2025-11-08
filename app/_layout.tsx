import '../global.css';

import { useEffect } from 'react';
import { Stack, useRootNavigationState, useRouter, useSegments } from 'expo-router';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AuthProvider, useAuth } from '@/context/AuthContext';
import { WorkflowProvider } from '@/context/WorkflowContext';


console.error = (error) => error.apply;
console.disableYellowBox = true;

export default function RootLayout() {
  return (
    <View style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AuthProvider>
          <WorkflowProvider>
            <AppNavigator />
          </WorkflowProvider>
        </AuthProvider>
      </SafeAreaProvider>
    </View>
  );
}

function AppNavigator() {
  // const {
  //   state: { isAuthenticated, hasCompletedOnboarding },
  // } = useAuth();
  // const segments = useSegments();
  const navigationState = useRootNavigationState();
  const router = useRouter();

  if (!navigationState?.key) {
    return null;
  }

  useEffect(() => {
    setTimeout(() => {
      if (navigationState?.key) {
        router.replace('/onboarding');
      }
    }, 50)
  }, [navigationState?.key])

  // useEffect(() => {
  //   if (!navigationState?.key) {
  //     return;
  //   }
  //
  //   const [root] = segments;
  //
  //   if (!hasCompletedOnboarding) {
  //     if (root !== 'onboarding') {
  //       router.replace('/onboarding');
  //     }
  //     return;
  //   }
  //
  //   if (!isAuthenticated) {
  //     if (root !== 'login') {
  //       router.replace('/login');
  //     }
  //     return;
  //   }
  //
  //   if (root === 'login' || root === 'onboarding' || !root) {
  //     router.replace('/(tabs)');
  //   }
  // }, [hasCompletedOnboarding, isAuthenticated, navigationState?.key, router, segments]);


  return (
    <Stack
      initialRouteName='onboarding'
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: '#030712',
        },
      }}>
      <Stack.Screen name="onboarding" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="statustracker" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen
        name="documents/[id]"
        options={{
          headerShown: true,
          title: 'Document Summary',
          headerTintColor: '#f8fafc',
          headerStyle: {
            backgroundColor: '#0f172a',
          },
        }}
      />
    </Stack>
  );
}
