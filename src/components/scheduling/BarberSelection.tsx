
import { Button } from "@/components/ui/button";
import { getBarbers } from "@/services/AppointmentService";

interface BarberSelectionProps {
  onSelect: (barberId: string) => void;
  selectedBarber: string | null;
}

const barbers = getBarbers();

const BarberSelection = ({ onSelect, selectedBarber }: BarberSelectionProps) => {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">Escolha o barbeiro</h2>
      
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
  );
};

export default BarberSelection;
