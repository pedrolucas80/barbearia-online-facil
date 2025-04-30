
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage 
} from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

interface ProfileEditorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ProfileEditor = ({ open, onOpenChange }: ProfileEditorProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    if (open && user) {
      loadProfile();
      setForgotPasswordEmail(user.email || "");
    }
  }, [open, user]);

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
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user?.email || '',
        password: currentPassword,
      });

      if (signInError) {
        toast({
          variant: "destructive",
          title: "Senha atual incorreta",
          description: "Por favor, verifique sua senha atual e tente novamente."
        });
        return;
      }

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
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao atualizar senha",
        description: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!forgotPasswordEmail) {
      toast({
        variant: "destructive",
        title: "Campo obrigatório",
        description: "Por favor, informe seu email."
      });
      return;
    }

    if (forgotPasswordEmail !== user?.email) {
      toast({
        variant: "destructive",
        title: "Email incorreto",
        description: "O email informado não corresponde ao seu email de cadastro."
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(forgotPasswordEmail, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      toast({
        title: "Email enviado",
        description: "Um email de recuperação de senha foi enviado para você."
      });
      setShowForgotPassword(false);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao enviar email",
        description: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-barbearia-card border-barbearia-dark sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Perfil</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Informações Pessoais</h3>
            
            <div className="space-y-2">
              <label className="text-sm">Email</label>
              <div className="flex gap-2">
                <Input
                  type="email"
                  value={user?.email || ""}
                  readOnly
                  className="bg-barbearia-dark border-barbearia-dark flex-1"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm">Nome Completo</label>
              <Input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Seu nome completo"
                className="bg-barbearia-dark border-barbearia-dark"
              />
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
            
            {!showForgotPassword ? (
              <>
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

                <div className="text-center">
                  <button 
                    type="button" 
                    onClick={() => setShowForgotPassword(true)}
                    className="text-sm text-barbearia-yellow hover:underline"
                  >
                    Não lembro minha senha atual
                  </button>
                </div>
              </>
            ) : (
              <div className="space-y-4">
                <p className="text-sm">
                  Para redefinir sua senha, informe seu email de cadastro. Enviaremos um link para você criar uma nova senha.
                </p>
                <div className="space-y-2">
                  <label className="text-sm">Email</label>
                  <Input
                    type="email"
                    value={forgotPasswordEmail}
                    onChange={(e) => setForgotPasswordEmail(e.target.value)}
                    placeholder="seu@email.com"
                    className="bg-barbearia-dark border-barbearia-dark"
                  />
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    onClick={handleForgotPassword}
                    disabled={loading || !forgotPasswordEmail}
                    className="flex-1 bg-barbearia-yellow text-black hover:bg-amber-400"
                  >
                    {loading ? "Enviando..." : "Enviar Link"}
                  </Button>
                  
                  <Button 
                    onClick={() => setShowForgotPassword(false)}
                    disabled={loading}
                    variant="outline"
                    className="flex-1"
                  >
                    Voltar
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileEditor;
