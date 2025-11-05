import { ReactNode } from 'react';
import { Text, View } from 'react-native';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}

export function SectionHeader({ title, subtitle, action }: SectionHeaderProps) {
  return (
    <View className="mb-2 flex-row items-center justify-between">
      <View className="max-w-[75%]">
        <Text className="text-lg font-semibold text-slate-900 dark:text-slate-100">{title}</Text>
        {subtitle && <Text className="text-sm text-slate-400 dark:text-slate-400">{subtitle}</Text>}
      </View>
      {action && <View className="ml-3">{action}</View>}
    </View>
  );
}
