import { useRouter } from "expo-router";
import {
  Armchair,
  Cpu,
  Droplets,
  Fan,
  Hammer, Home as HomeIcon,
  Key,
  LayoutGrid,
  Paintbrush,
  Sparkles,
  Trees,
  Truck // Añadidos para Mueblería y Mudanza/Otros
  ,

  Wrench, Zap
} from "lucide-react-native";
import { Text, TouchableOpacity, View, useWindowDimensions } from "react-native";
import tw from 'twrnc';

// 1. LISTA VISUAL (Igual a la Web - Con Tildes)
const CATEGORIAS_VISUALES = [
  "Gasfitería", "Electricidad", "Pintura", "Albañilería", 
  "Carpintería", "Jardinería", "Mecánica", "Plomería", 
  "Cerrajería", "Reparación de Electrodomésticos", 
  "Instalación de Aire Acondicionado", "Servicios de Limpieza", 
  "Techado", "Otros"
];

// 2. MAPA DE ICONOS (Adaptado a Lucide Native)
const categoryIcons: { [key: string]: any } = {
  gasfiteria: Droplets,
  electricidad: Zap,
  pintura: Paintbrush,
  albanileria: Hammer,
  carpinteria: Hammer,
  jardineria: Trees,
  mecanica: Wrench,
  plomeria: Droplets,
  cerrajeria: Key,
  reparacion: Cpu,
  instalacion: Fan,
  servicios: Sparkles,
  techado: HomeIcon,
  otros: LayoutGrid,
  muebleria: Armchair,
  mudanza: Truck,
  default: LayoutGrid,
};

// Helper para quitar tildes
const normalizeText = (text: string) => {
  return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};

const getIcon = (name: string) => {
  const firstWord = name.split(" ")[0]; 
  const key = normalizeText(firstWord);
  return categoryIcons[key] || categoryIcons.default;
};

export default function FeaturedCategories() {
  const router = useRouter();
  const { width } = useWindowDimensions();

  // Responsive: 2 columnas en móvil, 4 en tablet/web
  const numColumns = width > 640 ? 4 : 2;
  const gap = 16; // Espacio entre items
  // Cálculo de ancho: (AnchoTotal - PaddingContenedor - (Espacio * (cols-1))) / cols
  const itemWidth = (width - 32 - (gap * (numColumns - 1))) / numColumns;

  const handlePress = (nombreVisual: string) => {
    // ⚠️ TRUCO: Mostramos "Gasfitería" pero enviamos "Gasfiteria" a la API
    let nombreParaApi = normalizeText(nombreVisual); 
    // Capitalizar primera letra (API requirement)
    nombreParaApi = nombreParaApi.charAt(0).toUpperCase() + nombreParaApi.slice(1);

    // Excepciones manuales para nombres largos
    if (nombreVisual.includes("Aire")) nombreParaApi = "Instalacion de Aire Acondicionado";
    if (nombreVisual.includes("Electrodomésticos")) nombreParaApi = "Reparacion de Electrodomesticos";
    if (nombreVisual.includes("Limpieza")) nombreParaApi = "Servicios de Limpieza";

    router.push({
      pathname: "/prestadores", // Ajusta a la ruta de tu archivo PrestadoresScreen
      params: { categoria: nombreParaApi },
    } as any);
  };

  return (
    <View style={tw`flex-row flex-wrap gap-4 justify-between`}>
      {CATEGORIAS_VISUALES.map((nombre, index) => {
        const Icon = getIcon(nombre);
        return (
          <TouchableOpacity
            key={index}
            style={[
              tw`bg-slate-800/50 border border-slate-700 rounded-xl items-center justify-center p-6 shadow-sm`,
              { width: itemWidth } // Ancho dinámico
            ]}
            onPress={() => handlePress(nombre)}
            activeOpacity={0.7}
          >
            <Icon size={32} color="#FBBF24" />
            <Text 
              style={tw`mt-3 text-xs font-bold text-white text-center`}
              numberOfLines={2}
            >
              {nombre}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}