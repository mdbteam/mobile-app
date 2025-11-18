import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SearchScreen() {
  return (
    <SafeAreaView className="flex-1 bg-slate-950 p-4">
      <Text className="text-xl font-bold text-white mb-4">Buscar Profesionales</Text>
      <View className="flex-1 justify-center items-center">
         <Text className="text-slate-500">Aquí irá el buscador y filtros</Text>
      </View>
    </SafeAreaView>
  );
}