
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import ProfileAvatar from "@/components/ProfileAvatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

interface ProfileEditorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ProfileEditor = ({ open, onOpenChange }: ProfileEditorProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Load user profile data when dialog opens
  useState(() => {
    if (open && user) {
      setEmail(user.email || "");
      loadProfile();
    }
  });

  const loadProfile = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', user.id)
        .single();
      
      if (error) throw error;
      if (data) {
        setFullName(data.full_name || "");
      }
    } catch (error) {
      console.error("Error loading profile:", error);
    }
  };

  const updateProfile = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Update profile information
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ full_name: fullName })
        .eq('id', user.id);
      
      if (profileError) throw profileError;
      
      toast({
        title: "Perfil atualizado",
        description: "Suas informações foram atualizadas com sucesso."
      });
      
      onOpenChange(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível atualizar seu perfil."
      });
    } finally {
      setLoading(false);
    }
  };

  const updatePassword = async () => {
    if (!currentPassword || !newPassword) {
      toast({
        variant: "destructive",
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos de senha."
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (error) throw error;
      
      toast({
        title: "Senha atualizada",
        description: "Sua senha foi atualizada com sucesso."
      });
      
      setCurrentPassword("");
      setNewPassword("");
    } catch (error) {
      console.error("Error updating password:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível atualizar sua senha."
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-barbearia-card border-barbearia-dark sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Editar Perfil</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col items-center mb-4">
          {user && (
            <ProfileAvatar user={user} size="lg" editable onAvatarChange={loadProfile} />
          )}
        </div>
        
        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Informações Pessoais</h3>
            <div className="space-y-2">
              <label className="text-sm">Nome Completo</label>
              <Input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Seu nome completo"
                className="bg-barbearia-dark border-barbearia-dark"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm">Email</label>
              <Input
                value={email}
                disabled
                className="bg-barbearia-dark border-barbearia-dark opacity-70"
              />
              <p className="text-xs text-gray-400">Para alterar seu email, entre em contato com o suporte.</p>
            </div>
            
            <Button 
              onClick={updateProfile}
              disabled={loading}
              className="w-full bg-barbearia-yellow text-black hover:bg-amber-400"
            >
              {loading ? "Salvando..." : "Salvar Informações"}
            </Button>
          </div>

          <div className="space-y-4 pt-4 border-t border-gray-700">
            <h3 className="text-lg font-medium">Alterar Senha</h3>
            <div className="space-y-2">
              <label className="text-sm">Senha Atual</label>
              <Input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="********"
                className="bg-barbearia-dark border-barbearia-dark"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm">Nova Senha</label>
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="********"
                className="bg-barbearia-dark border-barbearia-dark"
              />
            </div>
            
            <Button 
              onClick={updatePassword}
              disabled={loading || !currentPassword || !newPassword}
              className="w-full bg-barbearia-yellow text-black hover:bg-amber-400"
            >
              {loading ? "Atualizando..." : "Atualizar Senha"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileEditor;
