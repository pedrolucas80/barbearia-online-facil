
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminLoginForm from "@/components/auth/AdminLoginForm";
import Header from "@/components/layout/Header";

const AdminLogin = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Verifica se o usuário já está autenticado como admin
    const userType = localStorage.getItem("userType");
    if (userType === "admin") {
      navigate("/admin");
    }
  }, [navigate]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-barbearia-card rounded-lg shadow-lg p-8">
          <AdminLoginForm />
        </div>
      </main>
    </div>
  );
};

export default AdminLogin;
