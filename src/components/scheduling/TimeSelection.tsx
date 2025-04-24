
import { useMemo } from "react";
import { Button } from "@/components/ui/button";

interface TimeSelectionProps {
  onSelect: (time: string) => void;
  selectedTime: string | null;
  date: Date | null;
  barberId: string | null;
}

import { getBookedTimes } from "@/services/AppointmentService";

const TimeSelection = ({ onSelect, selectedTime, date, barberId }: TimeSelectionProps) => {
  const morningTimes = ["08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30"];
  const afternoonTimes = ["14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00", "18:30"];
  
  const bookedTimes = useMemo(async () => {
    if (!date || !barberId) return [];
    try {
      const times = await getBookedTimes(date, barberId);
      return times;
    } catch (error) {
      console.error("Error fetching booked times:", error);
      return [];
    }
  }, [date, barberId]);

  const isTimeDisabled = async (time: string) => {
    if (!date || !barberId) return true;
    
    const [hours, minutes] = time.split(":").map(Number);
    const selectedDateTime = new Date(date);
    selectedDateTime.setHours(hours, minutes);
    
    const now = new Date();
    const times = await bookedTimes;
    
    return times.includes(time) || selectedDateTime < now;
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Selecione o Horário</h2>
      
      <div>
        <h3 className="text-lg mb-3 text-gray-400">Manhã</h3>
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 mb-6">
          {morningTimes.map((time) => (
            <Button
              key={time}
              variant={selectedTime === time ? "default" : "outline"}
              onClick={() => !isTimeDisabled(time) && onSelect(time)}
              disabled={false} // We'll handle this client-side for now
              className={cn(
                selectedTime === time 
                  ? "bg-barbearia-yellow text-black hover:bg-amber-400" 
                  : "border-gray-700 hover:bg-barbearia-dark"
              )}
            >
              {time}
            </Button>
          ))}
        </div>

        <h3 className="text-lg mb-3 text-gray-400">Tarde</h3>
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
          {afternoonTimes.map((time) => (
            <Button
              key={time}
              variant={selectedTime === time ? "default" : "outline"}
              onClick={() => !isTimeDisabled(time) && onSelect(time)}
              disabled={false} // We'll handle this client-side for now
              className={cn(
                selectedTime === time 
                  ? "bg-barbearia-yellow text-black hover:bg-amber-400" 
                  : "border-gray-700 hover:bg-barbearia-dark"
              )}
            >
              {time}
            </Button>
          ))}
        </div>
      </div>

      {(!date || !barberId) && (
        <p className="text-sm text-gray-400 mt-4">
          Selecione um barbeiro e uma data para ver os horários disponíveis
        </p>
      )}
    </div>
  );
};

// Helper function for conditional class names
const cn = (...classes: (string | boolean)[]) => {
  return classes.filter(Boolean).join(" ");
};

export default TimeSelection;
