
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
  
  const bookedTimes = useMemo(() => {
    if (!date || !barberId) return [];
    return getBookedTimes(date, barberId);
  }, [date, barberId]);
  
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Selecione o Horário</h2>
      
      {!date || !barberId ? (
        <p className="text-muted-foreground">
          Selecione um barbeiro e uma data primeiro
        </p>
      ) : (
        <>
          <div className="mb-6">
            <h3 className="text-lg mb-3 text-gray-400">Manhã</h3>
            <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
              {morningTimes.map((time) => {
                const isBooked = bookedTimes.includes(time);
                return (
                  <Button
                    key={time}
                    variant={selectedTime === time ? "default" : "outline"}
                    disabled={isBooked}
                    onClick={() => onSelect(time)}
                    className={cn(
                      selectedTime === time 
                        ? "bg-barbearia-yellow text-black hover:bg-amber-400" 
                        : "border-gray-700 hover:bg-barbearia-dark",
                      isBooked && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    {time}
                  </Button>
                );
              })}
            </div>
          </div>
          
          <div>
            <h3 className="text-lg mb-3 text-gray-400">Tarde</h3>
            <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
              {afternoonTimes.map((time) => {
                const isBooked = bookedTimes.includes(time);
                return (
                  <Button
                    key={time}
                    variant={selectedTime === time ? "default" : "outline"}
                    disabled={isBooked}
                    onClick={() => onSelect(time)}
                    className={cn(
                      selectedTime === time 
                        ? "bg-barbearia-yellow text-black hover:bg-amber-400" 
                        : "border-gray-700 hover:bg-barbearia-dark",
                      isBooked && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    {time}
                  </Button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// Helper function for conditional class names
const cn = (...classes: (string | boolean)[]) => {
  return classes.filter(Boolean).join(" ");
};

export default TimeSelection;
