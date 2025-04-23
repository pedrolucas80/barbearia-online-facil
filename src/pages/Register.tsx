
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import RegisterForm from "@/components/auth/RegisterForm";
import Header from "@/components/layout/Header";

const Register = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Verifica se o usuário já está autenticado
    const userType = localStorage.getItem("userType");
    if (userType === "admin") {
      navigate("/admin");
    } else if (userType === "client") {
      navigate("/agendar");
    }
  }, [navigate]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-barbearia-card rounded-lg shadow-lg p-8">
          <RegisterForm />
        </div>
      </main>
    </div>
  );
};

export default Register;
