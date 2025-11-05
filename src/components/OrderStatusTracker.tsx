import { Text, View } from 'react-native';

interface OrderStatusTrackerProps {
  steps: ReadonlyArray<{
    key: string;
    title: string;
    description?: string;
  }>;
  currentStep: number;
  etaLabel?: string;
}

export function OrderStatusTracker({ steps, currentStep, etaLabel }: OrderStatusTrackerProps) {
  const lastIndex = steps.length - 1;

  return (
    <View className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900/70">
      <View className="flex-row items-center gap-2">
        {steps.map((step, index) => {
          const active = index <= currentStep;
          const connectorLeftActive = index > 0 && currentStep >= index - 1;
          const connectorRightActive = index < lastIndex && currentStep >= index;

          return (
            <View key={step.key} className="flex-1 items-center">
              <View className="w-full flex-row items-center">
                <View
                  className={`h-0.5 flex-1 ${
                    index === 0
                      ? 'bg-transparent'
                      : connectorLeftActive
                        ? 'bg-sky-500'
                        : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                />
                <View
                  className={`h-9 w-9 items-center justify-center rounded-full border-2 ${
                    active
                      ? 'border-sky-500 bg-sky-100 dark:bg-sky-500/20'
                      : 'border-slate-300 bg-white dark:border-slate-600 dark:bg-slate-800'
                  }`}>
                  <Text
                    className={`text-xs font-semibold ${
                      active
                        ? 'text-sky-600 dark:text-sky-100'
                        : 'text-slate-500 dark:text-slate-400'
                    }`}>
                    {index + 1}
                  </Text>
                </View>
                <View
                  className={`h-0.5 flex-1 ${
                    index === lastIndex
                      ? 'bg-transparent'
                      : connectorRightActive
                        ? 'bg-sky-500'
                        : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                />
              </View>
              <View className="mt-3 items-center px-1">
                <Text
                  className={`text-center text-xs font-semibold ${
                    active
                      ? 'text-slate-900 dark:text-slate-100'
                      : 'text-slate-500 dark:text-slate-400'
                  }`}>
                  {step.title}
                </Text>
                {step.description && (
                  <Text className="mt-1 text-center text-[11px] text-slate-500 dark:text-slate-400">
                    {step.description}
                  </Text>
                )}
              </View>
            </View>
          );
        })}
      </View>
      {etaLabel && (
        <Text className="mt-4 text-center text-sm text-slate-600 dark:text-slate-300">
          {etaLabel}
        </Text>
      )}
    </View>
  );
}
