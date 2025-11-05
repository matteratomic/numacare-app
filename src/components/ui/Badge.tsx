import { PropsWithChildren } from 'react';
import { Text, View } from 'react-native';

type BadgeTone = 'default' | 'success' | 'warning' | 'danger';

const toneStyles: Record<BadgeTone, { background: string; text: string }> = {
  default: {
    background: 'bg-slate-200/80 dark:bg-slate-800/80',
    text: 'text-slate-700 dark:text-slate-200',
  },
  success: {
    background: 'bg-emerald-100/80 dark:bg-emerald-500/15',
    text: 'text-emerald-700 dark:text-emerald-200',
  },
  warning: {
    background: 'bg-amber-100/80 dark:bg-amber-400/15',
    text: 'text-amber-700 dark:text-amber-200',
  },
  danger: {
    background: 'bg-rose-100/80 dark:bg-rose-500/15',
    text: 'text-rose-700 dark:text-rose-200',
  },
};

interface BadgeProps extends PropsWithChildren {
  tone?: BadgeTone;
  className?: string;
}

export function Badge({ tone = 'default', className, children }: BadgeProps) {
  const styles = toneStyles[tone];

  return (
    <View
      className={`flex-row items-center rounded-full px-3 py-1 ${styles.background} ${className ?? ''}`.trim()}>
      <Text className={`text-xs font-semibold uppercase tracking-wide ${styles.text}`}>
        {children}
      </Text>
    </View>
  );
}
