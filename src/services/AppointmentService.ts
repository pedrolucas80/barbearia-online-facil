
// Serviço para gerenciar agendamentos

export interface Appointment {
  id: string;
  clientEmail: string;
  barberId: string;
  date: string;
  time: string;
}

export const getAppointments = (): Appointment[] => {
  return JSON.parse(localStorage.getItem("appointments") || "[]");
};

export const saveAppointment = (appointment: Omit<Appointment, "id">): Appointment => {
  const appointments = getAppointments();
  
  const newAppointment = {
    ...appointment,
    id: Date.now().toString(),
  };
  
  appointments.push(newAppointment);
  localStorage.setItem("appointments", JSON.stringify(appointments));
  
  return newAppointment;
};

export const getBookedTimes = (date: Date, barberId: string): string[] => {
  const appointments = getAppointments();
  
  return appointments
    .filter(appointment => {
      const appointmentDate = new Date(appointment.date);
      return (
        appointmentDate.getDate() === date.getDate() &&
        appointmentDate.getMonth() === date.getMonth() &&
        appointmentDate.getFullYear() === date.getFullYear() &&
        appointment.barberId === barberId
      );
    })
    .map(appointment => appointment.time);
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

export const initializeAppData = () => {
  // Verificar se já temos dados iniciais
  if (!localStorage.getItem("dataInitialized")) {
    // Criar conta admin padrão
    localStorage.setItem("adminCredentials", JSON.stringify({
      email: "admin@barbearia.com",
      password: "admin123"
    }));
    
    localStorage.setItem("dataInitialized", "true");
  }
};
