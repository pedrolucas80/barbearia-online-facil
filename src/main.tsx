import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { initializeAppData } from './services/AppointmentService'

// Inicializar dados do aplicativo
initializeAppData();

createRoot(document.getElementById("root")!).render(<App />);
