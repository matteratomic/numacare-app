import { useState } from 'react';
import { Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Screen } from '@/components/ui/Screen';
import { useAuth } from '@/context/AuthContext';
import { StatusBar } from 'expo-status-bar';

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState('dr.patel@numacare.com');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = () => {
    if (!email.trim() || !password.trim()) {
      setMessage('Enter an email and password to access the portal mock-up.');
      return;
    }

    login({ email: email.trim(), password });
    router.replace('/(tabs)');
  };

  return (
    <Screen>
      <StatusBar backgroundColor="#0ea5e9" />
      <View
        style={{ marginTop: 32 }}
        className="gap-6">
        <View className="gap-3">
          <Text className="text-4xl font-semibold text-slate-900 dark:text-slate-100">Sign in</Text>
          <Text className="text-base text-slate-600 dark:text-slate-400">
            Use your credentials to sign in and explore the NumaCare app
          </Text>
        </View>

        <Card>
          <View className="">
            <Input
              label="Email"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
              placeholder="you@clinic.com"
            />
            <View className="mt-4"></View>
            <Input
              label="Password"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
            />
            {message && <Text style={{ color: "rgba(255,255,255,0)" }} className="text-sm">{message}</Text>}
            <Text style={{ color: "rgba(255,255,255,0)" }} className="text-sm">
              Enter an email and password to access the portal mock-up.
            </Text>
            <Button onPress={handleSubmit}>Enter portal</Button>
          </View>
        </Card>

        <Card
          title="Need a tour?"
          description="Review the onboarding highlights to see how NumaCare automates delivery."
        />
      </View>
    </Screen>
  );
}
