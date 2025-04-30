
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { isSaturday } from "date-fns";

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
  
  const [bookedTimes, setBookedTimes] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchBookedTimes = async () => {
      if (!date || !barberId) {
        setBookedTimes([]);
        return;
      }
      
      setLoading(true);
      try {
        const times = await getBookedTimes(date, barberId);
        setBookedTimes(times);
      } catch (error) {
        console.error("Error fetching booked times:", error);
        setBookedTimes([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBookedTimes();
  }, [date, barberId]);

  const isTimeDisabled = (time: string): boolean => {
    if (!date || !barberId) return true;
    
    // Sábado só funciona até 12:00h
    if (isSaturday(date)) {
      // Extrair a hora do horário
      const hourPart = parseInt(time.split(":")[0]);
      if (hourPart >= 12) {
        return true;
      }
    }
    
    const [hours, minutes] = time.split(":").map(Number);
    const selectedDateTime = new Date(date);
    selectedDateTime.setHours(hours, minutes);
    
    const now = new Date();
    
    return bookedTimes.includes(time) || selectedDateTime < now;
  };

  // Verifica se é sábado para mostrar ou não os horários da tarde
  const showAfternoonHours = date && !isSaturday(date);

  if (!date || !barberId) {
    return (
      <div>
        <h2 className="text-xl font-semibold mb-4">Selecione o Horário</h2>
        <p className="text-sm text-gray-400 mt-4">
          Selecione um barbeiro e uma data para ver os horários disponíveis
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Selecione o Horário</h2>
      
      {loading ? (
        <p className="text-sm text-gray-400 mt-4">Carregando horários disponíveis...</p>
      ) : (
        <div>
          <h3 className="text-lg mb-3 text-gray-400">Manhã</h3>
          <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 mb-6">
            {morningTimes.map((time) => {
              const disabled = isTimeDisabled(time);
              return (
                <Button
                  key={time}
                  variant={selectedTime === time ? "default" : "outline"}
                  onClick={() => !disabled && onSelect(time)}
                  disabled={disabled}
                  className={cn(
                    selectedTime === time 
                      ? "bg-barbearia-yellow text-black hover:bg-amber-400" 
                      : "border-gray-700 hover:bg-barbearia-dark"
                  )}
                >
                  {time}
                </Button>
              );
            })}
          </div>

          {showAfternoonHours && (
            <>
              <h3 className="text-lg mb-3 text-gray-400">Tarde</h3>
              <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
                {afternoonTimes.map((time) => {
                  const disabled = isTimeDisabled(time);
                  return (
                    <Button
                      key={time}
                      variant={selectedTime === time ? "default" : "outline"}
                      onClick={() => !disabled && onSelect(time)}
                      disabled={disabled}
                      className={cn(
                        selectedTime === time 
                          ? "bg-barbearia-yellow text-black hover:bg-amber-400" 
                          : "border-gray-700 hover:bg-barbearia-dark"
                      )}
                    >
                      {time}
                    </Button>
                  );
                })}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

// Helper function for conditional class names
const cn = (...classes: (string | boolean)[]) => {
  return classes.filter(Boolean).join(" ");
};

export default TimeSelection;
