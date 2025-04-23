
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { getBarberName } from "@/services/AppointmentService";

interface AppointmentPreviewProps {
  barberId: string | null;
  selectedDate: Date | null;
  selectedTime: string | null;
}

const AppointmentPreview = ({ barberId, selectedDate, selectedTime }: AppointmentPreviewProps) => {
  if (!barberId || !selectedDate || !selectedTime) return null;

  const barberName = getBarberName(barberId);
  const formattedDate = format(selectedDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });

  return (
    <div className="mt-8 p-4 bg-barbearia-card rounded-lg border border-barbearia-dark">
      <h3 className="text-lg font-semibold mb-4">Confirmar Agendamento</h3>
      <div className="space-y-2">
        <p className="text-gray-300">
          <span className="font-medium">Barbeiro:</span> {barberName}
        </p>
        <p className="text-gray-300">
          <span className="font-medium">Data:</span> {formattedDate}
        </p>
        <p className="text-gray-300">
          <span className="font-medium">Horário:</span> {selectedTime}
        </p>
      </div>
    </div>
  );
};

export default AppointmentPreview;
