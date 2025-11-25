import { useRouter } from 'expo-router';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import tw from 'twrnc';

interface PrestadorCardProps {
  readonly id: string;
  readonly nombres: string;
  readonly primer_apellido: string;
  readonly fotoUrl: string;
  readonly oficio: string;
  readonly resumen: string;
  readonly puntuacion: number;
  readonly style?: any; // 👈 AGREGADO: Para recibir el ancho dinámico
}

function StarRating({ rating }: { readonly rating: number }) {
  const fullStars = Math.round(rating);
  const emptyStars = 5 - fullStars;
  return (
    <View style={tw`flex-row items-center`}>
      {[...Array(fullStars)].map((_, i) => (
        <Text key={`full-${i}`} style={tw`text-yellow-400 text-xs`}>★</Text>
      ))}
      {[...Array(emptyStars)].map((_, i) => (
        <Text key={`empty-${i}`} style={tw`text-slate-600 text-xs`}>★</Text>
      ))}
    </View>
  );
}

export function PrestadorCard({ 
  id, 
  nombres, 
  primer_apellido, 
  fotoUrl, 
  oficio, 
  resumen, 
  puntuacion, 
  style // 👈 Recibimos el estilo
}: PrestadorCardProps) {
  const router = useRouter();
  const displayName = `${nombres.split(' ')[0]} ${primer_apellido}`;

  return (
    // 👇 APLICAMOS EL ESTILO AQUÍ (width dinámico)
    <View style={[tw`bg-slate-800 rounded-xl border border-slate-700 p-3 flex-col h-full justify-between`, style]}>
      
      <View>
        {/* Header: Foto + Datos */}
        <View style={tw`flex-row items-center mb-2`}>
          <Image 
            source={{ uri: fotoUrl || 'https://via.placeholder.com/150' }}
            style={tw`h-12 w-12 rounded-full mr-3 bg-slate-700`}
          />
          <View style={tw`flex-1 overflow-hidden`}>
            <Text style={tw`text-base font-bold text-slate-100`} numberOfLines={1}>
              {displayName}
            </Text>
            <Text style={tw`text-xs text-cyan-400 font-bold uppercase`} numberOfLines={1}>
              {oficio}
            </Text>
            <View style={tw`flex-row items-center mt-0.5`}>
              <StarRating rating={puntuacion} />
              <Text style={tw`text-[10px] text-slate-400 ml-1`}>({puntuacion.toFixed(1)})</Text>
            </View>
          </View>
        </View>

        {/* Resumen */}
        <Text style={tw`text-slate-400 text-xs leading-4 mb-3`} numberOfLines={2}>
            {resumen}
        </Text>
      </View>

      {/* Botón */}
      <TouchableOpacity
        style={tw`bg-yellow-500 py-2 rounded-lg items-center mt-auto`}
        activeOpacity={0.8}
        // Ajusta la ruta según cómo se llame tu carpeta (singular o plural)
        onPress={() => router.push(`/prestadores/${id}` as any)}
      >
        <Text style={tw`text-slate-900 font-bold text-xs uppercase`}>Ver Perfil</Text>
      </TouchableOpacity>
    </View>
  );
}