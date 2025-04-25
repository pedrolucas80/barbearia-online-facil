
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { getBarbers, Barber } from "@/services/AppointmentService";

interface BarberSelectionProps {
  onSelect: (barberId: string) => void;
  selectedBarber: string | null;
}

const BarberSelection = ({ onSelect, selectedBarber }: BarberSelectionProps) => {
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    (async () => {
      try {
        const barbers = await getBarbers();
        setBarbers(barbers);
      } catch {
        setBarbers([]);
      }
    })();
  }, []);

  const handleSelect = (barber: Barber) => {
    if (!barber.active) {
      toast({
        variant: "destructive",
        title: "Barbeiro indisponível",
        description: "Este barbeiro está temporariamente indisponível para agendamento.",
      });
      return;
    }
    onSelect(barber.id);
  };

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">Escolha o barbeiro</h2>
      
      <div className="grid grid-cols-2 gap-4">
        {barbers.map((barber) => (
          <Button
            key={barber.id}
            variant={selectedBarber === barber.id ? "default" : "outline"}
            className={[
              selectedBarber === barber.id
                ? "bg-barbearia-yellow text-black hover:bg-amber-400"
                : "border-barbearia-yellow text-barbearia-yellow hover:bg-barbearia-yellow hover:text-black",
              !barber.active ? "opacity-50 cursor-not-allowed" : ""
            ].join(" ")}
            disabled={!barber.active}
            onClick={() => handleSelect(barber)}
          >
            {barber.name}
            {!barber.active && (
              <span className="ml-2 text-xs font-normal">(Indisponível)</span>
            )}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default BarberSelection;
