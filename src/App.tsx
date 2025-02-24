import { Suspense, useState } from "react";
import { useRoutes, Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/home";
import LoginPage from "./components/LoginPage";
import EventList from "./components/EventList";
import routes from "tempo-routes";

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
      <>
        <Routes>
          <Route
            path="/"
            element={
              !isAuthenticated ? (
                <LoginPage onLogin={handleLogin} />
              ) : !selectedEventId ? (
                <EventList onSelectEvent={handleEventSelect} />
              ) : (
                <Home />
              )
            }
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
      </>
    </Suspense>
  );
}

export default App;
