import { PropsWithChildren, ReactNode } from 'react';
import { Pressable, PressableProps, Text, View } from 'react-native';

interface ButtonProps extends Omit<PressableProps, 'children'>, PropsWithChildren {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  icon?: ReactNode;
  className?: string;
}

const variantStyles: Record<
  NonNullable<ButtonProps['variant']>,
  { container: string; text: string; border?: string }
> = {
  primary: {
    container: 'bg-sky-500 dark:bg-sky-500',
    text: 'text-white font-semibold',
  },
  secondary: {
    container: 'bg-slate-200 dark:bg-slate-800',
    text: 'text-slate-900 dark:text-slate-100 font-semibold',
  },
  ghost: {
    container: 'bg-transparent',
    text: 'text-sky-600 dark:text-sky-400 font-semibold',
  },
  outline: {
    container: 'bg-transparent',
    text: 'text-slate-900 dark:text-slate-100 font-semibold',
    border: 'border border-slate-300 dark:border-slate-700',
  },
};

export function Button({
  variant = 'primary',
  icon,
  children,
  disabled,
  className,
  ...pressableProps
}: ButtonProps) {
  const styles = variantStyles[variant];
  const opacityClass = disabled ? 'opacity-50' : 'opacity-100';

  return (
    <Pressable
      disabled={disabled}
      className={`flex-row items-center justify-center rounded-lg px-4 py-3 ${styles.container} ${styles.border ?? ''} ${opacityClass} ${className ?? ''}`.trim()}
      {...pressableProps}>
      <View className="flex-row items-center gap-2">
        {icon}
        <Text className={`text-sm ${styles.text}`}>{children}</Text>
      </View>
    </Pressable>
  );
}
