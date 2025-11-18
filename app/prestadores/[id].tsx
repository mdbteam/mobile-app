import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, Image, ScrollView, Text, View } from 'react-native';

interface PrestadorDetalle {
  id_usuario: number;
  nombres: string;
  primer_apellido: string;
  foto_url: string | null;
  oficios: string[];
  puntuacion_promedio: number;
  descripcion: string;
  trabajos_realizados: number;
}

const fetchPrestador = async (id: string) => {
  const { data } = await axios.get<PrestadorDetalle>(`/api/prestadores/${id}`);
  return data;
};

export default function PrestadorDetailPage() {
  const params = useLocalSearchParams();
  const id = params.id as string;

  const { data: prestador, isLoading, error } = useQuery({
    queryKey: ['prestador', id],
    queryFn: () => fetchPrestador(id),
  });

  if (isLoading) return <ActivityIndicator size="large" color="#22D3EE" className="my-10" />;
  if (error) return <Text className="text-red-400 text-center mt-10">Error al cargar el prestador</Text>;
  if (!prestador) return <Text className="text-slate-400 text-center mt-10">Prestador no encontrado</Text>;

  const displayName = `${prestador.nombres.split(' ')[0]} ${prestador.primer_apellido}`;

  return (
    <ScrollView className="p-4 bg-slate-900 flex-1">
      <View className="items-center mb-6">
        <Image 
          source={{ uri: prestador.foto_url || 'https://via.placeholder.com/150' }}
          className="h-32 w-32 rounded-full mb-4"
        />
        <Text className="text-3xl font-bold text-white">{displayName}</Text>
        <Text className="text-lg text-cyan-400">{prestador.oficios.join(', ')}</Text>
      </View>

      <View className="bg-slate-800/50 rounded-lg p-4 mb-4">
        <Text className="text-slate-300 text-sm mb-2">Descripción:</Text>
        <Text className="text-white">{prestador.descripcion || 'No hay descripción disponible.'}</Text>
      </View>

      <View className="bg-slate-800/50 rounded-lg p-4">
        <Text className="text-slate-300 text-sm mb-2">Trabajos realizados:</Text>
        <Text className="text-white">{prestador.trabajos_realizados}</Text>
        <Text className="text-slate-300 text-sm mt-2">Puntuación promedio:</Text>
        <Text className="text-white">{prestador.puntuacion_promedio.toFixed(1)}</Text>
      </View>
    </ScrollView>
  );
}
