import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { ActivityIndicator, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import tw from 'twrnc';

// Interfaz adaptada a tu Swagger/Backend real
interface PrestadorDetalle {
  id_usuario: number;
  nombres: string;
  primer_apellido: string;
  foto_url: string | null;
  oficios: string[];
  puntuacion_promedio: number;
  trabajos_realizados: number;
  perfil?: {
    biografia?: string;
    resumen_profesional?: string;
    anos_experiencia?: number;
  };
  descripcion?: string;
}

const axiosInstance = axios.create({
  baseURL: 'https://provider-service-mjuj.onrender.com',
});

const fetchPrestador = async (id: string) => {
  const { data } = await axiosInstance.get<PrestadorDetalle>(`/prestadores/${id}`);
  return data;
};

export default function PrestadorDetailPage() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const { data: prestador, isLoading, error } = useQuery({
    queryKey: ['prestador', id],
    queryFn: () => fetchPrestador(id as string),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <View style={tw`flex-1 bg-slate-950 justify-center items-center`}>
        <ActivityIndicator size="large" color="#22D3EE" />
      </View>
    );
  }

  if (error || !prestador) {
    return (
      <View style={tw`flex-1 bg-slate-950 justify-center items-center p-6`}>
        <Text style={tw`text-red-400 text-lg text-center mb-4`}>
          No pudimos cargar el perfil.
        </Text>
        <TouchableOpacity onPress={() => router.back()} style={tw`bg-slate-800 px-4 py-2 rounded-lg`}>
            <Text style={tw`text-white`}>Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const displayName = `${prestador.nombres.split(' ')[0]} ${prestador.primer_apellido}`;
  const bio = prestador.perfil?.biografia || prestador.perfil?.resumen_profesional || prestador.descripcion || 'Sin descripción detallada.';

  return (
    <>
      {/* Configuramos el Header Nativo para que tenga botón atrás 
          headerShown: true permite que Expo ponga la flecha automáticamente
      */}
      <Stack.Screen 
        options={{ 
        title: 'Perfil del Profesional',
        headerStyle: { backgroundColor: '#0f172a' }, // slate-900
        headerTintColor: '#fff', // Texto blanco
        headerTitleStyle: { fontWeight: 'bold' },
        
        // 👇 CAMBIA ESTO:
        // En lugar de headerBackTitleVisible: false
        headerBackTitle: "", // Esto oculta el texto y TypeScript lo acepta feliz
        }} 
      />

      <ScrollView style={tw`flex-1 bg-slate-950`}>
        {/* HEADER DEL PERFIL */}
        <View style={tw`items-center py-10 bg-slate-900 border-b border-slate-800`}>
          <View style={tw`relative`}>
            <Image 
                source={{ uri: prestador.foto_url || 'https://via.placeholder.com/150' }}
                style={tw`h-32 w-32 rounded-full border-4 border-slate-700`}
            />
            {/* Badge de verificado (opcional, visual) */}
            <View style={tw`absolute bottom-0 right-0 bg-cyan-500 h-8 w-8 rounded-full items-center justify-center border-2 border-slate-900`}>
                <Text style={tw`text-slate-900 font-bold text-xs`}>✓</Text>
            </View>
          </View>
          
          <Text style={tw`text-3xl font-bold text-white mt-4`}>{displayName}</Text>
          <Text style={tw`text-lg text-cyan-400 font-medium`}>
            {prestador.oficios?.join(' • ') || 'Profesional'}
          </Text>
          
          {/* Estadísticas */}
          <View style={tw`flex-row mt-6 bg-slate-800/50 rounded-xl p-4 border border-slate-700`}>
            <View style={tw`items-center px-6 border-r border-slate-600`}>
              <Text style={tw`text-2xl font-bold text-yellow-400`}>{prestador.puntuacion_promedio.toFixed(1)}</Text>
              <Text style={tw`text-xs text-slate-400 uppercase font-bold`}>Rating</Text>
            </View>
            <View style={tw`items-center px-6`}>
              <Text style={tw`text-2xl font-bold text-white`}>{prestador.trabajos_realizados}</Text>
              <Text style={tw`text-xs text-slate-400 uppercase font-bold`}>Trabajos</Text>
            </View>
          </View>
        </View>

        <View style={tw`p-6`}>
          {/* BIOGRAFÍA */}
          <View style={tw`mb-8`}>
            <Text style={tw`text-white text-lg font-bold mb-3`}>Sobre mí</Text>
            <Text style={tw`text-slate-300 leading-6 text-base`}>{bio}</Text>
          </View>

          {/* BOTÓN DE ACCIÓN PRINCIPAL */}
          <TouchableOpacity 
            style={tw`bg-amber-300 py-4 rounded-xl items-center shadow-lg mb-8`}
            activeOpacity={0.8}
            onPress={() => console.log("Contratar presionado")}
          >
            <Text style={tw`text-slate-900 font-bold text-xl`}>Solicitar Servicio</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </>
  );
}