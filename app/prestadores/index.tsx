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

// 👇 Importamos el componente de tarjeta que ya creaste
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

  // --- 📏 LÓGICA DE GRILLA ROBUSTA (No tocar) ---
  // Padding horizontal del contenedor principal (px-4 = 16px * 2 lados = 32px)
  const CONTAINER_PADDING = 32; 
  const GAP = 12; // Espacio entre tarjetas

  // Definir columnas: 2 para Móvil, 4 para Tablet/Web
  const numColumns = width > 768 ? 4 : 2;

  // Cálculo del ancho disponible total restando márgenes y espacios
  const totalGapSize = (numColumns - 1) * GAP;
  const availableWidth = width - CONTAINER_PADDING - totalGapSize;
  
  // 🔥 CLAVE: Math.floor() y restar 1px extra para evitar errores de sub-píxeles que cortan la vista
  const cardWidth = Math.floor(availableWidth / numColumns) - 1;

  const categoria = params.categoria as string;
  const q = params.q as string;

  const { data: prestadores, isLoading } = useQuery({
    queryKey: ['prestadoresList', categoria, q],
    queryFn: () => fetchPrestadores(categoria, q),
  });

  const renderItem = ({ item }: { item: PrestadorMovil }) => {
    const id = item.id || item.id_usuario;
    
    // Validación de seguridad: Si no hay ID, no renderizamos para evitar crash
    if (!id) return null;

    return (
      <PrestadorCard
        id={String(id)}
        nombres={item.nombres}
        primer_apellido={item.primer_apellido}
        fotoUrl={item.foto_url || ''}
        oficio={item.oficios?.[0] || 'Profesional'}
        resumen={item.resumen || `Experto en ${item.oficios?.[0] || 'servicios'}.`}
        puntuacion={item.puntuacion_promedio || 0}
        // 👇 LE PASAMOS EL ANCHO CALCULADO EXACTO
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
          <Text style={tw`text-white text-lg font-bold`}>Profesionales</Text>
          <Text style={tw`text-slate-400 text-xs`} numberOfLines={1}>
            {categoria ? `Filtro: ${categoria}` : q ? `Búsqueda: "${q}"` : 'Todos los expertos'}
          </Text>
        </View>
      </View>

      {isLoading ? (
        <ActivityIndicator size="large" color="#22D3EE" style={tw`mt-20`} />
      ) : (
        <View style={tw`flex-1 w-full items-center`}>
          <FlatList
            data={prestadores}
            // Clave dinámica para forzar re-render al rotar pantalla
            key={`grid-${numColumns}`} 
            numColumns={numColumns}
            renderItem={renderItem}
            keyExtractor={(item, index) => String(item.id || item.id_usuario || index)}
            
            // Padding del contenedor (debe coincidir con CONTAINER_PADDING / 2)
            contentContainerStyle={tw`p-4 pb-20`}
            
            // 👇 GAP NATIVO: Maneja el espacio entre columnas automáticamente
            columnWrapperStyle={{ gap: GAP }}
            
            // Centrar en Web y limitar ancho máximo
            style={{ width: '100%', maxWidth: 1200 }} 
            
            ListEmptyComponent={
              <View style={tw`items-center mt-20 w-full px-6`}>
                <Filter size={48} color="#334155" />
                <Text style={tw`text-slate-500 mt-4 text-center font-medium text-base`}>
                  No se encontraron profesionales.
                </Text>
                <Text style={tw`text-slate-600 text-center text-sm mt-1 mb-4`}>
                  Prueba con otra categoría o término.
                </Text>
                <TouchableOpacity onPress={() => router.back()} style={tw`bg-slate-800 px-6 py-3 rounded-full border border-slate-700`}>
                  <Text style={tw`text-cyan-400 font-bold`}>Intentar otra búsqueda</Text>
                </TouchableOpacity>
              </View>
            }
          />
        </View>
      )}
    </SafeAreaView>
  );
}