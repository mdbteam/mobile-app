import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { MessageSquare, Star, User } from 'lucide-react-native';
import { ActivityIndicator, Text, View } from 'react-native';
import tw from 'twrnc';
import { useAuthStore } from '../../store/authStore';

// Tipos específicos para reseñas
interface Resena {
  id_valoracion: number;
  id_autor: number;
  puntaje: number;
  comentario: string;
  fecha_creacion: string;
  autor_nombre?: string; // Opcional si el backend lo manda
}

interface MyProfileData {
  resenas: Resena[];
  puntuacion_promedio?: number;
}

// API Client
const apiProvider = axios.create({
  baseURL: 'https://provider-service-mjuj.onrender.com',
});

const fetchMyReviews = async (token: string | null) => {
  if (!token) throw new Error("No token");
  // Usamos el endpoint de perfil que trae las reseñas anidadas
  const { data } = await apiProvider.get<MyProfileData>('/profile/me', {
    headers: { Authorization: `Bearer ${token}` }
  });
  return data;
};

export function MyReviewsTab() {
  const { token, user } = useAuthStore();

  const { data: profileData, isLoading, error } = useQuery({
    queryKey: ['myReviews'],
    queryFn: () => fetchMyReviews(token),
  });

  if (isLoading) return <ActivityIndicator size="large" color="#22D3EE" style={tw`mt-10`} />;
  
  if (error) {
    return (
      <View style={tw`p-6 bg-slate-800 rounded-xl items-center mt-4`}>
        <Text style={tw`text-red-400`}>No se pudieron cargar las reseñas.</Text>
      </View>
    );
  }

  const resenas = profileData?.resenas || [];

  if (resenas.length === 0) {
    return (
      <View style={tw`flex-1 justify-center items-center py-12 bg-slate-900/50 rounded-xl border border-slate-800 mt-4`}>
        <MessageSquare size={48} color="#475569" />
        <Text style={tw`text-slate-400 mt-4 text-lg font-bold`}>Aún no tienes reseñas</Text>
        <Text style={tw`text-slate-500 text-center px-8 mt-2 text-sm`}>
          Completa trabajos y pide a tus clientes que te califiquen para construir tu reputación.
        </Text>
      </View>
    );
  }

  return (
    <View style={tw`flex-1`}>
      {/* Resumen de Puntuación (Opcional) */}
      {profileData?.puntuacion_promedio !== undefined && (
        <View style={tw`bg-slate-800 p-4 rounded-xl mb-4 flex-row items-center justify-between border border-slate-700`}>
          <Text style={tw`text-slate-300 font-bold`}>Promedio General</Text>
          <View style={tw`flex-row items-center`}>
            <Text style={tw`text-2xl font-bold text-white mr-2`}>
              {profileData.puntuacion_promedio.toFixed(1)}
            </Text>
            <Star size={24} color="#FACC15" fill="#FACC15" />
          </View>
        </View>
      )}

      {/* Lista de Reseñas */}
      {resenas.map((item) => (
        <View key={item.id_valoracion} style={tw`bg-slate-900 p-4 rounded-xl mb-3 border border-slate-800`}>
          
          {/* Header de la reseña */}
          <View style={tw`flex-row justify-between items-start mb-2`}>
            <View style={tw`flex-row items-center`}>
              <View style={tw`w-8 h-8 bg-slate-800 rounded-full items-center justify-center border border-slate-700 mr-2`}>
                <User size={14} color="#94a3b8" />
              </View>
              <View>
                <Text style={tw`text-slate-200 font-bold text-sm`}>
                  Cliente #{item.id_autor}
                </Text>
                <Text style={tw`text-slate-500 text-xs`}>
                  {new Date(item.fecha_creacion).toLocaleDateString()}
                </Text>
              </View>
            </View>
            
            {/* Estrellas */}
            <View style={tw`flex-row`}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Star 
                  key={star} 
                  size={14} 
                  color={star <= (item.puntaje || 0) ? "#FACC15" : "#475569"} 
                  fill={star <= (item.puntaje || 0) ? "#FACC15" : "transparent"} 
                />
              ))}
            </View>
          </View>

          {/* Comentario */}
          <Text style={tw`text-slate-300 text-sm leading-relaxed mt-1`}>
            "{item.comentario || 'Sin comentario.'}"
          </Text>
        </View>
      ))}
    </View>
  );
}