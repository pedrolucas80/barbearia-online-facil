
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

// Admin credentials - in a real app, these would be stored securely
const ADMIN_EMAIL = "teste@teste.com";
const ADMIN_PASSWORD = "senha12345";

const AdminLoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simple check against hardcoded credentials
      if (email.trim().toLowerCase() !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
        toast({
          variant: "destructive",
          title: "Acesso negado",
          description: email.trim().toLowerCase() !== ADMIN_EMAIL 
            ? "Apenas o administrador pode acessar esta área."
            : "Senha incorreta. Verifique e tente novamente.",
        });
        setIsLoading(false);
        return;
      }

      // If credentials match, set admin as authenticated
      localStorage.setItem("userType", "admin");
      toast({
        title: "Login realizado com sucesso!",
        description: "Bem-vindo à área administrativa.",
      });
      navigate("/admin");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao fazer login",
        description: "Ocorreu um erro ao tentar acessar. Tente novamente.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col space-y-6 w-full max-w-sm">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Área Administrativa</h1>
        <p className="text-sm text-gray-400 mt-1">
          Acesso restrito apenas para administradores.
        </p>
      </div>

      <form onSubmit={handleLogin} className="flex flex-col space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="email">
            E-mail do administrador
          </label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Administrador"
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

      <div className="text-center text-sm">
        <a href="/" className="text-barbearia-yellow hover:underline">
          Voltar para Login de Cliente
        </a>
      </div>
    </div>
  );
};

export default AdminLoginForm;
