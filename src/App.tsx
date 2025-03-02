import { Suspense, useState } from "react";
import { CartProvider } from "./contexts/CartContext";
import { AuthProvider } from "./contexts/AuthContext";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Home from "./components/home";
import LoginPage from "./components/LoginPage";
import EventList from "./components/EventList";
import EventSchedule from "./components/EventSchedule";
import SponsorShowcase from "./components/SponsorShowcase";
import Marketplace from "./components/Marketplace";
import CheckInSection from "./components/CheckInSection";
import BottomNav from "./components/BottomNav";
import ProductDetails from "./components/ProductDetails";
import InstallPWAModal from "./components/InstallPWAModal";
import useInstallPWA from "./hooks/useInstallPWA";
import { useAuth } from "./contexts/AuthContext";
import CreatePassword from "./components/CreatePassword";

function AppContent() {
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const { isOpen, onClose, onInstall, isIOS } = useInstallPWA();
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  const handleEventSelect = (eventId: string) => {
    setSelectedEventId(eventId);
  };

  // Verifica se está na rota de recuperação de senha
  const isPasswordRecoveryRoute = location.pathname.startsWith('/recuperar-senha');
  
  // Verifica se está na lista de eventos
  const isEventListRoute = location.pathname === '/' && isAuthenticated;

  // Só mostra o BottomNav se tiver um evento selecionado e não estiver nas rotas especiais
  const showBottomNav = selectedEventId && isAuthenticated && !isPasswordRecoveryRoute && !isEventListRoute;

  return (
    <Suspense fallback={<p>Carregando...</p>}>
      <CartProvider>
        <div className="relative min-h-screen">
          <Routes>
            <Route
              path="/"
              element={
                !isAuthenticated ? (
                  <LoginPage />
                ) : (
                  <EventList onSelectEvent={handleEventSelect} />
                )
              }
            />
            <Route
              path="/recuperar-senha"
              element={<CreatePassword />}
            />
            <Route
              path="/schedule"
              element={
                selectedEventId ? (
                  <EventSchedule eventId={selectedEventId} />
                ) : (
                  <Navigate to="/" />
                )
              }
            />
            <Route 
              path="/sponsors" 
              element={
                selectedEventId ? (
                  <SponsorShowcase />
                ) : (
                  <Navigate to="/" />
                )
              } 
            />
            <Route 
              path="/marketplace" 
              element={
                selectedEventId ? (
                  <Marketplace />
                ) : (
                  <Navigate to="/" />
                )
              } 
            />
            <Route 
              path="/checkin" 
              element={
                selectedEventId ? (
                  <CheckInSection eventId={selectedEventId} />
                ) : (
                  <Navigate to="/" />
                )
              } 
            />
            <Route 
              path="/product/:id" 
              element={
                selectedEventId ? (
                  <ProductDetails />
                ) : (
                  <Navigate to="/" />
                )
              } 
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
          {showBottomNav && <BottomNav />}
          <InstallPWAModal
            isOpen={isOpen}
            onClose={onClose}
            onInstall={onInstall}
            isIOS={isIOS}
          />
        </div>
      </CartProvider>
    </Suspense>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
