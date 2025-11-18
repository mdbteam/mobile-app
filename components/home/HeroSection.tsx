import { MaterialIcons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { Text, TouchableOpacity, View } from 'react-native'

export function HeroSection() {
  const router = useRouter()

  return (
    <View className="text-center max-w-3xl mx-auto px-4 py-10">
      <Text className="text-4xl sm:text-6xl font-bold text-white font-poppins [text-shadow:0_0_20px_rgba(234,179,8,0.5)]">
        Conecta con los mejores <Text className="text-amber-400">profesionales</Text> a tu alrededor.
      </Text>
      <Text className="mt-6 text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto">
        Desde gasfitería hasta electricidad, encuentra el prestador de servicios verificado que necesitas para tu hogar o negocio.
      </Text>

      <View className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
        <TouchableOpacity
          className="bg-amber-400 p-4 rounded-lg flex-row items-center justify-center"
          activeOpacity={0.8}
          onPress={() => router.push({ pathname: "/prestadores" } as any)}
        >
          <Text className="text-slate-900 text-base font-semibold">
            Encontrar un Prestador
          </Text>
          <MaterialIcons name="arrow-forward" size={16} className="ml-2" />
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-slate-700 p-4 rounded-lg flex-row items-center justify-center"
          activeOpacity={0.8}
          onPress={() => router.push({ pathname: "/postular" } as any)}
        >
          <Text className="text-white text-base font-semibold">
            Quiero ser Prestador
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}
