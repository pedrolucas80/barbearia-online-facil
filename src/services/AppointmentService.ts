
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

export const getAppointments = async (userId: string): Promise<Appointment[]> => {
  const { data, error } = await supabase
    .from('appointments')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: true });
  
  if (error) throw error;
  
  // Type assertion to ensure status is one of the valid values or undefined
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
  
  // Type assertion to ensure we return the correct type
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

export const getBarbers = () => {
  return [
    { id: "1", name: "Barbeiro 1" },
    { id: "2", name: "Barbeiro 2" }
  ];
};

export const getBarberName = (barberId: string): string => {
  const barbers = getBarbers();
  const barber = barbers.find(b => b.id === barberId);
  return barber ? barber.name : "Barbeiro Desconhecido";
};

export const initializeAppData = (): void => {
  console.log("Appointment service initialized");
};
