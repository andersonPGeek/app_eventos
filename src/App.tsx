import { Suspense, useState } from "react";
import { CartProvider } from "./contexts/CartContext";
import { useRoutes, Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/home";
import LoginPage from "./components/LoginPage";
import EventList from "./components/EventList";
import EventSchedule from "./components/EventSchedule";
import SponsorShowcase from "./components/SponsorShowcase";
import Marketplace from "./components/Marketplace";
import CheckInSection from "./components/CheckInSection";
import routes from "tempo-routes";
import BottomNav from "./components/BottomNav";
import ProductDetails from "./components/ProductDetails";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [isNavigationEnabled, setIsNavigationEnabled] = useState(false);

  const handleLogin = (email: string, password: string) => {
    // Credenciais fake para teste
    if (email === "usuario@teste.com" && password === "123456") {
      setIsAuthenticated(true);
    } else {
      alert("Email ou senha incorretos");
    }
  };

  const handleEventSelect = (eventId: string) => {
    setSelectedEventId(eventId);
    setIsNavigationEnabled(true);
  };

  return (
    <Suspense fallback={<p>Carregando...</p>}>
      <CartProvider>
        <div className="relative min-h-screen">
          {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
          <Routes>
            <Route
              path="/"
              element={
                !isAuthenticated ? (
                  <LoginPage onLogin={handleLogin} />
                ) : (
                  <EventList onSelectEvent={handleEventSelect} />
                )
              }
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
                isNavigationEnabled ? (
                  <SponsorShowcase />
                ) : (
                  <Navigate to="/" />
                )
              } 
            />
            <Route 
              path="/marketplace" 
              element={
                isNavigationEnabled ? (
                  <Marketplace />
                ) : (
                  <Navigate to="/" />
                )
              } 
            />
            <Route 
              path="/checkin" 
              element={
                isNavigationEnabled ? (
                  <CheckInSection />
                ) : (
                  <Navigate to="/" />
                )
              } 
            />
            <Route 
              path="/product/:id" 
              element={
                isNavigationEnabled ? (
                  <ProductDetails />
                ) : (
                  <Navigate to="/" />
                )
              } 
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
          {isAuthenticated && <BottomNav isEnabled={isNavigationEnabled} />}
        </div>
      </CartProvider>
    </Suspense>
  );
}

export default App;
