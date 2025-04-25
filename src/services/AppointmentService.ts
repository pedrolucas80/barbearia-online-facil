
import { supabase } from "@/integrations/supabase/client";

export interface Appointment {
  id: string;
  user_id: string;
  barber_id: string;
  date: string;
  time: string;
  code: string;
  status?: 'pending' | 'confirmed' | 'canceled';
}

export interface Barber {
  id: string;
  name: string;
  active: boolean;
}

export const getAppointments = async (userId: string): Promise<Appointment[]> => {
  const { data, error } = await supabase
    .from('appointments')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: true });
  
  if (error) throw error;
  
  return (data || []).map(item => ({
    ...item,
    status: (item.status as 'pending' | 'confirmed' | 'canceled' | null) || undefined
  })) as Appointment[];
};

// Função para carregar todos os agendamentos (para o admin)
export const getAllAppointments = async (): Promise<Appointment[]> => {
  const { data, error } = await supabase
    .from('appointments')
    .select('*')
    .order('date', { ascending: true });
  
  if (error) throw error;
  
  return (data || []).map(item => ({
    ...item,
    status: (item.status as 'pending' | 'confirmed' | 'canceled' | null) || undefined
  })) as Appointment[];
};

export const saveAppointment = async (
  userId: string,
  appointment: Pick<Appointment, 'barber_id' | 'date' | 'time'>
): Promise<Appointment> => {
  const { data, error } = await supabase
    .from('appointments')
    .insert({
      user_id: userId,
      barber_id: appointment.barber_id,
      date: appointment.date,
      time: appointment.time,
      status: 'pending'
    })
    .select()
    .single();
  
  if (error) throw error;
  
  return {
    ...data,
    status: data.status as 'pending' | 'confirmed' | 'canceled'
  } as Appointment;
};

export const cancelAppointment = async (appointmentId: string): Promise<void> => {
  const { error } = await supabase
    .from('appointments')
    .update({ status: 'canceled' })
    .eq('id', appointmentId);
  
  if (error) throw error;
};

export const confirmAppointment = async (appointmentId: string): Promise<void> => {
  const { error } = await supabase
    .from('appointments')
    .update({ status: 'confirmed' })
    .eq('id', appointmentId);
  
  if (error) throw error;
};

export const getBookedTimes = async (date: Date, barberId: string): Promise<string[]> => {
  const formattedDate = date.toISOString().split('T')[0];
  
  const { data, error } = await supabase
    .from('appointments')
    .select('time')
    .eq('barber_id', barberId)
    .eq('date', formattedDate)
    .not('status', 'eq', 'canceled');
  
  if (error) throw error;
  return data?.map(app => app.time) || [];
};

// Nova função: buscar barbeiros do Supabase
export const getBarbers = async (): Promise<Barber[]> => {
  const { data, error } = await supabase
    .from('barbers')
    .select('*')
    .order('name', { ascending: true });
  if (error) throw error;
  return data as Barber[];
};

// Atualizar status do barbeiro (admin)
export const setBarberActiveStatus = async (barberId: string, active: boolean) => {
  const { error } = await supabase
    .from('barbers')
    .update({ active })
    .eq('id', barberId);
  if (error) throw error;
};

// Buscar nome do barbeiro (buscando em cache dos barbers, ou retornar id)
export const getBarberName = (barberId: string, barbers?: Barber[]): string => {
  if (barbers) {
    const barber = barbers.find(b => b.id === barberId);
    return barber ? barber.name : "Barbeiro Desconhecido";
  }
  return "Barbeiro Desconhecido";
};

export const initializeAppData = (): void => {
  console.log("Appointment service initialized");
};
