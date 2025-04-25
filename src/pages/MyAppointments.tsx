
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { getAppointments, getBarberName, cancelAppointment, Appointment, getBarbers, Barber } from "@/services/AppointmentService";
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
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";

const MyAppointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [appointmentToCancel, setAppointmentToCancel] = useState<Appointment | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const [filter, setFilter] = useState<"all" | "canceled" | "done" | "scheduled">("all"); // Filtro novo
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }
    loadAppointments();
    loadBarbers();
  }, [navigate, user]);

  const loadAppointments = async () => {
    setIsLoading(true);
    try {
      const userAppointments = await getAppointments(user?.id || '');
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

  const loadBarbers = async () => {
    try {
      const barbersList = await getBarbers();
      setBarbers(barbersList);
    } catch (error) {
      console.error("Error loading barbers:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível carregar os barbeiros."
      });
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
    const appointmentDateTime = new Date(`${appointment.date}T${appointment.time}`);
    const now = new Date();
    return appointmentDateTime < now;
  };

  const getAppointmentStatus = (appointment: Appointment) => {
    if (appointment.status === 'canceled') return "Cancelado";
    if (isPast(appointment)) return "Concluído";
    return "Agendado";
  };

  const getStatusColor = (appointment: Appointment) => {
    const status = getAppointmentStatus(appointment);
    switch (status) {
      case "Cancelado":
        return "bg-red-500/20 text-red-400";
      case "Concluído":
        return "bg-gray-600 text-gray-200";
      case "Agendado":
      default:
        return "bg-green-500/20 text-green-400";
    }
  };

  // Filtro dos agendamentos
  const filteredAppointments = appointments.filter(app => {
    if (filter === "all") return true;
    if (filter === "canceled") return app.status === "canceled";
    if (filter === "done") return app.status !== "canceled" && isPast(app);
    if (filter === "scheduled") return app.status !== "canceled" && !isPast(app);
    return true;
  });

  // Busca nome do barbeiro (agora corretamente, usando cache)
  const getBarberNameById = (barberId: string) => {
    const barber = barbers.find(b => b.id === barberId);
    return barber ? barber.name : "Barbeiro Desconhecido";
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center">Meus Agendamentos</h1>
          <div className="flex justify-end mb-4">
            <Select
              value={filter}
              onValueChange={(val) => setFilter(val as typeof filter)}
            >
              <SelectTrigger className="w-56 bg-barbearia-card text-white border-barbearia-yellow">
                <SelectValue>
                  {filter === "all" && "Todos"}
                  {filter === "canceled" && "Cancelados"}
                  {filter === "done" && "Concluídos"}
                  {filter === "scheduled" && "Agendados"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="canceled">Cancelados</SelectItem>
                <SelectItem value="done">Concluídos</SelectItem>
                <SelectItem value="scheduled">Agendados</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="bg-barbearia-card rounded-lg shadow-lg p-6">
            {isLoading ? (
              <p className="text-center py-4">Carregando seus agendamentos...</p>
            ) : filteredAppointments.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-lg text-gray-400">Nenhum agendamento encontrado.</p>
                <button 
                  onClick={() => navigate("/agendar")}
                  className="mt-4 inline-flex items-center px-4 py-2 bg-barbearia-yellow text-black rounded-md hover:bg-amber-400 transition-colors"
                >
                  Agendar Horário
                </button>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {filteredAppointments.map((appointment) => {
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
                          <span className="font-medium">Barbeiro:</span> {getBarberNameById(appointment.barber_id)}
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
