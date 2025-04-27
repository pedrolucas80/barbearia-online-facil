import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import BarberSelection from "@/components/scheduling/BarberSelection";
import DateSelection from "@/components/scheduling/DateSelection";
import TimeSelection from "@/components/scheduling/TimeSelection";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { saveAppointment } from "@/services/AppointmentService";
import AppointmentPreview from "@/components/scheduling/AppointmentPreview";
import { useAuth } from "@/contexts/AuthContext";

const Scheduling = () => {
  const [selectedBarber, setSelectedBarber] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [navigate, user]);

  const handleConfirmAppointment = async () => {
    if (!selectedBarber || !selectedDate || !selectedTime || !user) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Selecione barbeiro, data e horário.",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await saveAppointment(user.id, {
        barber_id: selectedBarber,
        date: selectedDate.toISOString().split('T')[0],
        time: selectedTime,
      });
      
      toast({
        title: "Agendamento confirmado com sucesso!",
        description: `Seu horário está marcado para ${selectedTime} no dia ${selectedDate.toLocaleDateString('pt-BR')}`,
      });
      
      setSelectedBarber(null);
      setSelectedDate(null);
      setSelectedTime(null);
    } catch (error) {
      console.error("Error saving appointment:", error);
      toast({
        variant: "destructive",
        title: "Erro ao agendar",
        description: "Houve um problema ao salvar seu agendamento. Tente novamente.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 p-6 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Agendar Horário</h1>
        
        <div className="bg-barbearia-card rounded-lg shadow-lg p-6">
          <BarberSelection 
            onSelect={setSelectedBarber}
            selectedBarber={selectedBarber}
          />
          
          <DateSelection 
            onSelect={setSelectedDate}
            selectedDate={selectedDate}
          />
          
          <TimeSelection 
            onSelect={setSelectedTime}
            selectedTime={selectedTime}
            date={selectedDate}
            barberId={selectedBarber}
          />
          
          <AppointmentPreview
            barberId={selectedBarber}
            selectedDate={selectedDate}
            selectedTime={selectedTime}
          />
          
          <div className="mt-8">
            <Button
              onClick={handleConfirmAppointment}
              disabled={!selectedBarber || !selectedDate || !selectedTime || isSubmitting}
              className="w-full bg-barbearia-yellow text-black hover:bg-amber-500 transition-colors duration-300 focus:ring-2 focus:ring-amber-600"
            >
              {isSubmitting ? "Processando..." : "Confirmar Agendamento"}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Scheduling;
