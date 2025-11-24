import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { ArrowRight, Clock, Search, TrendingUp, X } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Keyboard, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from 'twrnc';

// Estas son CATEGORÍAS reales que tu backend entiende
const TRENDING_CATEGORIES = [
  'Gasfitería', 'Electricidad', 'Aseo', 'Carpintería', 
  'Pintura', 'Mudanza', 'Jardinería', 'Mecánica'
];

const HISTORY_KEY = 'search_history';

export default function SearchScreen() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [history, setHistory] = useState<string[]>([]);

  // Cargar historial al iniciar
  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const stored = await AsyncStorage.getItem(HISTORY_KEY);
      if (stored) setHistory(JSON.parse(stored));
    } catch (e) { console.error("Error cargando historial", e); }
  };

  const saveToHistory = async (text: string) => {
    // Evitar duplicados y limitar a 5 recientes
    const newHistory = [text, ...history.filter(h => h !== text)].slice(0, 5);
    setHistory(newHistory);
    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
  };

  const clearHistory = async () => {
    setHistory([]);
    await AsyncStorage.removeItem(HISTORY_KEY);
  };

  // 🔎 BÚSQUEDA GENERAL (Por Nombre u Oficio)
  const handleTextSearch = async (text: string) => {
    if (!text.trim()) return;
    await saveToHistory(text);
    
    // Navegamos pasando 'q' (Query General)
    router.push({
      pathname: '/prestadores',
      params: { q: text } 
    } as any);
  };

  // 🏷️ BÚSQUEDA POR CATEGORÍA (Tags)
  const handleCategorySearch = (category: string) => {
    // Navegamos pasando 'categoria' (Filtro específico)
    router.push({
      pathname: '/prestadores',
      params: { categoria: category } 
    } as any);
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-slate-950`}>
      <View style={tw`flex-1 px-4 pt-4`}>

        <Text style={tw`text-3xl font-bold text-white mb-6 mt-2`}>
          Explorar <Text style={tw`text-cyan-400`}>Servicios</Text>
        </Text>

        {/* INPUT DE BÚSQUEDA */}
        <View style={tw`flex-row items-center bg-slate-800 border border-slate-700 rounded-2xl px-4 py-3 mb-6 shadow-sm`}>
          <Search color="#22d3ee" size={24} />
          <TextInput
            style={tw`flex-1 ml-3 text-white text-lg h-10`}
            placeholder="¿Qué buscas? (Ej: Juan, Plomero)"
            placeholderTextColor="#64748b"
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={() => handleTextSearch(query)}
            returnKeyType="search"
            autoCorrect={false}
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => { setQuery(''); Keyboard.dismiss(); }} style={tw`bg-slate-700 p-1 rounded-full`}>
              <X color="#94a3b8" size={16} />
            </TouchableOpacity>
          )}
        </View>

        <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          
          {/* Si no hay texto, mostramos paneles de ayuda */}
          {query.length === 0 ? (
            <>
              {/* HISTORIAL RECIENTE REAL */}
              {history.length > 0 && (
                <View style={tw`mb-8`}>
                  <View style={tw`flex-row items-center justify-between mb-4`}>
                    <View style={tw`flex-row items-center`}>
                        <Clock size={16} color="#94a3b8" />
                        <Text style={tw`text-slate-400 font-bold text-sm ml-2 uppercase tracking-wider`}>
                        Recientes
                        </Text>
                    </View>
                    <TouchableOpacity onPress={clearHistory}>
                        <Text style={tw`text-slate-600 text-xs`}>Borrar todo</Text>
                    </TouchableOpacity>
                  </View>
                  
                  {history.map((term, index) => (
                    <TouchableOpacity 
                      key={index} 
                      onPress={() => handleTextSearch(term)}
                      style={tw`flex-row items-center justify-between py-3 border-b border-slate-800 active:bg-slate-900`}
                    >
                      <Text style={tw`text-slate-200 text-base`}>{term}</Text>
                      <ArrowRight size={18} color="#475569" />
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              {/* TENDENCIAS (CATEGORÍAS) */}
              <View>
                <View style={tw`flex-row items-center mb-4`}>
                  <TrendingUp size={16} color="#fbbf24" /> 
                  <Text style={tw`text-slate-400 font-bold text-sm ml-2 uppercase tracking-wider`}>
                    Categorías Populares
                  </Text>
                </View>

                <View style={tw`flex-row flex-wrap gap-3`}>
                  {TRENDING_CATEGORIES.map((tag, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => handleCategorySearch(tag)}
                      style={tw`bg-slate-800 border border-slate-700 px-4 py-2 rounded-full active:bg-slate-700`}
                    >
                      <Text style={tw`text-cyan-100 font-medium`}>{tag}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </>
          ) : (
            /* Botón grande para confirmar búsqueda */
            <View style={tw`mt-4`}>
               <TouchableOpacity 
                onPress={() => handleTextSearch(query)}
                style={tw`bg-cyan-500 flex-row items-center justify-center py-4 rounded-xl shadow-lg`}
              >
                <Text style={tw`text-slate-900 font-bold text-lg mr-2`}>
                  Buscar "{query}"
                </Text>
                <ArrowRight size={24} color="#0f172a" />
              </TouchableOpacity>
            </View>
          )}

        </ScrollView>
      </View>
    </SafeAreaView>
  );
}