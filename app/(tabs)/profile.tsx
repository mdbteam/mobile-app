import { useRouter } from 'expo-router';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../components/ui/Button';
import { useAuthStore } from '../../store/authStore';

export default function ProfileScreen() {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.replace('/login');
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-950 p-4">
      <View className="items-center mt-8">
        <View className="h-24 w-24 bg-slate-700 rounded-full mb-4 items-center justify-center">
            <Text className="text-4xl">👤</Text>
        </View>
        <Text className="text-2xl font-bold text-white">
          {user?.nombres} {user?.primer_apellido}
        </Text>
        <Text className="text-cyan-400">{user?.rol}</Text>
      </View>

      <View className="mt-10">
        <Button title="Cerrar Sesión" onPress={handleLogout} variant="destructive" />
      </View>
    </SafeAreaView>
  );
}