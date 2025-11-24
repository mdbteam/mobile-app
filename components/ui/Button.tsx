import { ActivityIndicator, Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  isLoading?: boolean;
  variant?: 'primary' | 'secondary' | 'destructive';
}

export function Button({ title, isLoading, variant = 'primary', className, ...props }: ButtonProps) {
  let bgClass = 'bg-amber-300';
  let textClass = 'text-slate-900';

  if (variant === 'secondary') {
    bgClass = 'bg-slate-700';
    textClass = 'text-white';
  } else if (variant === 'destructive') {
    bgClass = 'bg-red-500';
    textClass = 'text-white';
  }

  return (
    <TouchableOpacity
      className={`${bgClass} py-4 rounded-lg items-center justify-center active:opacity-80 ${isLoading ? 'opacity-70' : ''} ${className}`}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator color={variant === 'primary' ? '#0f172a' : '#ffffff'} />
      ) : (
        <Text className={`${textClass} font-bold text-lg`}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}