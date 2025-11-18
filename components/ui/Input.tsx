import { forwardRef } from 'react';
import { Text, TextInput, TextInputProps, View } from 'react-native';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
}

// 1. Definimos el componente en una constante primero
const Input = forwardRef<TextInput, InputProps>(({ label, error, className, ...props }, ref) => {
  return (
    <View className="mb-4">
      {label && <Text className="text-slate-300 mb-1 font-medium">{label}</Text>}
      <TextInput
        ref={ref}
        placeholderTextColor="#94a3b8"
        className={`bg-slate-800 border border-slate-700 text-white px-4 py-3 rounded-lg focus:border-cyan-500 ${error ? 'border-red-500' : ''} ${className}`}
        {...props}
      />
      {error && <Text className="text-red-400 text-xs mt-1">{error}</Text>}
    </View>
  );
});

// 2. Asignamos el displayName para callar a ESLint
Input.displayName = 'Input';

// 3. Lo exportamos
export { Input };
