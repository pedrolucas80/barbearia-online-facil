
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const RegisterForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulando criação de conta para o MVP
    setTimeout(() => {
      // Para este MVP, apenas salvamos em localStorage
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      users.push({ name, email, password });
      localStorage.setItem("users", JSON.stringify(users));
      
      localStorage.setItem("userType", "client");
      localStorage.setItem("userEmail", email);
      
      toast({
        title: "Conta criada com sucesso!",
        description: "Bem-vindo à Barbearia.",
      });
      
      navigate("/agendar");
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="flex flex-col space-y-6 w-full max-w-sm">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Cadastrar</h1>
      </div>

      <form onSubmit={handleRegister} className="flex flex-col space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="name">
            Nome
          </label>
          <Input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Seu nome completo"
            required
            className="bg-barbearia-card border-barbearia-dark"
          />
        </div>
        
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
          {isLoading ? "Cadastrando..." : "Cadastrar"}
        </Button>
      </form>

      <div className="text-center text-sm">
        <p>
          Já tem uma conta?{" "}
          <a href="/" className="text-barbearia-yellow hover:underline">
            Entrar
          </a>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;
