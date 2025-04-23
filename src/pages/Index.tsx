import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Login from "./Login";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirecionar para a página de login
    navigate("/");
  }, [navigate]);

  // Renderiza o componente de login como fallback caso o redirecionamento não funcione
  return <Login />;
};

export default Index;
