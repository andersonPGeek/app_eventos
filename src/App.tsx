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
import LiveStream from "./components/LiveStream";
import routes from "tempo-routes";
import BottomNav from "./components/BottomNav";
import ProductDetails from "./components/ProductDetails";
import Cart from "./components/Cart";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

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
  };

  return (
    <Suspense fallback={<p>Carregando...</p>}>
      <CartProvider>
        <div className="relative min-h-screen">
          <Routes>
            <Route
              path="/"
              element={
                !isAuthenticated ? (
                  <LoginPage onLogin={handleLogin} />
                ) : !selectedEventId ? (
                  <EventList onSelectEvent={handleEventSelect} />
                ) : (
                  <EventSchedule />
                )
              }
            />
            <Route path="/schedule" element={<EventSchedule />} />
            <Route path="/sponsors" element={<SponsorShowcase />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/checkin" element={<CheckInSection />} />
            <Route path="/live" element={<LiveStream />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
          {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
          {isAuthenticated && selectedEventId && <BottomNav />}
        </div>
      </CartProvider>
    </Suspense>
  );
}

export default App;
