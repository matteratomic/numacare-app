import { ReactNode, useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';

interface TabGroupProps {
  tabs: {
    key: string;
    label: string;
    content: ReactNode;
    pill?: ReactNode;
  }[];
  initialKey?: string;
}

export function TabGroup({ tabs, initialKey }: TabGroupProps) {
  const [activeKey, setActiveKey] = useState(initialKey ?? tabs[0]?.key);

  const activeTab = useMemo(
    () => tabs.find((tab) => tab.key === activeKey) ?? tabs[0],
    [activeKey, tabs]
  );

  if (!activeTab) {
    return null;
  }

  return (
    <View className="gap-4">
      <View className="flex-row flex-wrap gap-2">
        {tabs.map((tab) => {
          const selected = tab.key === activeTab.key;
          return (
            <Pressable
              key={tab.key}
              onPress={() => setActiveKey(tab.key)}
              className={`flex-row items-center gap-2 rounded-full border px-4 py-2 ${
                selected
                  ? 'border-sky-500 bg-sky-100 dark:bg-sky-500/20'
                  : 'border-slate-300 bg-transparent dark:border-slate-700'
              }`}>
              <Text
                className={`text-sm font-semibold ${
                  selected ? 'text-sky-700 dark:text-sky-100' : 'text-slate-600 dark:text-slate-300'
                }`}>
                {tab.label}
              </Text>
              {tab.pill}
            </Pressable>
          );
        })}
      </View>
      <View className="gap-4">{activeTab.content}</View>
    </View>
  );
}
