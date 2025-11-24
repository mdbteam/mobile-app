import { MaterialIcons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

export function HeroSection() {
  const router = useRouter()

  return (
    <View className="max-w-3xl mx-auto px-4 py-10">
      <Text style={styles.heroTitle}>
        Conecta con los mejores <Text className="text-amber-400">profesionales</Text> a tu alrededor
      </Text>
      <Text style={styles.heroSubtitle}>
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

const styles = StyleSheet.create({
  heroTitle: {
    fontSize: 48,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    textShadowColor: 'rgba(234,179,8,0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
    fontFamily: 'Poppins',
  },
  heroSubtitle: {
    marginTop: 24,
    fontSize: 18,
    color: '#cbd5e1', // text-slate-300
    maxWidth: 600,
    alignSelf: 'center',
    textAlign: 'center', // Justificado
  },
})
