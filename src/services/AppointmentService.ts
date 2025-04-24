
import { supabase } from "@/integrations/supabase/client";

export interface Appointment {
  id: string;
  user_id: string;
  barber_id: string;
  date: string;
  time: string;
  code: string;
}

export const getAppointments = async (userId: string): Promise<Appointment[]> => {
  const { data, error } = await supabase
    .from('appointments')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: true });
  
  if (error) throw error;
  return data || [];
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
      time: appointment.time
    })
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const getBookedTimes = async (date: Date, barberId: string): Promise<string[]> => {
  const { data, error } = await supabase
    .from('appointments')
    .select('time')
    .eq('barber_id', barberId)
    .eq('date', date.toISOString().split('T')[0]);
  
  if (error) throw error;
  return data.map(app => app.time);
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
