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
import { getAllAppointments, getBarberName, getBarbers, setBarberActiveStatus, confirmAppointment, Appointment, Barber } from "@/services/AppointmentService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const AdminPanel = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);
  const [selectedBarberId, setSelectedBarberId] = useState<string | "all">("all");
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("appointments");
  const [newEmail, setNewEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isUpdatingEmail, setIsUpdatingEmail] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [barbers, setBarbers] = useState<Barber[]>([]);

  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, signOut } = useAuth();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // every minute
    
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const userType = localStorage.getItem("userType");
    if (userType !== "admin") {
      navigate("/");
      return;
    }

    const userEmail = localStorage.getItem("userEmail");
    if (userEmail) {
      setNewEmail(userEmail);
    }

    loadAppointments();
    loadBarbers();
  }, [navigate]);

  const loadAppointments = async () => {
    setIsLoading(true);
    try {
      const storedAppointments = await getAllAppointments();
      
      storedAppointments.sort((a, b) => {
        const dateA = new Date(a.date).getTime() + getTimeInMinutes(a.time);
        const dateB = new Date(b.date).getTime() + getTimeInMinutes(b.time);
        return dateA - dateB;
      });
      
      setAppointments(storedAppointments);
      setFilteredAppointments(storedAppointments);
    } catch (error) {
      console.error("Error loading appointments:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível carregar os agendamentos."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadBarbers = async () => {
    try {
      const data = await getBarbers();
      setBarbers(data);
    } catch {
      setBarbers([]);
    }
  };

  const getTimeInMinutes = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };

  useEffect(() => {
    if (selectedBarberId === "all") {
      setFilteredAppointments(appointments);
    } else {
      setFilteredAppointments(appointments.filter(app => app.barber_id === selectedBarberId));
    }
  }, [selectedBarberId, appointments]);

  const getCliente = (userId: string) => {
    return userId.substring(0, 8);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "dd/MM/yyyy", { locale: ptBR });
  };

  const handleEmailUpdate = () => {
    if (!newEmail || newEmail.trim() === "") {
      toast({
        variant: "destructive",
        title: "Email inválido",
        description: "Por favor, insira um email válido."
      });
      return;
    }

    setIsUpdatingEmail(true);
    setTimeout(() => {
      localStorage.setItem("userEmail", newEmail);
      
      toast({
        title: "Email atualizado com sucesso!",
        description: "Seu novo email foi salvo."
      });
      
      setIsUpdatingEmail(false);
    }, 1000);
  };

  const handlePasswordUpdate = () => {
    if (!currentPassword || !newPassword) {
      toast({
        variant: "destructive",
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos."
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        variant: "destructive",
        title: "Senha muito curta",
        description: "A nova senha deve ter pelo menos 6 caracteres."
      });
      return;
    }

    setIsUpdatingPassword(true);
    setTimeout(() => {
      toast({
        title: "Senha atualizada com sucesso!",
        description: "Sua nova senha foi salva."
      });
      
      setCurrentPassword("");
      setNewPassword("");
      setIsUpdatingPassword(false);
    }, 1000);
  };

  const handleConfirmAppointment = async (appointmentId: string) => {
    try {
      await confirmAppointment(appointmentId);
      toast({
        title: "Agendamento confirmado",
        description: "O agendamento foi confirmado com sucesso."
      });
      
      loadAppointments();
    } catch (error) {
      console.error("Error confirming appointment:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível confirmar o agendamento."
      });
    }
  };

  const canConfirmAppointment = (appointment: Appointment) => {
    if (appointment.status !== 'pending') return false;
    
    const now = currentTime;
    const appointmentDate = new Date(appointment.date + 'T' + appointment.time);
    
    return now >= appointmentDate;
  };

  const getAppointmentStatus = (appointment: Appointment) => {
    if (appointment.status === 'canceled') return "Cancelado";
    if (appointment.status === 'confirmed') return "Confirmado";
    
    const appointmentDate = new Date(appointment.date);
    const isPast = appointmentDate.getTime() < Date.now();
    
    if (isPast) return "Concluído";
    return "Agendado";
  };

  const getStatusClass = (appointment: Appointment) => {
    if (appointment.status === 'canceled') return "bg-red-500/20 text-red-400";
    if (appointment.status === 'confirmed') return "bg-green-500/20 text-green-400";
    
    const appointmentDate = new Date(appointment.date);
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const isPast = appointmentDate < now;
    
    return isPast ? "bg-gray-600 text-gray-200" : "bg-green-500/20 text-green-400";
  };

  const handleToggleBarberActive = async (barber: Barber) => {
    try {
      await setBarberActiveStatus(barber.id, !barber.active);
      toast({
        title: `Barbeiro ${!barber.active ? "ativado" : "desativado"} com sucesso!`
      });
      loadBarbers();
    } catch {
      toast({
        variant: "destructive",
        title: "Erro ao atualizar barbeiro"
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 p-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center">Painel Administrativo</h1>
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="flex justify-center mb-6">
              <TabsList className="bg-barbearia-dark">
                <TabsTrigger value="appointments">Agendamentos</TabsTrigger>
                <TabsTrigger value="barbers">Barbeiros</TabsTrigger>
                <TabsTrigger value="account">Conta</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="appointments">
              <div className="bg-barbearia-card rounded-lg shadow-lg p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Agendamentos</h2>
                  
                  <div>
                    <select 
                      value={selectedBarberId}
                      onChange={(e) => setSelectedBarberId(e.target.value)}
                      className="bg-barbearia-dark border border-barbearia-dark rounded px-3 py-2 text-white"
                    >
                      <option value="all">Todos os barbeiros</option>
                      {getBarbers().map(barber => (
                        <option key={barber.id} value={barber.id}>
                          {barber.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                
                {isLoading ? (
                  <p className="text-center py-4">Carregando agendamentos...</p>
                ) : filteredAppointments.length === 0 ? (
                  <p className="text-center py-4 text-gray-400">Nenhum agendamento encontrado</p>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-gray-300">Código</TableHead>
                          <TableHead className="text-gray-300">Cliente</TableHead>
                          <TableHead className="text-gray-300">Barbeiro</TableHead>
                          <TableHead className="text-gray-300">Data</TableHead>
                          <TableHead className="text-gray-300">Horário</TableHead>
                          <TableHead className="text-gray-300">Status</TableHead>
                          <TableHead className="text-gray-300">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredAppointments.map((appointment) => {
                          const canConfirm = canConfirmAppointment(appointment);
                          
                          return (
                            <TableRow key={appointment.id}>
                              <TableCell className="font-mono">
                                {appointment.code || appointment.id.substring(0, 8).toUpperCase()}
                              </TableCell>
                              <TableCell>{getCliente(appointment.user_id)}</TableCell>
                              <TableCell>{getBarberName(appointment.barber_id)}</TableCell>
                              <TableCell>{formatDate(appointment.date)}</TableCell>
                              <TableCell>{appointment.time}</TableCell>
                              <TableCell>
                                <span className={`px-2 py-1 rounded-full text-xs ${getStatusClass(appointment)}`}>
                                  {getAppointmentStatus(appointment)}
                                </span>
                              </TableCell>
                              <TableCell>
                                {appointment.status === 'pending' && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleConfirmAppointment(appointment.id)}
                                    disabled={!canConfirm}
                                    className={
                                      canConfirm 
                                        ? "border-green-500 text-green-500 hover:bg-green-500 hover:text-black" 
                                        : "border-gray-600 text-gray-600"
                                    }
                                  >
                                    Confirmar
                                  </Button>
                                )}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="barbers">
              <div className="bg-barbearia-card rounded-lg shadow-lg p-6 mb-6">
                <h2 className="text-xl font-semibold mb-6">Barbeiros</h2>
                <div className="space-y-4">
                  {barbers.length === 0 && (
                    <div className="text-gray-400">Nenhum barbeiro cadastrado.</div>
                  )}
                  {barbers.map((barber) => (
                    <div key={barber.id} className={`flex items-center justify-between px-4 py-3 rounded bg-barbearia-dark`}>
                      <span className={`font-medium ${!barber.active ? "opacity-60" : ""}`}>{barber.name}</span>
                      <Button
                        variant={barber.active ? "default" : "outline"}
                        className={
                          barber.active
                            ? "bg-green-500 text-white hover:bg-green-600"
                            : "border-gray-500 text-gray-400 hover:bg-gray-600"
                        }
                        onClick={() => handleToggleBarberActive(barber)}
                      >
                        {barber.active ? "Ativo" : "Desativado"}
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="account">
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="bg-barbearia-card border-barbearia-dark">
                  <CardHeader>
                    <CardTitle>Alterar Email</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Novo Email</label>
                        <Input
                          type="email"
                          placeholder="novo@email.com"
                          value={newEmail}
                          onChange={(e) => setNewEmail(e.target.value)}
                          className="bg-barbearia-dark border-barbearia-dark"
                        />
                      </div>
                      
                      <Button
                        onClick={handleEmailUpdate}
                        disabled={isUpdatingEmail}
                        className="w-full bg-barbearia-yellow text-black hover:bg-amber-400"
                      >
                        {isUpdatingEmail ? "Atualizando..." : "Atualizar Email"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-barbearia-card border-barbearia-dark">
                  <CardHeader>
                    <CardTitle>Alterar Senha</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Senha Atual</label>
                        <Input
                          type="password"
                          placeholder="********"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          className="bg-barbearia-dark border-barbearia-dark"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Nova Senha</label>
                        <Input
                          type="password"
                          placeholder="********"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="bg-barbearia-dark border-barbearia-dark"
                        />
                      </div>
                      
                      <Button
                        onClick={handlePasswordUpdate}
                        disabled={isUpdatingPassword}
                        className="w-full bg-barbearia-yellow text-black hover:bg-amber-400"
                      >
                        {isUpdatingPassword ? "Atualizando..." : "Atualizar Senha"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default AdminPanel;
