
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "@/components/auth/LoginForm";
import Header from "@/components/layout/Header";
import { useAuth } from "@/contexts/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    // Verifica se o usuário já está autenticado
    if (user) {
      const userType = localStorage.getItem("userType");
      if (userType === "admin") {
        navigate("/admin");
      } else if (userType === "client") {
        navigate("/agendar");
      }
    }
  }, [navigate, user]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-barbearia-card rounded-lg shadow-lg p-8">
          <LoginForm />
        </div>
      </main>
    </div>
  );
};

export default Login;
