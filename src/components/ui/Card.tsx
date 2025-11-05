import { MaterialCommunityIcons } from '@expo/vector-icons';
import { PropsWithChildren, ReactNode } from 'react';
import { Text, View } from 'react-native';

interface CardProps extends PropsWithChildren {
  title?: string;
  icon?: any;
  description?: string;
  actions?: ReactNode;
  tone?: 'default' | 'success' | 'warning' | 'danger';
  className?: string;
}

const toneStyles: Record<NonNullable<CardProps['tone']>, string> = {
  // default: 'border-slate-200/80 dark:border-slate-800/80',
  default: 'border-sky-500',
  success: 'border-emerald-400/60 dark:border-emerald-500/60',
  warning: 'border-amber-300/60 dark:border-amber-400/60',
  danger: 'border-rose-400/60 dark:border-rose-500/60',
};

export function Card({
  title,
  description,
  actions,
  icon,
  tone = 'default',
  children,
  className,
}: CardProps) {
  return (
    <View
      className={`flex-row rounded-2xl border bg-white/90 p-5 shadow-sm dark:bg-slate-900/70 ${toneStyles[tone]} ${className ?? ''}`.trim()}>
      {icon && <View className="bg-sky-500" style={{
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 12,
        width: 48, height: 48,
        marginRight: 16
      }}>
        <MaterialCommunityIcons name={icon} size={24} color="white" />
      </View>
      }
      <View className="gap-3">
        {(title || description) && (
          <View className="gap-1">
            {title && (
              <Text
                style={{
                  fontSize: icon ? 20 : 16
                }}
                className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                {title}
              </Text>
            )}
            {description && (
              <Text className="text-sm text-slate-500 dark:text-slate-400">{description}</Text>
            )}
          </View>
        )}
        {children}
        {actions && <View className="mt-2 flex-row flex-wrap gap-3">{actions}</View>}
      </View>
    </View>
  );
}
