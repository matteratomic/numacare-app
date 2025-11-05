import { PropsWithChildren, ReactNode } from 'react';
import { ScrollView, View } from 'react-native';

interface ScreenProps extends PropsWithChildren {
  padded?: boolean;
  footer?: ReactNode;
}

export function Screen({ children, padded = true, footer }: ScreenProps) {
  return (
    <View className="flex-1 bg-slate-50 dark:bg-slate-950">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          padding: padded ? 24 : 0,
          gap: 16,
          paddingBottom: padded ? 40 : 24,
        }}>
        {children}
      </ScrollView>
      {footer}
    </View>
  );
}
