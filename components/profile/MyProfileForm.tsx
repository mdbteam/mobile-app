import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ActivityIndicator, Alert, Text, TextInput, TouchableOpacity, View } from 'react-native';
import tw from 'twrnc';
import { z } from 'zod';
import { useAuthStore } from '../../store/authStore';

// --- ESQUEMA ZOD ---
const profileUpdateSchema = z.object({
  nombres: z.string().min(2, "El nombre es muy corto"),
  primer_apellido: z.string().min(2, "El apellido es muy corto"),
  segundo_apellido: z.string().optional().nullable(),
  direccion: z.string().optional().nullable(),
  genero: z.string().optional().nullable(),
  fecha_nacimiento: z.string().optional().nullable(),
  biografia: z.string().optional().nullable(),
  resumen_profesional: z.string().optional().nullable(),
  anos_experiencia: z.coerce.number().min(0).optional().nullable(),
  correo: z.string().email("Correo no válido"),
  telefono: z.string().optional().nullable(),
  rut: z.string().optional(), // Agregado para lectura
});

type ProfileFormInputs = z.infer<typeof profileUpdateSchema>;

interface MyProfileData extends ProfileFormInputs {
  id: string;
  rut: string;
  rol: string;
  foto_url: string;
}

// --- API CLIENT (Provider Service) ---
const apiProfile = axios.create({
  // 👇 CAMBIO CLAVE: Apuntamos al servicio de Proveedores/Datos, no al de Auth
  baseURL: 'https://provider-service-mjuj.onrender.com', 
});

const fetchMyProfile = async (token: string | null): Promise<MyProfileData> => {
  if (!token) throw new Error("No token");
  // Endpoint: /profile/me
  const { data } = await apiProfile.get('/profile/me', {
    headers: { Authorization: `Bearer ${token}` }
  });
  return data;
};

const updateMyProfile = async ({ data, token }: { data: Partial<ProfileFormInputs>, token: string | null }) => {
  if (!token) throw new Error("No token");
  return apiProfile.patch('/profile/me', data, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

// --- COMPONENTE ---
export function MyProfileForm() {
  const { token, setUser, user } = useAuthStore();
  const queryClient = useQueryClient();

  const { data: profileData, isLoading, error } = useQuery({
    queryKey: ['myProfile'],
    queryFn: () => fetchMyProfile(token),
    retry: false,
  });

  const { control, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ProfileFormInputs>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: {
      nombres: "", primer_apellido: "", segundo_apellido: "",
      direccion: "", genero: "", fecha_nacimiento: "",
      biografia: "", resumen_profesional: "", anos_experiencia: 0,
      correo: "", telefono: "",
    }
  });

  useEffect(() => {
    if (profileData) {
      const cleanData = Object.fromEntries(
        Object.entries(profileData).map(([k, v]) => [k, v === null ? "" : v])
      );
      reset(cleanData as any);
    }
  }, [profileData, reset]);

  const mutation = useMutation({
    mutationFn: updateMyProfile,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['myProfile'] });
      if (user) {
        setUser({ ...user, ...response.data });
      }
      Alert.alert("Éxito", "Perfil actualizado correctamente.");
    },
    onError: () => {
      Alert.alert("Error", "No se pudo guardar tu perfil.");
    }
  });

  const onSubmit = (formData: ProfileFormInputs) => {
    mutation.mutate({ data: formData, token });
  };

  if (isLoading) return <ActivityIndicator size="large" color="#22D3EE" style={tw`my-10`} />;
  
  if (error) {
    return (
      <View style={tw`p-4 bg-slate-800 rounded-lg items-center mt-6`}>
        <Text style={tw`text-red-400 font-bold mb-1`}>Error de conexión</Text>
        <Text style={tw`text-slate-500 text-xs text-center`}>
          No pudimos cargar tu perfil desde el servidor.
        </Text>
      </View>
    );
  }

  const renderInput = (name: keyof ProfileFormInputs, label: string, placeholder?: string, keyboard: 'default' | 'numeric' | 'email-address' = 'default', multiline = false) => (
    <View style={tw`mb-4`}>
      <Text style={tw`text-slate-300 text-sm font-bold mb-2`}>{label}</Text>
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={tw`bg-slate-800 text-white p-3 rounded-lg border border-slate-700 ${multiline ? 'h-24 text-top' : ''}`}
            placeholder={placeholder}
            placeholderTextColor="#64748b"
            onBlur={onBlur}
            onChangeText={keyboard === 'numeric' ? (t) => onChange(Number(t)) : onChange}
            value={value ? String(value) : ''}
            keyboardType={keyboard}
            multiline={multiline}
          />
        )}
      />
      {errors[name] && <Text style={tw`text-red-400 text-xs mt-1`}>{errors[name]?.message}</Text>}
    </View>
  );

  return (
    <View style={tw`bg-slate-900 p-4 rounded-xl`}>
      
      <Text style={tw`text-cyan-400 font-bold text-lg mb-4 border-b border-slate-800 pb-2`}>Datos Personales</Text>
      
      {renderInput("nombres", "Nombres")}
      {renderInput("primer_apellido", "Primer Apellido")}
      {renderInput("segundo_apellido", "Segundo Apellido (Opcional)")}
      
      {/* RUT Solo Lectura */}
      <View style={tw`mb-4`}>
        <Text style={tw`text-slate-300 text-sm font-bold mb-2`}>RUT</Text>
        <TextInput
          style={tw`bg-slate-800 text-slate-400 p-3 rounded-lg border border-slate-700 opacity-60`}
          value={profileData?.rut || ''}
          editable={false}
          placeholder="Sin RUT"
          placeholderTextColor="#64748b"
        />
      </View>

      {renderInput("fecha_nacimiento", "Fecha de Nacimiento (YYYY-MM-DD)")}
      {renderInput("genero", "Género")}

      <Text style={tw`text-cyan-400 font-bold text-lg mb-4 mt-4 border-b border-slate-800 pb-2`}>Contacto</Text>
      
      {renderInput("correo", "Correo Electrónico", "ejemplo@mail.com", "email-address")}
      {renderInput("telefono", "Teléfono")}
      {renderInput("direccion", "Dirección")}

      <Text style={tw`text-cyan-400 font-bold text-lg mb-4 mt-4 border-b border-slate-800 pb-2`}>Perfil Profesional</Text>
      
      {renderInput("anos_experiencia", "Años de Experiencia", "0", "numeric")}
      {renderInput("resumen_profesional", "Resumen Profesional", "Breve descripción...", "default", true)}
      {renderInput("biografia", "Biografía", "Cuéntanos más sobre ti...", "default", true)}

      <TouchableOpacity 
        onPress={handleSubmit(onSubmit)}
        style={tw`bg-cyan-500 py-4 rounded-xl items-center mt-6 shadow-lg`}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <ActivityIndicator color="#0f172a" />
        ) : (
          <Text style={tw`text-slate-900 font-bold text-lg`}>Guardar Cambios</Text>
        )}
      </TouchableOpacity>

    </View>
  );
}