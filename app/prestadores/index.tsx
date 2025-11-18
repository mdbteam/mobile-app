import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';
import { ActivityIndicator, ScrollView, Text, TextInput, View } from 'react-native';
import { PrestadorCard } from '../../components/prestadores/PrestadorCard';

interface PrestadorResumen {
  id_usuario: number;
  nombres: string;
  primer_apellido: string;
  foto_url: string | null;
  oficios: string[];
  puntuacion_promedio: number;
}

const fetchPrestadores = async (oficio: string | null, searchTerm: string) => {
  const { data } = await axios.get<PrestadorResumen[]>('/prestadores', {
    params: {
      q: searchTerm || undefined,
      oficio: oficio || undefined,
    }
  });
  return data;
};

export default function PrestadorListPage({ route }: any) {
  const [searchTerm, setSearchTerm] = useState('');
  const [oficioFilter, setOficioFilter] = useState(route?.params?.oficio || null);

  const { data: prestadores, isLoading, error } = useQuery({
    queryKey: ['prestadores', oficioFilter, searchTerm],
    queryFn: () => fetchPrestadores(oficioFilter, searchTerm),
  });

  return (
    <ScrollView className="p-4 bg-slate-900 flex-1">
      <View className="mx-auto max-w-7xl">
        <Text className="text-4xl font-bold text-white text-center font-poppins mb-4">
          Encuentra tu Agente
        </Text>
        <Text className="text-lg text-slate-300 text-center mb-6">
          Busca profesionales calificados para el trabajo que necesitas.
        </Text>

        <TextInput
          value={searchTerm}
          onChangeText={setSearchTerm}
          placeholder="Buscar por oficio o nombre (Ej: Plomero)"
          className="w-full px-5 py-3 mb-4 rounded-full bg-slate-800 border border-slate-700 text-white"
        />

        {oficioFilter && (
          <Text className="text-sm text-slate-400 mb-4 text-center">
            Filtrando por: <Text className="font-semibold text-amber-400">{oficioFilter}</Text>
          </Text>
        )}

        {isLoading && <ActivityIndicator size="large" color="#22D3EE" className="my-10" />}
        {error && (
          <Text className="text-center text-red-400 bg-slate-800/50 rounded-lg p-4 mb-4">
            Error al cargar los prestadores. Intenta de nuevo más tarde.
          </Text>
        )}
        {prestadores?.length === 0 && (
          <Text className="text-center text-slate-400 bg-slate-800/50 rounded-lg p-4 mb-4">
            No se encontraron prestadores que coincidan con tu búsqueda.
          </Text>
        )}

        <View className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {prestadores?.map((prestador) => (
            <PrestadorCard
              key={prestador.id_usuario}
              id={prestador.id_usuario.toString()}
              nombres={prestador.nombres}
              primer_apellido={prestador.primer_apellido}
              fotoUrl={prestador.foto_url || 'https://via.placeholder.com/150'}
              oficio={prestador.oficios?.[0] || 'Profesional'}
              resumen=""
              puntuacion={prestador.puntuacion_promedio || 0}
            />
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
