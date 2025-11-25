import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import * as Linking from "expo-linking";
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Briefcase, Calendar, CheckCircle, Star } from 'lucide-react-native';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from 'twrnc';
// --- INTERFAZ ---
interface PrestadorDetalle {
  id_usuario: number;
  nombres: string;
  primer_apellido: string;
  segundo_apellido: string;
  foto_url: string | null;
  oficios: string[];
  puntuacion_promedio: number;
  perfil?: {
    biografia: string;
    anos_experiencia: number;
    resumen_profesional: string;
  };
  trabajos_realizados: number;
}

// --- API CORRECTA (Provider Service) ---
const apiProvider = axios.create({
  baseURL: 'https://provider-service-mjuj.onrender.com',
});

const fetchPrestador = async (id: string) => {
  // Endpoint: /prestadores/{id}
  const { data } = await apiProvider.get<PrestadorDetalle>(`/prestadores/${id}`);
  return data;
};

export default function PrestadorDetailPage() {
  const router = useRouter();
  const { id } = useLocalSearchParams(); // Captura el [id] de la URL

  const { data: prestador, isLoading, error } = useQuery({
    queryKey: ['prestadorDetail', id],
    queryFn: () => fetchPrestador(id as string),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <SafeAreaView style={tw`flex-1 bg-slate-950 justify-center items-center`}>
        <ActivityIndicator size="large" color="#22D3EE" />
      </SafeAreaView>
    );
  }

  if (error || !prestador) {
    return (
      <SafeAreaView style={tw`flex-1 bg-slate-950 justify-center items-center`}>
        <Text style={tw`text-red-400 text-lg`}>Error al cargar perfil.</Text>
        <TouchableOpacity onPress={() => router.back()} style={tw`mt-4 bg-slate-800 px-4 py-2 rounded-lg`}>
          <Text style={tw`text-white`}>Volver</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={tw`flex-1 bg-slate-950`}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <ScrollView contentContainerStyle={tw`pb-24`}>
        {/* HEADER CON IMAGEN */}
        <View style={tw`relative`}>
          {/* Botón Atrás Flotante */}
          <TouchableOpacity 
            onPress={() => router.back()} 
            style={tw`absolute top-4 left-4 z-10 bg-slate-900/80 p-2 rounded-full`}
          >
            <ArrowLeft color="white" size={24} />
          </TouchableOpacity>

          {/* Fondo Decorativo */}
          <View style={tw`h-40 bg-slate-800 w-full`} />
          
          {/* Avatar Superpuesto */}
          <View style={tw`items-center -mt-16`}>
            <Image 
              source={{ uri: prestador.foto_url || 'https://via.placeholder.com/150' }}
              style={tw`h-32 w-32 rounded-full border-4 border-slate-950 bg-slate-800`}
            />
          </View>
        </View>

        {/* INFO PRINCIPAL */}
        <View style={tw`px-6 pt-4 items-center text-center`}>
          <Text style={tw`text-2xl font-bold text-white text-center`}>
            {prestador.nombres} {prestador.primer_apellido}
          </Text>
          <Text style={tw`text-cyan-400 font-semibold text-lg mt-1 uppercase`}>
            {prestador.oficios[0] || 'Profesional'}
          </Text>
          
          {/* Stats Row */}
          <View style={tw`flex-row justify-center mt-6 gap-8 w-full`}>
            <View style={tw`items-center`}>
              <View style={tw`flex-row items-center`}>
                <Star size={20} color="#FACC15" fill="#FACC15" />
                <Text style={tw`text-white font-bold text-xl ml-1`}>
                  {prestador.puntuacion_promedio.toFixed(1)}
                </Text>
              </View>
              <Text style={tw`text-slate-500 text-xs uppercase`}>Rating</Text>
            </View>

            <View style={tw`w-[1px] bg-slate-800`} />

            <View style={tw`items-center`}>
              <View style={tw`flex-row items-center`}>
                <CheckCircle size={20} color="#22D3EE" />
                <Text style={tw`text-white font-bold text-xl ml-1`}>
                  {prestador.trabajos_realizados}
                </Text>
              </View>
              <Text style={tw`text-slate-500 text-xs uppercase`}>Trabajos</Text>
            </View>

            <View style={tw`w-[1px] bg-slate-800`} />

            <View style={tw`items-center`}>
              <View style={tw`flex-row items-center`}>
                <Briefcase size={20} color="#94A3B8" />
                <Text style={tw`text-white font-bold text-xl ml-1`}>
                  {prestador.perfil?.anos_experiencia || 1}+
                </Text>
              </View>
              <Text style={tw`text-slate-500 text-xs uppercase`}>Años Exp.</Text>
            </View>
          </View>
        </View>

        {/* DESCRIPCIÓN */}
        <View style={tw`px-6 mt-8`}>
          <Text style={tw`text-white font-bold text-lg mb-2`}>Sobre mí</Text>
          <Text style={tw`text-slate-400 leading-6`}>
            {prestador.perfil?.biografia || prestador.perfil?.resumen_profesional || "Sin descripción disponible."}
          </Text>
        </View>

        {/* OFICIOS TAGS */}
        <View style={tw`px-6 mt-6`}>
          <Text style={tw`text-white font-bold text-lg mb-3`}>Especialidades</Text>
          <View style={tw`flex-row flex-wrap gap-2`}>
            {prestador.oficios.map((oficio, index) => (
              <View key={index} style={tw`bg-slate-800 px-3 py-1 rounded-full border border-slate-700`}>
                <Text style={tw`text-cyan-100 text-sm`}>{oficio}</Text>
              </View>
            ))}
          </View>
        </View>

      </ScrollView>

      {/* FOOTER FIJO: BOTÓN AGENDAR */}
      <View style={tw`absolute bottom-0 w-full bg-slate-900 p-4 border-t border-slate-800`}>
        <TouchableOpacity 
          // Aquí podrías redirigir al calendario para agendar
          onPress={() => Linking.openURL("https://test-chambee.vercel.app/prestadores/" + prestador.id_usuario)} 
          style={tw`bg-cyan-500 rounded-xl py-4 flex-row justify-center items-center shadow-lg`}
        >
          <Calendar color="#0f172a" size={20} />
          <Text style={tw`text-slate-950 font-bold text-lg ml-2`}>Agendar Cita</Text>
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
}