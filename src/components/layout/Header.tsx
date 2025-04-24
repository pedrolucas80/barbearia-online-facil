
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import ProfileAvatar from "@/components/ProfileAvatar";

const Header = () => {
  const [userType, setUserType] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  useEffect(() => {
    const storedUserType = localStorage.getItem("userType");
    setUserType(storedUserType);
  }, []);

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <header className="bg-barbearia-dark py-4 px-6 flex items-center justify-between">
      <div className="flex items-center">
        <Link to={userType === "admin" ? "/admin" : userType ? "/agendar" : "/"}>
          <h1 className="text-2xl font-bold text-barbearia-yellow">Barbearia</h1>
        </Link>
      </div>

      {user && (
        <div className="flex items-center gap-4">
          {userType === "admin" ? (
            <span className="text-sm text-gray-300">Admin</span>
          ) : (
            <div className="flex items-center gap-4">
              <Link 
                to="/agendar" 
                className="text-sm text-gray-300 hover:text-barbearia-yellow transition-colors"
              >
                Agendar
              </Link>
              <Link 
                to="/meus-agendamentos" 
                className="text-sm text-gray-300 hover:text-barbearia-yellow transition-colors"
              >
                Meus Agendamentos
              </Link>
            </div>
          )}
          <div className="flex items-center gap-3">
            {user && <ProfileAvatar user={user} size="sm" />}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleLogout}
              className="border-barbearia-yellow text-barbearia-yellow hover:bg-barbearia-yellow hover:text-black"
            >
              Sair
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
