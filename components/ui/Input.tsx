// components/ui/Input.tsx
import React from 'react';
import { Text, TextInput, TextInputProps, View } from 'react-native';
import tw from 'twrnc';

interface InputProps extends TextInputProps {
  label: string;
  error?: string;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<TextInput, InputProps>(({
  label,
  error,
  rightIcon,
  style,
  ...textInputProps
}, ref) => (
  <View style={tw`mb-2`}>
    <Text style={tw`text-white mb-1`}>{label}</Text>
    <View style={tw`flex-row items-center border rounded p-2 ${error ? 'border-red-400' : 'border-gray-400'}`}>
      <TextInput
        ref={ref}
        style={[tw`flex-1 text-white`, style]}
        placeholderTextColor="gray"
        {...textInputProps}
      />
      {rightIcon && <View>{rightIcon}</View>}
    </View>
    {error && <Text style={tw`text-red-400 mt-1`}>{error}</Text>}
  </View>
));
