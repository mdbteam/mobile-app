// app/components/home/Testimonials.tsx
import { Image, Text, View } from "react-native";
import Svg, { Path } from "react-native-svg";

const testimonials = [
  {
    quote:
      "¡Servicio increíble! Encontré un gasfíter en minutos y el trabajo fue impecable. Totalmente recomendado.",
    author: "Sofía Vergara",
    role: "Cliente en Santiago",
    avatar: "https://flowbite.com/docs/images/people/profile-picture-1.jpg",
    rating: 5,
  },
  {
    quote:
      "La plataforma es muy fácil de usar. Pude comparar varios electricistas y elegir el que más me convenía.",
    author: "Martín Cárcamo",
    role: "Cliente en Valparaíso",
    avatar: "https://flowbite.com/docs/images/people/profile-picture-3.jpg",
    rating: 5,
  },
  {
    quote:
      "Por fin una solución moderna para encontrar profesionales de confianza. Me ahorró mucho tiempo y estrés.",
    author: "Carla Jara",
    role: "Cliente en Concepción",
    avatar: "https://flowbite.com/docs/images/people/profile-picture-2.jpg",
    rating: 4,
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <View className="flex-row justify-center mb-4">
      {[...Array(5)].map((_, i) => (
        <Svg
          key={i}
          width={22}
          height={20}
          viewBox="0 0 22 20"
          fill={i < rating ? "#FBBF24" : "#D1D5DB"}
        >
          <Path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
        </Svg>
      ))}
    </View>
  );
}

export function Testimonials() {
  return (
    <View className="bg-white py-8 lg:py-16 w-full">
      <View className="max-w-screen-xl mx-auto px-4">
        <Text className="mb-8 text-center text-3xl font-extrabold text-gray-900">
          Lo que dicen nuestros clientes
        </Text>

        <View className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <View
              key={t.author}
              className="bg-white p-6 rounded-lg border border-gray-200 shadow-md text-center"
            >
              <StarRating rating={t.rating} />

              <Text className="my-4 text-gray-500 italic">"{t.quote}"</Text>

              <View className="flex-row items-center justify-center space-x-3">
                <Image
                  source={{ uri: t.avatar }}
                  className="w-9 h-9 rounded-full"
                />

                <View className="flex-col">
                  <Text className="font-medium text-black">{t.author}</Text>
                  <Text className="text-sm text-gray-500">{t.role}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}
