import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from 'twrnc';
import { MyCitasList } from '../../components/profile/MyCitasList';

export default function AppointmentsScreen() {
  return (
    <SafeAreaView style={tw`flex-1 bg-slate-950`}>
      {/* Header */}
      <View style={tw`px-4 py-3 border-b border-slate-800 bg-slate-900`}>
        <Text style={tw`text-white font-bold text-xl`}>Agenda</Text>
        <Text style={tw`text-slate-400 text-xs`}>Tus próximos compromisos</Text>
      </View>

      {/* Contenido (Scrollable) */}
      <ScrollView contentContainerStyle={tw`p-4 pb-20`}>
        {/* Aquí renderizamos el componente maestro */}
        <MyCitasList />
      </ScrollView>
    </SafeAreaView>
  );
}