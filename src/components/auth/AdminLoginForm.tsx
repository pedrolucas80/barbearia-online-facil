
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const AdminLoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Verificando credenciais de admin
    setTimeout(() => {
      if (email === "admin@barbearia.com" && password === "admin123") {
        localStorage.setItem("userType", "admin");
        navigate("/admin");
      } else {
        toast({
          variant: "destructive",
          title: "Erro de autenticação",
          description: "Credenciais de administrador inválidas.",
        });
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="flex flex-col space-y-6 w-full max-w-sm">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Área Administrativa</h1>
        <p className="text-sm text-gray-400 mt-1">
          Acesso restrito para administradores
        </p>
      </div>

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

      <div className="text-center text-sm">
        <a href="/" className="text-barbearia-yellow hover:underline">
          Voltar para Login de Cliente
        </a>
      </div>
    </div>
  );
};

export default AdminLoginForm;
