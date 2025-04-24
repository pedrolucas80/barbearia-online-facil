
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/layout/Header";

const EmailConfirmation = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkEmailConfirmation = () => {
      supabase.auth.onAuthStateChange((event) => {
        if (event === "SIGNED_IN") {
          navigate("/agendar");
        }
      });
    };

    checkEmailConfirmation();
  }, [navigate]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-barbearia-card rounded-lg shadow-lg p-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Confirme seu Email</h1>
          <p className="text-gray-400 mb-6">
            Um link de confirmação foi enviado para seu email.
            Por favor, verifique sua caixa de entrada e clique no link para confirmar seu cadastro.
          </p>
          <p className="text-sm text-gray-400">
            Após confirmar seu email, você será redirecionado automaticamente para a página de agendamento.
          </p>
        </div>
      </main>
    </div>
  );
};

export default EmailConfirmation;
