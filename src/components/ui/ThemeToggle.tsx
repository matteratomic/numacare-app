import { useMemo } from 'react';
import { useColorScheme } from 'nativewind';

import { Button } from '@/components/ui/Button';

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { colorScheme, setColorScheme } = useColorScheme();

  const label = useMemo(() => (colorScheme === 'dark' ? 'Light mode' : 'Dark mode'), [colorScheme]);

  const handleToggle = () => {
    setColorScheme(colorScheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <Button variant="outline" onPress={handleToggle} className={className}>
      {label}
    </Button>
  );
}
