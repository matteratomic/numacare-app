import { forwardRef } from 'react';
import { Text, TextInput, TextInputProps, View } from 'react-native';

interface InputProps extends TextInputProps {
  label?: string;
  hint?: string;
  error?: string;
  className?: string;
}

export const Input = forwardRef<TextInput, InputProps>(
  ({ label, hint, error, className, multiline, ...rest }, ref) => {
    const baseClass =
      'rounded-2xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100';
    const multilineClass = multiline ? ' min-h-[96px]' : '';

    return (
      <View className="gap-2">
        {label && (
          <Text className="text-sm font-medium text-slate-700 dark:text-slate-200">{label}</Text>
        )}
        <TextInput
          ref={ref}
          className={`${baseClass}${multilineClass} ${className ?? ''}`.trim()}
          placeholderTextColor="#94a3b8"
          multiline={multiline}
          {...rest}
        />
        {(hint || error) && (
          <Text
            className={`text-xs ${error ? 'text-rose-500' : 'text-slate-500 dark:text-slate-400'}`}>
            {error ?? hint}
          </Text>
        )}
      </View>
    );
  }
);

Input.displayName = 'Input';
