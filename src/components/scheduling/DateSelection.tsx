
import { useState } from "react";
import { format, isToday, isBefore, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isSunday, isAfter, isSaturday } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface DateSelectionProps {
  onSelect: (date: Date) => void;
  selectedDate: Date | null;
}

const DateSelection = ({ onSelect, selectedDate }: DateSelectionProps) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };
  
  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };
  
  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  });
  
  const startingDayOfWeek = getDay(startOfMonth(currentMonth));
  
  const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

  const isDateDisabled = (date: Date): boolean => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinutes = now.getMinutes();
    
    // Desabilita domingos (barbearia fechada)
    if (isSunday(date)) {
      return true;
    }
    
    // Se for o dia atual e depois das 18:30, desabilita o dia
    if (isToday(date) && (currentHour > 18 || (currentHour === 18 && currentMinutes >= 30))) {
      return true;
    }
    
    // Desabilita dias passados
    return isBefore(date, now) && !isToday(date);
  };
  
  const handleSelectDate = (date: Date) => {
    if (!isDateDisabled(date)) {
      onSelect(date);
    }
  };
  
  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">Selecione a Data</h2>
      
      <div className="bg-barbearia-card rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="ghost" 
            onClick={prevMonth}
            className="hover:bg-barbearia-dark text-white"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          
          <h3 className="font-medium text-lg">
            {format(currentMonth, "MMMM yyyy", { locale: ptBR })}
          </h3>
          
          <Button
            variant="ghost" 
            onClick={nextMonth}
            className="hover:bg-barbearia-dark text-white"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="grid grid-cols-7 gap-2 mb-2">
          {weekDays.map((day) => (
            <span key={day} className="text-center text-sm font-medium py-1">
              {day}
            </span>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: startingDayOfWeek }).map((_, index) => (
            <div key={`empty-${index}`} className="p-2" />
          ))}
          
          {daysInMonth.map((date) => {
            const isSelected = selectedDate && 
              date.getDate() === selectedDate.getDate() && 
              date.getMonth() === selectedDate.getMonth() &&
              date.getFullYear() === selectedDate.getFullYear();
            
            const disabled = isDateDisabled(date);
            
            return (
              <Button
                key={date.toString()}
                onClick={() => handleSelectDate(date)}
                disabled={disabled}
                className={cn(
                  "h-10 p-0 rounded-full",
                  disabled ? "opacity-50 cursor-not-allowed" : "",
                  isSelected ? "bg-[#8E3D0F] text-white hover:bg-[#8E3D0F]/90" : "hover:bg-barbearia-dark"
                )}
              >
                {format(date, "d")}
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DateSelection;
