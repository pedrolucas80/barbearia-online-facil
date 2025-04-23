
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getAppointments, getBarberName, Appointment } from "@/services/AppointmentService";

const AdminPanel = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar se está logado como admin
    const userType = localStorage.getItem("userType");
    if (userType !== "admin") {
      navigate("/");
      return;
    }

    // Carregar agendamentos
    const loadAppointments = () => {
      setIsLoading(true);
      setTimeout(() => {
        const storedAppointments = getAppointments();
        setAppointments(storedAppointments);
        setIsLoading(false);
      }, 500);
    };

    loadAppointments();
  }, [navigate]);

  const getBarbeiro = (barberId: string) => {
    return getBarberName(barberId);
  };
  
  const getCliente = (email: string) => {
    // Para este MVP, usamos apenas o email para identificar o cliente
    // Em uma implementação real, buscaríamos o nome completo
    return email.split("@")[0];
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "dd/MM/yyyy", { locale: ptBR });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 p-6">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center">Painel Administrativo</h1>
          
          <div className="bg-barbearia-card rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Agendamentos</h2>
            
            {isLoading ? (
              <p className="text-center py-4">Carregando agendamentos...</p>
            ) : appointments.length === 0 ? (
              <p className="text-center py-4 text-gray-400">Nenhum agendamento encontrado</p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-gray-300">Cliente</TableHead>
                      <TableHead className="text-gray-300">Barbeiro</TableHead>
                      <TableHead className="text-gray-300">Data</TableHead>
                      <TableHead className="text-gray-300">Horário</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {appointments.map((appointment) => (
                      <TableRow key={appointment.id}>
                        <TableCell>{getCliente(appointment.clientEmail)}</TableCell>
                        <TableCell>{getBarbeiro(appointment.barberId)}</TableCell>
                        <TableCell>{formatDate(appointment.date)}</TableCell>
                        <TableCell>{appointment.time}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminPanel;
