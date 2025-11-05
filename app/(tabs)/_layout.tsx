import { Tabs } from 'expo-router';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { Platform } from 'react-native';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#38bdf8',
        tabBarInactiveTintColor: '#94a3b8',
        tabBarStyle: {
          backgroundColor: '#0f172a',
          borderTopColor: '#1e293b',
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        tabBarHideOnKeyboard: Platform.OS === 'ios',
      }}>
      <Tabs.Screen name="index" options={{
        title: 'Overview',
        tabBarIcon: ({ color, size }) => (
          <MaterialCommunityIcons name="view-dashboard" size={size} color={color} />
        ),

      }} />
      <Tabs.Screen name="doctor" options={{
        title: 'Doctor',
        tabBarIcon: ({ color, size }) => (
          <MaterialCommunityIcons name="stethoscope" size={size} color={color} />
        ),
      }} />
      <Tabs.Screen name="pre-auth" options={{
        title: 'Pre-Auth',
        tabBarIcon: ({ color, size }) => (
          <MaterialIcons name="pending-actions" size={size} color={color} />
        ),

      }} />
      <Tabs.Screen name="insurance" options={{
        title: 'Insurance',
        tabBarIcon: ({ color, size }) => (
          <MaterialCommunityIcons name="shield-account" size={size} color={color} />
        ),

      }} />
      <Tabs.Screen name="patient" options={{
        title: 'Patient',
        tabBarIcon: ({ color, size }) => (
          <MaterialIcons name="person" size={size} color={color} />
        ),

      }} />
    </Tabs>
  );
}
