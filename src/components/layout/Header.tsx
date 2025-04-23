
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Header = () => {
  const [userType, setUserType] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUserType = localStorage.getItem("userType");
    setUserType(storedUserType);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userType");
    localStorage.removeItem("userEmail");
    navigate("/");
  };

  return (
    <header className="bg-barbearia-dark py-4 px-6 flex items-center justify-between">
      <div className="flex items-center">
        <Link to={userType === "admin" ? "/admin" : userType ? "/agendar" : "/"}>
          <h1 className="text-2xl font-bold text-barbearia-yellow">Barbearia</h1>
        </Link>
      </div>

      {userType && (
        <div className="flex items-center gap-4">
          {userType === "admin" ? (
            <span className="text-sm text-gray-300">Admin</span>
          ) : (
            <span className="text-sm text-gray-300">
              {localStorage.getItem("userEmail")}
            </span>
          )}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleLogout}
            className="border-barbearia-yellow text-barbearia-yellow hover:bg-barbearia-yellow hover:text-black"
          >
            Sair
          </Button>
        </div>
      )}
    </header>
  );
};

export default Header;
