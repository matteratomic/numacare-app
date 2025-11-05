import { useMemo, useState } from 'react';
import { Text, View, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Screen } from '@/components/ui/Screen';
import { useAuth } from '@/context/AuthContext';
import { StatusBar } from 'expo-status-bar';

const slides = [
  {
    key: 'doctor-automation',
    eyebrow: 'Physician intake',
    image: require("../assets/images/physician-intake.png"),
    title: 'Upload once, notify everyone',
    description:
      'Doctors share prescriptions or clinical notes, and NumaCare routes everything to the right stakeholder instantly.',
    bullets: [
      'Auto-create cases with pre-populated insurance packets',
      'Send contextual alerts to pre-auth without manual follow-up',
      'Keep the physician inbox clear with timeline updates',
    ],
  },
  {
    key: 'insurance-collab',
    eyebrow: 'Insurance coordination',
    image: require("../assets/images/patient-delight.png"),
    title: 'Track responses outside the portal',
    description:
      'Portal automation forwards documents, captures email replies, and highlights any blockers that need human review.',
    bullets: [
      'Log outbound packets and insurer replies in one audit trail',
      'Flag denials or missing documentation for quick doctor action',
      'Upload EOBs and draft patient-ready summaries in seconds',
    ],
  },
  {
    key: 'patient-experience',
    eyebrow: 'Patient delight',
    image: require("../assets/images/insurance-coordination.png"),
    title: 'Close the loop with clear next steps',
    description:
      'Share approved costs, payment links, and pickup scheduling in a single notice so patients finish the journey effortlessly.',
    bullets: [
      'Auto-generate patient emails with copay details and links',
      'Track fulfillment milestones and alert the physician once complete',
      'Keep every stakeholder aligned from prescription to delivery',
    ],
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const { completeOnboarding } = useAuth();

  const [index, setIndex] = useState(0);
  const slide = slides[index];
  const isFirst = index === 0;
  const isLast = index === slides.length - 1;

  const primaryLabel = useMemo(
    () => (isLast ? 'Continue with login' : 'Next'),
    [isLast],
  );

  const handleNext = () => {
    if (isLast) {
      completeOnboarding();
      router.replace('/login');
      return;
    }

    setIndex((prev) => Math.min(prev + 1, slides.length - 1));
  };

  const handlePrev = () => {
    setIndex((prev) => Math.max(prev - 1, 0));
  };

  return (
    <Screen>
      <StatusBar backgroundColor="#0ea5e9" />
      <View
        style={{ marginTop: 32 }}
        className="gap-8">
        <View className="gap-3">
          <Text style={{width:"70%"}} className="text-4xl font-semibold text-slate-900 dark:text-slate-100">Welcome to NumaCare</Text>
          <Text className="text-base text-slate-600 dark:text-slate-400">
            Explore how the portal coordinates doctors, insurance partners, and patients.
          </Text>
        </View>
        <Card>
          <View className="gap-6">
            <View className="gap-2">
              <Image style={{ width: '100%', height: 200 }} source={slide.image} />
              <Text className="text-xs font-semibold uppercase tracking-wide text-sky-600 dark:text-sky-300">
                {slide.eyebrow}
              </Text>
              <Text className="text-2xl font-semibold text-slate-900 dark:text-slate-100">{slide.title}</Text>
              <Text className="text-sm text-slate-600 dark:text-slate-400">{slide.description}</Text>
            </View>

            <View className="flex-row justify-center gap-2">
              {slides.map((item, idx) => {
                const active = idx === index;
                return (
                  <View
                    key={item.key}
                    className={`h-2.5 rounded-full ${active ? 'w-8 bg-sky-500 dark:bg-sky-300' : 'w-2.5 bg-slate-300 dark:bg-slate-700'
                      }`}
                  />
                );
              })}
            </View>
          </View>
        </Card>

        <View style={{ marginTop: 32 }} className="flex-row justify-between">
          <Button
            variant="outline"
            onPress={handlePrev}
            disabled={isFirst}
            className="min-w-[140px]">
            Previous
          </Button>
          <Button variant={isLast ? 'primary' : 'secondary'} onPress={handleNext} className="min-w-[160px]">
            {primaryLabel}
          </Button>
        </View>
      </View>
    </Screen>
  );
}
