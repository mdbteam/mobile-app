import { useRouter } from 'expo-router';
import { ArrowLeft, Briefcase, Calendar, CheckCircle, MessageSquare, User } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from 'twrnc';
import { MyReviewsTab } from '../../components/profile/MyReviewsTab';
import { useAuthStore } from '../../store/authStore';

import { MyCitasList } from '../../components/profile/MyCitasList';
import { MyProfileForm } from '../../components/profile/MyProfileForm';

// ==========================================
// 🚧 COMPONENTES PLACEHOLDER (Faltan por migrar)
// ==========================================
function MyExperienceTab() {
  return (
    <View style={tw`p-6 bg-slate-800 rounded-xl border border-slate-700 min-h-[200px] justify-center items-center`}>
      <Briefcase size={40} color="#475569" style={tw`mb-2`} />
      <Text style={tw`text-slate-300 text-center`}>Experiencia Laboral</Text>
      <Text style={tw`text-slate-500 text-xs mt-2`}>Próximamente...</Text>
    </View>
  );
}


const ProfileHeader = ({ nombres, primer_apellido, fotoUrl, oficio, resumen, estaVerificado }: any) => (
  <View style={tw`items-center mb-8`}>
    <View style={tw`relative`}>
      <Image 
        source={{ uri: fotoUrl || 'https://via.placeholder.com/150' }} 
        style={tw`h-32 w-32 rounded-full border-4 border-slate-800 bg-slate-700`}
      />
      {estaVerificado && (
        <View style={tw`absolute bottom-1 right-1 bg-cyan-500 rounded-full p-1.5 border-4 border-slate-950`}>
          <CheckCircle size={16} color="#0f172a" />
        </View>
      )}
    </View>
    
    <Text style={tw`text-3xl font-bold text-white mt-4 text-center`}>
      {nombres} {primer_apellido}
    </Text>
    
    <View style={tw`bg-slate-800 px-4 py-1.5 rounded-full mt-3 border border-slate-700`}>
      <Text style={tw`text-cyan-400 text-xs font-bold uppercase tracking-widest`}>
        {oficio || 'Usuario'}
      </Text>
    </View>

    {resumen && (
      <Text style={tw`text-slate-400 text-center mt-4 px-6 leading-6`}>
        {resumen}
      </Text>
    )}
  </View>
);

// ==========================================
// 📱 PANTALLA PRINCIPAL
// ==========================================
export default function ProfileScreen() {
  const [activeTabId, setActiveTabId] = useState('citas'); 
  const { user, checkAuth } = useAuthStore();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(false);

  // Efecto de recuperación de sesión
  useEffect(() => {
    const initProfile = async () => {
      if (!user) {
        setIsChecking(true);
        await checkAuth(); 
        setIsChecking(false);
      }
    };
    initProfile();
  }, []);

  if (isChecking) {
    return (
      <SafeAreaView style={tw`flex-1 bg-slate-950 justify-center items-center`}>
        <ActivityIndicator size="large" color="#22D3EE" />
      </SafeAreaView>
    );
  }

  if (!user) {
    return (
      <SafeAreaView style={tw`flex-1 bg-slate-950 justify-center items-center p-6`}>
        <Text style={tw`text-white text-lg mb-4`}>No has iniciado sesión.</Text>
        <TouchableOpacity 
          onPress={() => router.replace('/login')}
          style={tw`bg-cyan-500 px-6 py-3 rounded-full`}
        >
          <Text style={tw`text-slate-900 font-bold`}>Ir al Login</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const esPrestador = user.rol?.toLowerCase().includes('prestador') || user.rol?.toLowerCase().includes('hibrido');

  // Definición de Pestañas (Con los componentes reales)
  const tabs = [
    { id: 'citas', label: 'Mis Citas', icon: Calendar, component: <MyCitasList />, show: true },
    { id: 'perfil', label: 'Mi Perfil', icon: User, component: <MyProfileForm />, show: true },
    { id: 'experiencia', label: 'Experiencia', icon: Briefcase, component: <MyExperienceTab />, show: esPrestador },
    { id: 'resenas', label: 'Reseñas', icon: MessageSquare, component: <MyReviewsTab />, show: true },
  ];

  const activeTab = tabs.find(t => t.id === activeTabId) || tabs[0];

  return (
    <SafeAreaView style={tw`flex-1 bg-slate-950`}>
      
      {/* === 1. HEADER CON FLECHA ATRÁS === */}
      <View style={tw`px-4 py-3 flex-row items-center bg-slate-950 z-10 border-b border-slate-800`}>
        <TouchableOpacity 
          onPress={() => router.back()} 
          style={tw`p-2 bg-slate-800 rounded-full mr-4 border border-slate-700`}
        >
          <ArrowLeft color="white" size={24} />
        </TouchableOpacity>
        <Text style={tw`text-white font-bold text-xl`}>Mi Cuenta</Text>
      </View>

      <ScrollView contentContainerStyle={tw`pb-20`}>
        <View style={tw`px-4 pt-4`}>
            {/* Info de Usuario */}
            <ProfileHeader 
              nombres={user.nombres}
              primer_apellido={user.primer_apellido}
              fotoUrl={user.foto_url}
              oficio={user.rol}
              resumen="Gestiona tu actividad, calendario y datos personales."
              estaVerificado={true}
            />

            {/* === 2. TABS RESPONSIVAS (SCROLL HORIZONTAL) === */}
            <View style={tw`mb-6`}>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false} 
                style={tw`flex-row`}
                contentContainerStyle={tw`pr-4`} // Padding derecho para el último item
              >
                {tabs.filter(t => t.show).map(t => {
                  const isActive = activeTabId === t.id;
                  return (
                    <TouchableOpacity
                      key={t.id}
                      onPress={() => setActiveTabId(t.id)}
                      style={tw`flex-row items-center px-5 py-3 mr-3 rounded-full border ${
                        isActive 
                          ? 'bg-slate-800 border-cyan-500' 
                          : 'bg-transparent border-slate-800'
                      }`}
                    >
                      <t.icon 
                        size={18} 
                        color={isActive ? '#22d3ee' : '#94a3b8'} 
                      />
                      <Text style={tw`ml-2 font-bold text-sm ${
                        isActive ? 'text-cyan-400' : 'text-slate-400'
                      }`}>
                        {t.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>

            {/* === 3. CONTENIDO DE LA PESTAÑA ACTIVA === */}
            <View style={tw`flex-1`}>
              <Text style={tw`text-xl font-bold text-white mb-4 ml-1`}>
                {activeTab.label}
              </Text>
              {/* Renderizamos el componente seleccionado */}
              {activeTab.component}
            </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}