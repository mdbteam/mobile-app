// app/components/home/HowItWorksSection.tsx
import { Text, View } from "react-native";

export function HowItWorksSection() {
  return (
    <View className="bg-slate-900 py-12 lg:py-20 border-t border-slate-800">
      <View className="mx-auto max-w-screen-xl px-4">
        <Text className="text-center mb-10 text-3xl font-extrabold text-white">
          ¿Cómo funciona la Red?
        </Text>

        <View className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map((num, i) => (
            <View
              key={i}
              className="flex flex-col items-center justify-center"
            >
              <View className="h-20 w-20 bg-slate-800 border border-cyan-400/30 rounded-full flex items-center justify-center">
                <Text className="text-white text-3xl font-bold">{num}</Text>
              </View>

              <Text className="mt-4 mb-2 text-xl font-bold text-cyan-400">
                {i === 0 && "Busca"}
                {i === 1 && "Compara"}
                {i === 2 && "Contacta"}
              </Text>

              <Text className="text-slate-400 text-center">
                {i === 0 &&
                  "Usa nuestra terminal de búsqueda para encontrar agentes por especialidad."}
                {i === 1 &&
                  "Revisa perfiles, portafolios y calificaciones de distintos agentes en la red."}
                {i === 2 &&
                  "Inicia comunicación directa con el agente que mejor se adapte a tu misión."}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}
