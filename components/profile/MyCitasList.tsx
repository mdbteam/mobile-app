import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { AlertCircle, Clock, Star } from 'lucide-react-native';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  ActivityIndicator,
  Alert,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import tw from 'twrnc';
import { z } from 'zod';
import { useAuthStore } from '../../store/authStore';

// --- CONFIGURACIÓN CALENDARIO ---
LocaleConfig.locales['es'] = {
  monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
  monthNamesShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
  dayNames: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
  dayNamesShort: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
  today: 'Hoy'
};
LocaleConfig.defaultLocale = 'es';

// --- TIPOS ---
interface CitaDetail {
  id_cita: number;
  id_cliente: number;
  id_prestador: number;
  fecha_hora_cita: string;
  detalles: string | null;
  estado: string;
  id_trabajo: number | null;
  estado_trabajo: string | null;
  cliente_nombres: string | null;
  prestador_nombres: string | null;
  id_valoracion: number | null;
  direccion?: string; 
}

const trabajoSchema = z.object({
  descripcion: z.string().min(10, "Mínimo 10 caracteres"),
  condiciones: z.string().optional().nullable(),
  precio_acordado: z.number().min(0, "Precio inválido"),
});

const ratingSchema = z.object({
  puntaje: z.number().min(1).max(5),
  comentario: z.string().min(10, "Mínimo 10 caracteres").optional().nullable(),
});

// --- CLIENTES API (MICROSERVICIOS) ---

// 1. Servicio de Calendario (Gestiona Citas)
const apiCalendario = axios.create({
  baseURL: 'https://calendario-service-u5f6.onrender.com', 
});

// 2. Servicio de Proveedores (Gestiona Trabajos)
const apiProveedores = axios.create({
  baseURL: 'https://provider-service-mjuj.onrender.com', 
});


