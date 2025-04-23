
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { getAppointments, getBarberName, Appointment } from "@/services/AppointmentService";

const MyAppointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Verificar se o usuário está autenticado
    const userEmail = localStorage.getItem("userEmail");
    if (!userEmail) {
      navigate("/");
      return;
    }

    // Carregar agendamentos do usuário
    const loadAppointments = () => {
      setIsLoading(true);
      setTimeout(() => {
        const allAppointments = getAppointments();
        const userAppointments = allAppointments.filter(
          (appointment) => appointment.clientEmail === userEmail
        );
        
        // Ordenar por data (do mais recente para o mais antigo)
        userAppointments.sort((a, b) => {
          const dateA = new Date(a.date).getTime() + getTimeInMinutes(a.time);
          const dateB = new Date(b.date).getTime() + getTimeInMinutes(b.time);
          return dateA - dateB;
        });
        
        setAppointments(userAppointments);
        setIsLoading(false);
      }, 500);
    };

    loadAppointments();
  }, [navigate]);

  // Função para converter horário em minutos para ordenação
  const getTimeInMinutes = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center">Meus Agendamentos</h1>
          
          <div className="bg-barbearia-card rounded-lg shadow-lg p-6">
            {isLoading ? (
              <p className="text-center py-4">Carregando seus agendamentos...</p>
            ) : appointments.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-lg text-gray-400">Você ainda não possui agendamentos.</p>
                <button 
                  onClick={() => navigate("/agendar")}
                  className="mt-4 inline-flex items-center px-4 py-2 bg-barbearia-yellow text-black rounded-md hover:bg-amber-400 transition-colors"
                >
                  Agendar Horário
                </button>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {appointments.map((appointment) => {
                  const appointmentDate = new Date(appointment.date);
                  const isPast = appointmentDate.getTime() < Date.now();
                  
                  return (
                    <div 
                      key={appointment.id}
                      className={`p-4 rounded-lg border ${
                        isPast 
                          ? "border-gray-600 bg-barbearia-dark/60 opacity-70" 
                          : "border-barbearia-yellow bg-barbearia-dark"
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-lg">
                            {isPast ? "Concluído" : "Agendado"}
                          </h3>
                          <p className="text-gray-300">
                            <span className="font-medium">Código:</span> {appointment.id.substring(0, 8).toUpperCase()}
                          </p>
                        </div>
                        {!isPast && (
                          <span className="inline-block w-3 h-3 bg-green-500 rounded-full"></span>
                        )}
                      </div>
                      
                      <div className="mt-3 space-y-1">
                        <p className="text-gray-300">
                          <span className="font-medium">Data:</span> {formatDate(appointment.date)}
                        </p>
                        <p className="text-gray-300">
                          <span className="font-medium">Horário:</span> {appointment.time}
                        </p>
                        <p className="text-gray-300">
                          <span className="font-medium">Barbeiro:</span> {getBarberName(appointment.barberId)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default MyAppointments;
