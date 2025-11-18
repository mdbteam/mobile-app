import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CitasScreen() {
  return (
    <SafeAreaView className="flex-1 bg-slate-950 p-4">
      <Text className="text-xl font-bold text-white mb-4">Mis Citas</Text>
      {/* Aquí reutilizaremos la lógica de MyCitasList */}
      <View className="flex-1 justify-center items-center">
         <Text className="text-slate-500">Aquí verás tus citas agendadas</Text>
      </View>
    </SafeAreaView>
  );
}