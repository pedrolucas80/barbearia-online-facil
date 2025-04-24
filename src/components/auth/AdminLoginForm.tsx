import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const ADMIN_ACCESS_KEY = "BARBEARIA123";

const AdminLoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [accessKey, setAccessKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const navigate = useNavigate();
  const { signIn, signUp } = useAuth();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await signIn(email, password);
      const userType = localStorage.getItem("userType");
      
      if (userType !== "admin") {
        toast({
          variant: "destructive",
          title: "Acesso negado",
          description: "Esta área é restrita para administradores.",
        });
        localStorage.removeItem("userType");
        localStorage.removeItem("userEmail");
        setIsLoading(false);
        return;
      }
      
      navigate("/admin");
    } catch (error) {
      // O erro já será mostrado pelo AuthContext
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (accessKey !== ADMIN_ACCESS_KEY) {
      toast({
        variant: "destructive",
        title: "Chave de acesso inválida",
        description: "Por favor, entre em contato com o proprietário da barbearia para obter a chave de acesso correta.",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      await signUp(email, password);
      
      localStorage.setItem("userType", "admin");
      
      toast({
        title: "Conta de administrador criada com sucesso!",
        description: "Você será redirecionado para o painel administrativo.",
      });
      
      setTimeout(() => {
        navigate("/admin");
      }, 1500);
    } catch (error) {
      // O erro já será mostrado pelo AuthContext
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col space-y-6 w-full max-w-sm">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Área Administrativa</h1>
        <p className="text-sm text-gray-400 mt-1">
          {isRegisterMode ? "Criar nova conta de administrador" : "Acesso restrito para administradores"}
        </p>
      </div>

      {isRegisterMode ? (
        <form onSubmit={handleRegister} className="flex flex-col space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="email">
              E-mail
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@barbearia.com"
              required
              className="bg-barbearia-card border-barbearia-dark"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="password">
              Senha
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              required
              className="bg-barbearia-card border-barbearia-dark"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="accessKey">
              Chave de Acesso
            </label>
            <Input
              id="accessKey"
              type="password"
              value={accessKey}
              onChange={(e) => setAccessKey(e.target.value)}
              placeholder="Chave de acesso do administrador"
              required
              className="bg-barbearia-card border-barbearia-dark"
            />
          </div>

          <Button 
            type="submit" 
            disabled={isLoading} 
            className="bg-barbearia-yellow text-black hover:bg-amber-400"
          >
            {isLoading ? "Processando..." : "Criar Conta de Administrador"}
          </Button>
        </form>
      ) : (
        <form onSubmit={handleLogin} className="flex flex-col space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="email">
              E-mail
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@barbearia.com"
              required
              className="bg-barbearia-card border-barbearia-dark"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="password">
              Senha
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              required
              className="bg-barbearia-card border-barbearia-dark"
            />
          </div>

          <Button 
            type="submit" 
            disabled={isLoading} 
            className="bg-barbearia-yellow text-black hover:bg-amber-400"
          >
            {isLoading ? "Verificando..." : "Entrar"}
          </Button>
        </form>
      )}

      <div className="text-center pt-2 border-t border-barbearia-dark">
        <button
          type="button"
          onClick={() => setIsRegisterMode(!isRegisterMode)}
          className="text-sm text-barbearia-yellow hover:underline"
        >
          {isRegisterMode ? "Já tem uma conta? Faça Login" : "Criar nova conta de administrador"}
        </button>
      </div>

      <div className="text-center text-sm">
        <a href="/" className="text-barbearia-yellow hover:underline">
          Voltar para Login de Cliente
        </a>
      </div>
    </div>
  );
};

export default AdminLoginForm;
