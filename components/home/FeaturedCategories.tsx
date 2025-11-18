import { useRouter } from "expo-router";
import { Hammer, Home as HomeIcon, Paintbrush, Sparkles, TreePine, Wrench, Zap } from "lucide-react-native";
import { Text, TouchableOpacity, View } from "react-native";

const CATEGORIAS_NOMBRES = [
  "Gasfitería",
  "Electricidad",
  "Pintura",
  "Albañilería",
  "Carpintería",
  "Jardinería",
  "Mecánica",
  "Plomería",
  "Cerrajería",
  "Reparación de Electrodomésticos",
  "Instalación de Aire Acondicionado",
  "Servicios de Limpieza",
  "Techado",
  "Otro",
];

const categoryIcons: { [key: string]: any } = {
  gasfitería: Wrench,
  electricidad: Zap,
  pintura: Paintbrush,
  albañilería: Hammer,
  carpintería: HomeIcon,
  jardinería: TreePine,
  mecánica: Wrench,
  plomería: Wrench,
  cerrajería: Hammer,
  reparación: HomeIcon,
  instalación: Zap,
  servicios: Sparkles,
  techado: HomeIcon,
  otro: HomeIcon,
  default: HomeIcon,
};

const getIcon = (name?: string) => {
  if (!name) return categoryIcons.default;
  const key = name.toLowerCase().split(" ")[0];
  return categoryIcons[key] || categoryIcons.default;
};

export default function FeaturedCategories() {
  const router = useRouter();

  return (
    <View className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {CATEGORIAS_NOMBRES.slice(0, 14).map((nombre, index) => {
        const Icon = getIcon(nombre);
        return (
          <TouchableOpacity
            key={index}
            className="p-6 bg-slate-800/50 border border-slate-700 rounded-lg items-center justify-center"
            onPress={() =>
              // usar objeto pathname + params para evitar tipos estrictos de Link
              router.push({
                pathname: "/prestadores",
                params: { categoria: nombre },
              } as any)
            }
            activeOpacity={0.8}
          >
            <Icon size={38} color="#FBBF24" />
            <Text className="mt-4 text-sm font-semibold text-white text-center" numberOfLines={1}>
              {nombre}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
