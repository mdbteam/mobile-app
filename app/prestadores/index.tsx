import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Search, X } from 'lucide-react-native'; // Agregamos X para limpiar
import { useEffect, useState } from 'react'; // 👈 Agregamos useEffect
import { ActivityIndicator, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from 'twrnc';
import { PrestadorCard } from '../../components/prestadores/PrestadorCard';

interface PrestadorResumen {
  id?: number;
  id_usuario?: number;
  nombres: string;
  primer_apellido: string;
  foto_url: string | null;
  oficios: string[];
  puntuacion_promedio: number;
}

const axiosInstance = axios.create({
  baseURL: 'https://provider-service-mjuj.onrender.com',
});

const fetchPrestadores = async (categoria: string | null, searchTerm: string): Promise<PrestadorResumen[]> => {
  console.log(`📡 Buscando: Q="${searchTerm}" | Cat="${categoria}"`); // Debug
  const { data } = await axiosInstance.get<PrestadorResumen[]>('/prestadores', {
    params: {
      q: searchTerm || undefined,
      categoria: categoria || undefined,
    },
  });
  return data;
};

export default function PrestadorListPage() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  // Estados locales
  const [searchTerm, setSearchTerm] = useState('');
  const [categoriaFilter, setCategoriaFilter] = useState<string | null>(null);

  // 🔥 EFECTO MÁGICO: Sincronizar URL params con el estado local
  // Esto hace que si vienes de la pantalla "Search", se aplique el filtro automáticamente
  useEffect(() => {
    if (params.q) setSearchTerm(params.q as string);
    if (params.categoria) setCategoriaFilter(params.categoria as string);
  }, [params.q, params.categoria]);

  const { data: prestadores, isLoading, error, refetch } = useQuery<PrestadorResumen[], Error>({
    queryKey: ['prestadores', categoriaFilter, searchTerm], // Clave reactiva
    queryFn: () => fetchPrestadores(categoriaFilter, searchTerm),
  });

  // Función para limpiar filtros
  const clearFilters = () => {
    setSearchTerm('');
    setCategoriaFilter(null);
    router.setParams({ q: '', categoria: '' }); // Limpiar URL también
  };

  const hasFilters = !!searchTerm || !!categoriaFilter;

  return (
    <SafeAreaView style={tw`flex-1 bg-slate-950`}>
      
      {/* HEADER */}
      <View style={tw`px-4 py-3 border-b border-slate-800 flex-row items-center bg-slate-900`}>
        <TouchableOpacity onPress={() => router.back()} style={tw`p-2 bg-slate-800 rounded-full mr-4`}>
          <ArrowLeft color="white" size={24} />
        </TouchableOpacity>
        
        <View style={tw`flex-1`}>
          <Text style={tw`text-white font-bold text-xl`}>Profesionales</Text>
          {/* Mostrar qué filtro está activo */}
          {categoriaFilter ? (
             <Text style={tw`text-cyan-400 text-xs`}>Filtro: {categoriaFilter}</Text>
          ) : searchTerm ? (
             <Text style={tw`text-cyan-400 text-xs`}>Buscando: "{searchTerm}"</Text>
          ) : (
             <Text style={tw`text-slate-400 text-xs`}>Todos los servicios</Text>
          )}
        </View>

        {hasFilters && (
          <TouchableOpacity onPress={clearFilters}>
             <Text style={tw`text-red-400 text-xs font-bold`}>Limpiar</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView style={tw`flex-1 px-4 pt-4`}>
        <View style={tw`pb-10`}>
          
          {/* BUSCADOR INTERNO */}
          <View style={tw`flex-row items-center bg-slate-800 border border-slate-700 rounded-full px-4 mb-6`}>
            <Search color="#94a3b8" size={20} />
            <TextInput
              value={searchTerm}
              onChangeText={setSearchTerm}
              placeholder="Refinar búsqueda..."
              placeholderTextColor="#94a3b8"
              style={tw`flex-1 py-3 ml-2 text-white`}
              onSubmitEditing={() => refetch()} // Buscar al dar Enter
            />
            {searchTerm.length > 0 && (
                <TouchableOpacity onPress={() => setSearchTerm('')}>
                    <X color="#94a3b8" size={16} />
                </TouchableOpacity>
            )}
          </View>

          {/* ESTADOS */}
          {isLoading && <ActivityIndicator size="large" color="#22D3EE" style={tw`my-10`} />}

          {prestadores?.length === 0 && !isLoading && (
            <View style={tw`bg-slate-800/50 p-6 rounded-xl items-center`}>
                <Text style={tw`text-slate-300 text-center mb-2`}>No encontramos resultados.</Text>
                <Text style={tw`text-slate-500 text-xs text-center`}>
                    Intenta con otra palabra o limpia los filtros.
                </Text>
            </View>
          )}

          {/* LISTA */}
          <View style={tw`flex-col gap-4`}>
            {prestadores?.map((prestador, index) => {
              const idSeguro = prestador.id || prestador.id_usuario || index;
              return (
                <View key={idSeguro.toString()}>
                  <PrestadorCard
                    id={idSeguro.toString()}
                    nombres={prestador.nombres || 'Sin nombre'}
                    primer_apellido={prestador.primer_apellido || ''}
                    fotoUrl={prestador.foto_url || 'https://via.placeholder.com/150'}
                    oficio={prestador.oficios?.[0] || 'Profesional'}
                    resumen={`Experto en ${prestador.oficios?.[0] || 'servicios'}`}
                    puntuacion={prestador.puntuacion_promedio || 0}
                  />
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}