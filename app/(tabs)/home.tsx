// app/(tabs)/index.tsx
import { ScrollView, Text, View } from "react-native";
import FeaturedCategories from "../../components/home/FeaturedCategories";
import { HeroSection } from "../../components/home/HeroSection";
import { HowItWorksSection } from "../../components/home/HowItWorksSection";
import { Testimonials } from "../../components/home/Testimonials";

export default function HomePage() {
  return (
    <ScrollView className="flex-1 bg-slate-900">
      <View className="space-y-16 sm:space-y-24 py-10">
        <HeroSection />

        <View className="max-w-5xl mx-auto px-4">
          <Text className="text-3xl font-bold text-white text-center mb-8">
            Explora por Categoría
          </Text>
          <FeaturedCategories />
        </View>

        <HowItWorksSection />

        <Testimonials />
      </View>
    </ScrollView>
  );
}
