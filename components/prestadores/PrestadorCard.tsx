import { useRouter } from 'expo-router';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import tw from 'twrnc'; // 👈 Importamos twrnc

interface PrestadorCardProps {
  readonly id: string;
  readonly nombres: string;
  readonly primer_apellido: string;
  readonly fotoUrl: string;
  readonly oficio: string;
  readonly resumen: string;
  readonly puntuacion: number;
}

function StarRating({ rating }: { readonly rating: number }) {
  const fullStars = Math.round(rating);
  const emptyStars = 5 - fullStars;
  return (
    <View style={tw`flex-row items-center`}>
      {[...Array(fullStars)].map((_, i) => (
        <Text key={`full-${i}`} style={tw`text-yellow-400`}>★</Text>
      ))}
      {[...Array(emptyStars)].map((_, i) => (
        <Text key={`empty-${i}`} style={tw`text-slate-600`}>★</Text>
      ))}
    </View>
  );
}

export function PrestadorCard({ id, nombres, primer_apellido, fotoUrl, oficio, resumen, puntuacion }: PrestadorCardProps) {
  const router = useRouter();
  const displayName = `${nombres.split(' ')[0]} ${primer_apellido}`;

  return (
    <View style={tw`bg-slate-800 rounded-lg border border-slate-700 p-4 flex-col h-full`}>
      <View style={tw`flex-1`}>
        <View style={tw`flex-row items-center`}>
          <Image 
            source={{ uri: fotoUrl }}
            style={tw`h-20 w-20 rounded-lg mr-4`}
          />
          <View style={tw`flex-1`}>
            <Text style={tw`text-xl font-bold text-slate-100`}>{displayName}</Text>
            <Text style={tw`text-sm text-cyan-400`}>{oficio}</Text>
            <View style={tw`mt-1 flex-row items-center`}>
              <StarRating rating={puntuacion} />
              <Text style={tw`text-xs text-slate-400 ml-2`}>({puntuacion.toFixed(1)})</Text>
            </View>
          </View>
        </View>
        <Text style={tw`mt-4 text-slate-300 text-sm flex-1`} numberOfLines={3}>
            {resumen}
        </Text>
      </View>

      <TouchableOpacity
        style={tw`mt-4 bg-yellow-400 py-2 px-4 rounded-md items-center`}
        activeOpacity={0.8}
        onPress={() => router.push({ pathname: `/prestadores/${id}` } as any)}
      >
        <Text style={tw`text-slate-900 font-bold text-sm`}>Ver Perfil</Text>
      </TouchableOpacity>
    </View>
  );
}