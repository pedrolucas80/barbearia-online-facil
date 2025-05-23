import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await signIn(email, password);
      
      // After sign in is successful, check user type and navigate accordingly
      const userType = localStorage.getItem("userType");
      if (userType === "admin") {
        navigate("/admin");
      } else if (userType === "client") {
        navigate("/agendar");
      }
      
    } catch (error) {
      // Error is already handled by AuthContext
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdminAccess = () => {
    navigate("/admin-login");
  };

  return (
    <div className="flex flex-col space-y-6 w-full max-w-sm">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Entrar</h1>
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
            placeholder="seu@email.com"
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
          {isLoading ? "Entrando..." : "Entrar"}
        </Button>
      </form>

      <div className="text-center text-sm space-y-2">
        <p>
          Não tem uma conta?{" "}
          <a href="/cadastrar" className="text-barbearia-yellow hover:underline">
            Cadastre-se
          </a>
        </p>
        <p>
          <a href="/esqueci-senha" className="text-barbearia-yellow hover:underline">
            Esqueceu sua senha?
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
