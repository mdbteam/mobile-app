import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Filter } from 'lucide-react-native';
import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from 'twrnc';

// 👇 1. IMPORTAMOS EL COMPONENTE CARD CORRECTO
// Asegúrate de que esta ruta sea la correcta según tu estructura
import { PrestadorCard } from '../../components/prestadores/PrestadorCard';

// --- INTERFAZ ---
interface PrestadorMovil {
  id?: number;
  id_usuario?: number;
  nombres: string;
  primer_apellido: string;
  foto_url: string | null;
  oficios: string[];
  puntuacion_promedio: number | null;
  resumen?: string;
}

// --- API ---
const apiProvider = axios.create({
  baseURL: 'https://provider-service-mjuj.onrender.com',
});

const fetchPrestadores = async (categoria: string | null, search: string) => {
  const catParam = Array.isArray(categoria) ? categoria[0] : categoria;
  const qParam = Array.isArray(search) ? search[0] : search;

  const { data } = await apiProvider.get<PrestadorMovil[]>('/prestadores', {
    params: {
      q: qParam || undefined,
      categoria: catParam || undefined,
    },
  });
  return data;
};

export default function PrestadoresIndexScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { width } = useWindowDimensions();

  // --- 📏 LÓGICA DE GRILLA ---
  const CONTAINER_PADDING = 32; // 16px por lado
  const GAP = 12; 

  // 2 columnas en Móvil, 4 en Web/Tablet
  const numColumns = width > 768 ? 4 : 2;

  const totalGapSize = (numColumns - 1) * GAP;
  const availableWidth = width - CONTAINER_PADDING - totalGapSize;
  
  // Restamos 1px de seguridad
  const cardWidth = Math.floor(availableWidth / numColumns) - 1;

  const categoria = params.categoria as string;
  const q = params.q as string;

  const { data: prestadores, isLoading } = useQuery({
    queryKey: ['prestadoresList', categoria, q],
    queryFn: () => fetchPrestadores(categoria, q),
  });

  const renderItem = ({ item }: { item: PrestadorMovil }) => {
    const id = item.id || item.id_usuario;
    if (!id) return null;

    // 👇 2. USAMOS TU COMPONENTE "PRESTADORCARD"
    return (
      <PrestadorCard
        id={String(id)}
        nombres={item.nombres}
        primer_apellido={item.primer_apellido}
        fotoUrl={item.foto_url || ''}
        oficio={item.oficios?.[0] || 'Profesional'}
        resumen={item.resumen || `Experto en ${item.oficios?.[0] || 'servicios'}.`}
        puntuacion={item.puntuacion_promedio || 0}
        // 👇 LE PASAMOS EL ANCHO CALCULADO
        style={{ width: cardWidth }} 
      />
    );
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-slate-950`}>
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* Header */}
      <View style={tw`flex-row items-center p-4 border-b border-slate-800 bg-slate-900`}>
        <TouchableOpacity onPress={() => router.back()} style={tw`p-2 mr-3 bg-slate-800 rounded-full border border-slate-700`}>
          <ArrowLeft size={20} color="white" />
        </TouchableOpacity>
        <View style={tw`flex-1`}>
          <Text style={tw`text-white text-lg font-bold`}>Resultados</Text>
          <Text style={tw`text-slate-400 text-xs`} numberOfLines={1}>
            {categoria ? `Filtro: ${categoria}` : q ? `Búsqueda: "${q}"` : 'Todos'}
          </Text>
        </View>
      </View>

      {isLoading ? (
        <ActivityIndicator size="large" color="#22D3EE" style={tw`mt-20`} />
      ) : (
        <View style={tw`flex-1 w-full items-center`}>
          <FlatList
            data={prestadores}
            key={`grid-${numColumns}`} 
            numColumns={numColumns}
            renderItem={renderItem}
            keyExtractor={(item, index) => String(item.id || item.id_usuario || index)}
            
            // Espaciado
            contentContainerStyle={[tw`p-4 pb-20`, { gap: GAP }]}
            columnWrapperStyle={{ gap: GAP }}
            
            // Centrar en Web
            style={{ width: '100%', maxWidth: 1200 }} 
            
            ListEmptyComponent={
              <View style={tw`items-center mt-20 w-full px-6`}>
                <Filter size={48} color="#334155" />
                <Text style={tw`text-slate-500 mt-4 text-center font-medium`}>
                  No se encontraron profesionales.
                </Text>
                <TouchableOpacity onPress={() => router.back()} style={tw`bg-slate-800 px-6 py-3 rounded-full border border-slate-700 mt-4`}>
                  <Text style={tw`text-cyan-400 font-bold`}>Volver</Text>
                </TouchableOpacity>
              </View>
            }
          />
        </View>
      )}
    </SafeAreaView>
  );
}