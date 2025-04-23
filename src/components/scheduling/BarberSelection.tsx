
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

interface BarberSelectionProps {
  onSelect: (barberId: string) => void;
  selectedBarber: string | null;
}

import { getBarbers } from "@/services/AppointmentService";
const barbers = getBarbers();

const BarberSelection = ({ onSelect, selectedBarber }: BarberSelectionProps) => {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">Escolha o barbeiro</h2>
      
      <div className="space-y-4">
        <Select onValueChange={onSelect} defaultValue={selectedBarber || undefined}>
          <SelectTrigger className="w-full bg-barbearia-card border-barbearia-dark">
            <SelectValue placeholder="Selecione um barbeiro" />
          </SelectTrigger>
          <SelectContent className="bg-barbearia-card border-barbearia-dark">
            {barbers.map((barber) => (
              <SelectItem key={barber.id} value={barber.id} className="hover:bg-barbearia-dark">
                {barber.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="grid grid-cols-2 gap-4">
          {barbers.map((barber) => (
            <Button
              key={barber.id}
              variant={selectedBarber === barber.id ? "default" : "outline"}
              className={
                selectedBarber === barber.id
                  ? "bg-barbearia-yellow text-black hover:bg-amber-400"
                  : "border-barbearia-yellow text-barbearia-yellow hover:bg-barbearia-yellow hover:text-black"
              }
              onClick={() => onSelect(barber.id)}
            >
              {barber.name}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BarberSelection;
