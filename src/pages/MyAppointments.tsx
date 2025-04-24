
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { getAppointments, getBarberName, cancelAppointment, Appointment } from "@/services/AppointmentService";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from "@/components/ui/alert-dialog";

const MyAppointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [appointmentToCancel, setAppointmentToCancel] = useState<Appointment | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    // Verificar se o usuário está autenticado
    if (!user) {
      navigate("/");
      return;
    }

    // Carregar agendamentos do usuário
    loadAppointments();
  }, [navigate, user, toast]);

  const loadAppointments = async () => {
    setIsLoading(true);
    try {
      const userAppointments = await getAppointments(user?.id || '');
      
      // Ordenar por data (do mais recente para o mais antigo)
      userAppointments.sort((a, b) => {
        const dateA = new Date(a.date).getTime() + getTimeInMinutes(a.time);
        const dateB = new Date(b.date).getTime() + getTimeInMinutes(b.time);
        return dateA - dateB;
      });
      
      setAppointments(userAppointments);
    } catch (error) {
      console.error("Error loading appointments:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível carregar seus agendamentos."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelAppointment = async () => {
    if (!appointmentToCancel) return;
    
    setIsCancelling(true);
    try {
      await cancelAppointment(appointmentToCancel.id);
      toast({
        title: "Agendamento cancelado",
        description: "Seu agendamento foi cancelado com sucesso."
      });
      
      // Atualizar a lista de agendamentos
      loadAppointments();
    } catch (error) {
      console.error("Error cancelling appointment:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível cancelar o agendamento."
      });
    } finally {
      setIsCancelling(false);
      setAppointmentToCancel(null);
    }
  };

  // Função para converter horário em minutos para ordenação
  const getTimeInMinutes = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
  };

  // Verifica se o agendamento pode ser cancelado (antes da data e hora)
  const canCancel = (appointment: Appointment) => {
    if (appointment.status === 'canceled') return false;
    
    const appointmentDateTime = new Date(`${appointment.date}T${appointment.time}`);
    const now = new Date();
    return appointmentDateTime > now;
  };

  const isPast = (appointment: Appointment) => {
    const appointmentDate = new Date(appointment.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return appointmentDate < today;
  };

  const getAppointmentStatus = (appointment: Appointment) => {
    if (appointment.status === 'canceled') return "Cancelado";
    if (appointment.status === 'confirmed') return "Confirmado";
    
    if (isPast(appointment)) return "Concluído";
    return "Agendado";
  };

  const getStatusColor = (appointment: Appointment) => {
    if (appointment.status === 'canceled') return "bg-red-500/20 text-red-400";
    if (appointment.status === 'confirmed') return "bg-green-500/20 text-green-400";
    
    if (isPast(appointment)) return "bg-gray-600 text-gray-200";
    return "bg-green-500/20 text-green-400";
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
                  const showCancelButton = canCancel(appointment);
                  
                  return (
                    <div 
                      key={appointment.id}
                      className={`p-4 rounded-lg border ${
                        appointment.status === 'canceled' 
                          ? "border-red-800 bg-red-950/20 opacity-70" 
                          : isPast(appointment) 
                          ? "border-gray-600 bg-barbearia-dark/60 opacity-70" 
                          : "border-barbearia-yellow bg-barbearia-dark"
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-lg">
                            {getAppointmentStatus(appointment)}
                          </h3>
                          <p className="text-gray-300">
                            <span className="font-medium">Código:</span> {appointment.code || appointment.id.substring(0, 8).toUpperCase()}
                          </p>
                        </div>
                        <span className={`inline-block px-2 py-1 rounded-full text-xs ${getStatusColor(appointment)}`}>
                          {getAppointmentStatus(appointment)}
                        </span>
                      </div>
                      
                      <div className="mt-3 space-y-1">
                        <p className="text-gray-300">
                          <span className="font-medium">Data:</span> {formatDate(appointment.date)}
                        </p>
                        <p className="text-gray-300">
                          <span className="font-medium">Horário:</span> {appointment.time}
                        </p>
                        <p className="text-gray-300">
                          <span className="font-medium">Barbeiro:</span> {getBarberName(appointment.barber_id)}
                        </p>
                      </div>

                      {showCancelButton && (
                        <div className="mt-4 flex justify-end">
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => setAppointmentToCancel(appointment)}
                          >
                            Cancelar Agendamento
                          </Button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>

      <AlertDialog open={!!appointmentToCancel} onOpenChange={(open) => !open && setAppointmentToCancel(null)}>
        <AlertDialogContent className="bg-barbearia-card border-barbearia-dark">
          <AlertDialogHeader>
            <AlertDialogTitle>Cancelar Agendamento</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja cancelar este agendamento? Esta ação não poderá ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isCancelling}>Voltar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancelAppointment}
              disabled={isCancelling}
              className="bg-red-600 hover:bg-red-700"
            >
              {isCancelling ? "Cancelando..." : "Confirmar Cancelamento"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MyAppointments;
