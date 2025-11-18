import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import axios, { AxiosError } from 'axios';
import { useAuthStore } from '../store/authStore';

import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

// UI Components
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

// ============================
// 🔥 SCHEMA
// ============================
const loginSchema = z.object({
  correo: z.string().email("Correo inválido").min(1, "El correo es requerido"),
  password: z.string().min(1, "La contraseña es requerida"),
});

type LoginFormInputs = z.infer<typeof loginSchema>;

interface ErrorResponse {
  message?: string;
  detail?: string | { msg: string }[];
}

// Manejo de errores del backend
function getLoginErrorMessage(err: unknown): string {
  console.error("Error de login:", err);

  if (!axios.isAxiosError(err)) return "Ocurrió un error inesperado.";
  const { response } = err as AxiosError<ErrorResponse>;
  if (!response) return "Error de red o servidor inaccesible.";

  const { status, data } = response;

  if (status === 422 && Array.isArray(data.detail)) {
    return data.detail[0].msg;
  }

  if (typeof data?.detail === "string") return data.detail;
  if (status === 401) return "Correo o contraseña incorrectos.";

  return "Ocurrió un error. Intenta de nuevo.";
}

// ============================
// 🔥 COMPONENTE LOGIN
// ============================
export default function LoginScreen() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);

  const [serverError, setServerError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      correo: "",
      password: "",
    },
  });

  // ============================
  // 🔐 LOGIN SUBMIT
  // ============================
  const onSubmit = async (data: LoginFormInputs) => {
    setServerError(null);

    try {
      // IMPORTANTE → FastAPI OAuth2 espera x-www-form-urlencoded
      const params = new URLSearchParams();
      params.append("username", data.correo);
      params.append("password", data.password);

      const response = await axios.post("/auth/login", params, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      const { token, usuario } = response.data;

      // Guardar en Zustand
      login(token, usuario);

      Alert.alert("Bienvenido", `Hola ${usuario.nombres}`);

      router.replace("/(tabs)/home");
    } catch (err) {
      const msg = getLoginErrorMessage(err);
      setServerError(msg);
      Alert.alert("Error", msg);
    }
  };

  // ============================
  // 🔥 UI LOGIN
  // ============================
  return (
    <SafeAreaView className="flex-1 bg-slate-900 justify-center px-6">
      <View className="mb-10 items-center">
        <Text className="text-4xl font-bold text-white font-poppins">
          Cham<Text className="text-cyan-400">Bee</Text>
        </Text>
        <Text className="text-slate-400 mt-2">Tu solución experta al instante</Text>
      </View>

      <View className="space-y-4">
        {/* === CORREO === */}
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
            />
          )}
        />

        {/* === PASSWORD === */}
        <Controller
          name="password"
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Contraseña"
              placeholder="******"
              secureTextEntry
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              error={errors.password?.message}
            />
          )}
        />

        {/* === ERROR DEL SERVIDOR === */}
        {serverError && (
          <Text className="text-center text-red-400">{serverError}</Text>
        )}

        {/* === BOTÓN === */}
        <Button
          title={isSubmitting ? "Entrando..." : "Entrar"}
          onPress={handleSubmit(onSubmit)}
          disabled={isSubmitting}
          isLoading={isSubmitting}
          className="mt-4"
        />
      </View>
    </SafeAreaView>
  );
}
