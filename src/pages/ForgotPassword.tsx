
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/layout/Header";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      toast({
        title: "Email enviado!",
        description: "Verifique sua caixa de entrada para redefinir sua senha.",
      });
      
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao enviar email",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-barbearia-card rounded-lg shadow-lg p-8">
          <div className="flex flex-col space-y-6">
            <div className="text-center">
              <h1 className="text-2xl font-bold">Recuperar Senha</h1>
              <p className="text-sm text-gray-400 mt-1">
                Digite seu email para receber o link de recuperação
              </p>
            </div>

            <form onSubmit={handleResetPassword} className="flex flex-col space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="email">
                  E-mail
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  required
                  className="bg-barbearia-card border-barbearia-dark"
                />
              </div>

              <Button 
                type="submit" 
                disabled={isLoading} 
                className="bg-barbearia-yellow text-black hover:bg-amber-400"
              >
                {isLoading ? "Enviando..." : "Enviar Link de Recuperação"}
              </Button>
            </form>

            <div className="text-center text-sm">
              <a href="/" className="text-barbearia-yellow hover:underline">
                Voltar para Login
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ForgotPassword;