// --- FETCH CITAS ---
const fetchMyCitas = async (token: string | null) => {
  if (!token) throw new Error("No token");
  // Endpoint correcto verificado: GET /citas/me
  const { data } = await apiCalendario.get<CitaDetail[]>("/citas/me", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

// --- COMPONENTE BADGE ---
function CitaStatusBadge({ cita }: { cita: CitaDetail }) {
  if (cita.estado_trabajo) {
    let color = "bg-blue-900 border-blue-700"; 
    let textColor = "text-blue-300";
    let texto = `Trabajo: ${cita.estado_trabajo}`;

    switch (cita.estado_trabajo.toLowerCase().trim()) {
      case 'aceptado': color = "bg-green-900 border-green-700"; textColor = "text-green-300"; texto = "En Progreso"; break;
      case 'finalizado': color = "bg-indigo-900 border-indigo-700"; textColor = "text-indigo-300"; texto = "Finalizado"; break;
      case 'confirmado':
      case 'valorado': color = "bg-purple-900 border-purple-700"; textColor = "text-purple-300"; texto = "Completado"; break;
    }
    return (
      <View style={tw`${color} px-2 py-1 rounded-full border`}>
        <Text style={tw`${textColor} text-xs font-bold capitalize`}>{texto}</Text>
      </View>
    );
  }

  const estado = cita.estado.toLowerCase().trim();
  let color = "bg-red-900 border-red-700";
  let textColor = "text-red-300";
  
  switch (estado) {
    case 'pendiente': color = "bg-yellow-900 border-yellow-700"; textColor = "text-yellow-300"; break;
    case 'aceptada': color = "bg-green-900 border-green-700"; textColor = "text-green-300"; break;
  }

  return (
    <View style={tw`${color} px-2 py-1 rounded-full border`}>
      <Text style={tw`${textColor} text-xs font-bold capitalize`}>{cita.estado}</Text>
    </View>
  );
}

// --- MODAL: CREAR PROPUESTA (Provider Service) ---
function CreateTrabajoModal({ cita, isOpen, onClose, onSuccess }: any) {
  const { token } = useAuthStore();
  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(trabajoSchema)
  });

  const mutation = useMutation({
    mutationFn: (data: any) => apiProveedores.post('/trabajos', 
      { ...data, id_cita: cita.id_cita, id_cliente: cita.id_cliente, id_prestador: cita.id_prestador }, 
      { headers: { Authorization: `Bearer ${token}` } }
    ),
    onSuccess: () => { onSuccess(); onClose(); },
    onError: () => Alert.alert("Error", "No se pudo enviar la propuesta")
  });

  return (
    <Modal visible={isOpen} transparent animationType="slide">
      <View style={tw`flex-1 bg-black/80 justify-center p-4`}>
        <View style={tw`bg-slate-900 p-6 rounded-2xl border border-slate-700`}>
          <Text style={tw`text-white text-xl font-bold mb-4`}>Nueva Propuesta</Text>
          
          <Text style={tw`text-slate-400 mb-2 text-sm`}>
            Cita: {new Date(cita.fecha_hora_cita).toLocaleDateString()}
          </Text>

          <Text style={tw`text-white mb-1 font-bold`}>Descripción</Text>
          <Controller
            control={control}
            name="descripcion"
            render={({ field: { onChange, value } }) => (
              <TextInput 
                style={tw`bg-slate-800 text-white p-3 rounded-lg border border-slate-700 mb-2 h-20`}
                multiline
                placeholder="Detalla el trabajo..."
                placeholderTextColor="#64748b"
                onChangeText={onChange}
                value={value}
              />
            )}
          />
          {errors.descripcion && <Text style={tw`text-red-400 text-xs mb-2`}>{String(errors.descripcion.message)}</Text>}

          <Text style={tw`text-white mb-1 font-bold mt-2`}>Precio (CLP)</Text>
          <Controller
            control={control}
            name="precio_acordado"
            render={({ field: { onChange, value } }) => (
              <TextInput 
                style={tw`bg-slate-800 text-white p-3 rounded-lg border border-slate-700 mb-4`}
                keyboardType="numeric"
                placeholder="0"
                placeholderTextColor="#64748b"
                onChangeText={(text) => onChange(Number(text))}
                value={value ? String(value) : ''}
              />
            )}
          />

          <View style={tw`flex-row gap-4`}>
            <TouchableOpacity onPress={onClose} style={tw`flex-1 bg-slate-800 py-3 rounded-xl items-center`}>
                <Text style={tw`text-white font-bold`}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity 
                onPress={handleSubmit((data) => mutation.mutate(data))}
                style={tw`flex-1 bg-cyan-500 py-3 rounded-xl items-center`}
            >
                <Text style={tw`text-slate-900 font-bold`}>
                {mutation.isLoading ? "Enviando..." : "Enviar"}
                </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

// --- MODAL: VALORAR (Provider Service) ---
function RateTrabajoModal({ trabajoId, isOpen, onClose, onSuccess }: any) {
  const { token } = useAuthStore();
  const [rating, setRating] = useState(0);
  const { control, handleSubmit, setValue } = useForm({
    resolver: zodResolver(ratingSchema)
  });

  const mutation = useMutation({
    mutationFn: (data: any) => apiProveedores.post(`/trabajos/${trabajoId}/valorar`, 
      data, 
      { headers: { Authorization: `Bearer ${token}` } }
    ),
    onSuccess: () => { onSuccess(); onClose(); },
    onError: () => Alert.alert("Error", "No se pudo enviar la valoración")
  });

  const handleRate = (star: number) => {
    setRating(star);
    setValue('puntaje', star);
  };

  return (
    <Modal visible={isOpen} transparent animationType="fade">
      <View style={tw`flex-1 bg-black/80 justify-center p-4`}>
        <View style={tw`bg-slate-900 p-6 rounded-2xl border border-slate-700 items-center`}>
          <Text style={tw`text-white text-xl font-bold mb-2`}>Valorar Trabajo</Text>
          <View style={tw`flex-row gap-2 mb-6`}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity key={star} onPress={() => handleRate(star)}>
                <Star size={40} color={rating >= star ? '#facc15' : '#475569'} fill={rating >= star ? '#facc15' : 'transparent'} />
              </TouchableOpacity>
            ))}
          </View>
          <Controller
            control={control}
            name="comentario"
            render={({ field: { onChange, value } }) => (
              <TextInput 
                style={tw`bg-slate-800 text-white p-3 rounded-lg border border-slate-700 w-full mb-4 h-24`}
                multiline
                placeholder="Escribe un comentario..."
                placeholderTextColor="#64748b"
                onChangeText={onChange}
                value={value}
              />
            )}
          />
          <View style={tw`flex-row gap-4 w-full`}>
            <TouchableOpacity onPress={onClose} style={tw`flex-1 bg-slate-800 py-3 rounded-xl items-center`}><Text style={tw`text-white font-bold`}>Cancelar</Text></TouchableOpacity>
            <TouchableOpacity onPress={handleSubmit((data) => mutation.mutate(data))} style={tw`flex-1 bg-yellow-500 py-3 rounded-xl items-center`} disabled={rating === 0}><Text style={tw`text-slate-900 font-bold`}>Enviar</Text></TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

// --- COMPONENTE PRINCIPAL ---
export function MyCitasList() {
  const { token, user } = useAuthStore();
  const queryClient = useQueryClient();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  
  const [modalProposal, setModalProposal] = useState<CitaDetail | null>(null);
  const [modalRating, setModalRating] = useState<number | null>(null);

  const esPrestador = user?.rol.toLowerCase().trim() === 'prestador' || user?.rol.toLowerCase().trim() === 'hibrido';
  const esCliente = !esPrestador;

  const { data: citas, isLoading, error } = useQuery({
    queryKey: ["myCitas"],
    queryFn: () => fetchMyCitas(token),
  });

  // Mutación Inteligente: Decide a qué API llamar según la acción
  const actionMutation = useMutation({
    mutationFn: async ({ url, service }: { url: string, service: 'calendario' | 'proveedores' }) => {
      const api = service === 'calendario' ? apiCalendario : apiProveedores;
      return api.post(url, {}, { headers: { Authorization: `Bearer ${token}` } });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myCitas'] });
      Alert.alert("Éxito", "Operación realizada");
    },
    onError: (e) => {
        console.error(e);
        Alert.alert("Error", "Algo salió mal");
    }
  });

  const handleAction = (url: string, service: 'calendario' | 'proveedores') => {
      actionMutation.mutate({ url, service });
  };

  if (error) {
    return (
        <View style={tw`bg-slate-800/50 p-4 rounded-lg mt-4 flex-row items-center justify-center`}>
            <AlertCircle color="#ef4444" size={20} />
            <Text style={tw`text-red-400 text-center ml-2`}>Error cargando citas</Text>
        </View>
    );
  }

  const markedDates: any = {};
  citas?.forEach(cita => {
    const fecha = cita.fecha_hora_cita.split('T')[0];
    let color = esPrestador ? '#facc15' : '#22d3ee';
    if (cita.estado === 'completada' || cita.estado_trabajo === 'confirmado') color = '#4ade80';
    markedDates[fecha] = { marked: true, dotColor: color };
  });
  
  markedDates[selectedDate] = { 
    ...markedDates[selectedDate], 
    selected: true, 
    selectedColor: esPrestador ? '#facc15' : '#22d3ee', 
    selectedTextColor: '#0f172a' 
  };

  const citasDelDia = citas?.filter(c => c.fecha_hora_cita.startsWith(selectedDate)) || [];

  return (
    <View>
      {/* CALENDARIO */}
      <View style={tw`bg-slate-800 rounded-xl overflow-hidden border border-slate-700 mb-6`}>
        <Calendar
          current={selectedDate}
          onDayPress={(day: any) => setSelectedDate(day.dateString)}
          markedDates={markedDates}
          theme={{
            calendarBackground: '#1e293b',
            dayTextColor: '#ffffff',
            monthTextColor: '#ffffff',
            textDisabledColor: '#475569',
            arrowColor: esPrestador ? '#facc15' : '#22d3ee',
            todayTextColor: esPrestador ? '#facc15' : '#22d3ee',
          }}
        />
      </View>

      <Text style={tw`text-white font-bold text-xl mb-4`}>
        {esPrestador ? 'Trabajos del Día' : 'Mis Reservas'}
      </Text>

      {/* LISTA */}
      {isLoading ? <ActivityIndicator color="#22D3EE" /> : (
        citasDelDia.length === 0 ? (
          <View style={tw`bg-slate-800/50 p-6 rounded-xl items-center`}>
            <Text style={tw`text-slate-400`}>Nada programado para el {selectedDate}.</Text>
          </View>
        ) : (
          citasDelDia.map((cita) => {
            const hora = new Date(cita.fecha_hora_cita).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            return (
              <View key={cita.id_cita} style={tw`bg-slate-800 p-4 rounded-xl mb-4 border border-slate-700`}>
                <View style={tw`flex-row justify-between items-start mb-2`}>
                   <View style={tw`flex-row items-center`}>
                      <Clock size={16} color="#94a3b8" />
                      <Text style={tw`text-white font-bold text-lg ml-2`}>{hora}</Text>
                   </View>
                   <CitaStatusBadge cita={cita} />
                </View>
                <Text style={tw`text-slate-300 mb-1`}>
                   {esPrestador ? 'Cliente:' : 'Profesional:'} {esPrestador ? cita.cliente_nombres : cita.prestador_nombres}
                </Text>
                {cita.detalles && <Text style={tw`text-slate-500 text-sm italic mb-3`}>"{cita.detalles}"</Text>}
                
                <View style={tw`mt-2 pt-2 border-t border-slate-700`}>
                  {/* ACCIONES PRESTADOR */}
                  {esPrestador && (
                    <View style={tw`flex-row gap-2 flex-wrap`}>
                      {cita.estado.toLowerCase() === 'pendiente' && (
                        <>
                          {/* Cita -> Calendario Service */}
                          <TouchableOpacity onPress={() => handleAction(`/citas/${cita.id_cita}/rechazar`, 'calendario')} style={tw`bg-red-900/50 border border-red-800 py-2 px-3 rounded-lg flex-1 items-center`}><Text style={tw`text-red-400 font-bold`}>Rechazar</Text></TouchableOpacity>
                          <TouchableOpacity onPress={() => handleAction(`/citas/${cita.id_cita}/aceptar`, 'calendario')} style={tw`bg-green-600 py-2 px-3 rounded-lg flex-1 items-center`}><Text style={tw`text-white font-bold`}>Aceptar</Text></TouchableOpacity>
                        </>
                      )}
                      {cita.estado.toLowerCase() === 'aceptada' && !cita.id_trabajo && (
                        <TouchableOpacity onPress={() => setModalProposal(cita)} style={tw`bg-cyan-600 py-2 px-4 rounded-lg w-full items-center`}><Text style={tw`text-white font-bold`}>Crear Propuesta</Text></TouchableOpacity>
                      )}
                      {cita.estado_trabajo === 'aceptado' && (
                        /* Trabajo -> Provider Service */
                        <TouchableOpacity onPress={() => handleAction(`/trabajos/${cita.id_trabajo}/finalizar`, 'proveedores')} style={tw`bg-indigo-600 py-2 px-4 rounded-lg w-full items-center`}><Text style={tw`text-white font-bold`}>Finalizar Trabajo</Text></TouchableOpacity>
                      )}
                    </View>
                  )}

                  {/* ACCIONES CLIENTE */}
                  {esCliente && (
                    <View style={tw`flex-row gap-2 flex-wrap`}>
                       {cita.estado_trabajo === 'propuesto' && (
                          <TouchableOpacity onPress={() => handleAction(`/trabajos/${cita.id_trabajo}/aceptar`, 'proveedores')} style={tw`bg-green-600 py-2 px-4 rounded-lg w-full items-center`}><Text style={tw`text-white font-bold`}>Aceptar Propuesta</Text></TouchableOpacity>
                       )}
                       {cita.estado_trabajo === 'finalizado' && (
                          <TouchableOpacity onPress={() => handleAction(`/trabajos/${cita.id_trabajo}/confirmar`, 'proveedores')} style={tw`bg-purple-600 py-2 px-4 rounded-lg w-full items-center`}><Text style={tw`text-white font-bold`}>Confirmar & Pagar</Text></TouchableOpacity>
                       )}
                       {cita.estado_trabajo === 'confirmado' && !cita.id_valoracion && (
                          <TouchableOpacity onPress={() => setModalRating(cita.id_trabajo!)} style={tw`bg-yellow-500 py-2 px-4 rounded-lg w-full items-center`}><Text style={tw`text-slate-900 font-bold`}>Valorar</Text></TouchableOpacity>
                       )}
                    </View>
                  )}
                </View>
              </View>
            );
          })
        )
      )}

      {/* MODALES */}
      {modalProposal && <CreateTrabajoModal cita={modalProposal} isOpen={true} onClose={() => setModalProposal(null)} onSuccess={() => queryClient.invalidateQueries({ queryKey: ['myCitas'] })} />}
      {modalRating && <RateTrabajoModal trabajoId={modalRating} isOpen={true} onClose={() => setModalRating(null)} onSuccess={() => queryClient.invalidateQueries({ queryKey: ['myCitas'] })} />}
    </View>
  );
}