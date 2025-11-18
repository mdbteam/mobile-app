import { useRouter } from 'expo-router';
import { Image, Text, TouchableOpacity, View } from 'react-native';

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
    <View className="flex-row items-center">
      {[...Array(fullStars)].map((_, i) => (
        <Text key={`full-${i}`} className="text-yellow-400">★</Text>
      ))}
      {[...Array(emptyStars)].map((_, i) => (
        <Text key={`empty-${i}`} className="text-slate-600">★</Text>
      ))}
    </View>
  );
}

export function PrestadorCard({ id, nombres, primer_apellido, fotoUrl, oficio, resumen, puntuacion }: PrestadorCardProps) {
  const router = useRouter();
  const displayName = `${nombres.split(' ')[0]} ${primer_apellido}`;

  return (
    <View className="bg-slate-800/50 rounded-lg border border-slate-700 p-4 flex flex-col h-full">
      <View className="flex-1">
        <View className="flex-row items-center space-x-4">
          <Image 
            source={{ uri: fotoUrl }}
            className="h-20 w-20 rounded-lg"
          />
          <View className="flex-1">
            <Text className="text-xl font-bold text-slate-100">{displayName}</Text>
            <Text className="text-sm text-cyan-400">{oficio}</Text>
            <View className="mt-1 flex-row items-center">
              <StarRating rating={puntuacion} />
              <Text className="text-xs text-slate-400 ml-2">({puntuacion.toFixed(1)})</Text>
            </View>
          </View>
        </View>
        <Text className="mt-4 text-slate-300 text-sm flex-1">{resumen}</Text>
      </View>

      <TouchableOpacity
        className="mt-4 bg-yellow-400 py-2 px-4 rounded-md items-center"
        activeOpacity={0.8}
        onPress={() => router.push({ pathname: `/prestadores/${id}` } as any)}
      >
        <Text className="text-slate-900 font-bold text-sm">Ver Perfil</Text>
      </TouchableOpacity>
    </View>
  );
}
