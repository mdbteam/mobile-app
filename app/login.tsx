import { MaterialIcons } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from 'twrnc';
import { z } from 'zod';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useAuthStore } from '../store/authStore';

// ============================
// 🔥 VALIDACIONES
// ============================
const loginSchema = z.object({
  correo: z.string().email("Correo inválido").min(1, "El correo es requerido"),
  password: z.string()
    .min(6, "La contraseña debe tener al menos 6 caracteres")
    .min(1, "La contraseña es requerida"),
});

type LoginFormInputs = z.infer<typeof loginSchema>;

interface ErrorResponse {
  message?: string;
  detail?: string | { msg: string }[];
}

// Manejo de errores backend
function getLoginErrorMessage(err: unknown): string {
  console.error("Error de login:", err);
  if (!axios.isAxiosError(err)) return "Ocurrió un error inesperado.";
  const { response } = err as AxiosError<ErrorResponse>;
  if (!response) return "Error de red o servidor inaccesible.";
  const { status, data } = response;
  if (status === 422 && Array.isArray(data.detail)) return data.detail[0].msg;
  if (typeof data?.detail === "string") return data.detail;
  if (status === 401) return "Correo o contraseña incorrectos.";
  if (status === 404) return "Servicio no disponible temporalmente.";
  return "Ocurrió un error. Intenta de nuevo.";
}

// ============================
// 🔥 COMPONENTE LOGIN
// ============================
export default function LoginScreen() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);

  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
    defaultValues: { correo: "", password: "" },
  });

  const onSubmit = async (data: LoginFormInputs) => {
    setServerError(null);
    try {
      const params = new URLSearchParams();
      params.append("grant_type", "password"); // requerido por el backend
      params.append("username", data.correo);
      params.append("password", data.password);

      const response = await axios.post(
        "https://auth-service-1-8301.onrender.com/auth/login", // endpoint correcto
        params,
        { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
      );

      const { token, usuario } = response.data;
      login(token, usuario);
      router.replace("/(tabs)/home");

    } catch (err) {
      const msg = getLoginErrorMessage(err);
      setServerError(msg);
      Alert.alert("Error de Acceso", msg);
    }
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-slate-900`}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={tw`flex-1`}>
        <ScrollView contentContainerStyle={tw`flex-grow justify-center px-6`}>

          <View style={tw`mb-10 items-center`}>
            <Text style={tw`text-4xl font-bold text-white`}>
              Cham<Text style={tw`text-amber-300`}>Bee</Text>
            </Text>
            <Text style={tw`text-slate-400 mt-2 text-center`}>
              Tu solución experta al instante
            </Text>
          </View>

          <View style={tw`gap-4`}>

            {/* CORREO */}
            <Controller
              name="correo"
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Correo Electrónico"
                  placeholder="ejemplo@correo.com"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  error={errors.correo?.message}
                  accessible
                  accessibilityLabel="Correo Electrónico"
                />
              )}
            />

            {/* CONTRASEÑA */}
            <Controller
              name="password"
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Contraseña"
                  placeholder="******"
                  secureTextEntry={!showPassword}
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  error={errors.password?.message}
                  rightIcon={
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                      <MaterialIcons
                        name={showPassword ? "visibility" : "visibility-off"}
                        size={24}
                        color="gray"
                      />
                    </TouchableOpacity>
                  }
                  accessible
                  accessibilityLabel="Contraseña"
                />
              )}
            />

            {/* ERROR DEL SERVIDOR */}
            {serverError && (
              <Text style={tw`text-center text-red-400 mt-2`} accessibilityRole="alert">
                {serverError}
              </Text>
            )}

            {/* BOTÓN LOGIN */}
            <View style={tw`mt-4`}>
              <Button
                title={isSubmitting ? "Iniciando..." : "Iniciar Sesión"}
                onPress={handleSubmit(onSubmit)}
                disabled={isSubmitting}
                isLoading={isSubmitting}
              />
            </View>

            {/* LINKS ADICIONALES */}
            
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
