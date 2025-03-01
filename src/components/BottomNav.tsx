import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Home,
  Calendar,
  Heart,
  ShoppingBag,
  MapPin,
  LogOut,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

interface BottomNavProps {
  isEnabled: boolean;
}

const BottomNav = ({ isEnabled }: BottomNavProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const getItemStyle = (path: string) => {
    const baseStyle = "flex flex-col items-center gap-1";
    const activeStyle = isActive(path) ? "text-primary" : "text-gray-500";
    
    // Home está sempre habilitado
    if (path === "/") {
      return `${baseStyle} cursor-pointer ${activeStyle} hover:text-gray-900`;
    }

    // Outros itens dependem de isEnabled
    if (isEnabled) {
      return `${baseStyle} cursor-pointer ${activeStyle} hover:text-gray-900`;
    }

    return `${baseStyle} cursor-not-allowed opacity-50 pointer-events-none`;
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
      <div className="flex justify-around items-center h-16 max-w-md mx-auto px-4">
        <div
          onClick={() => navigate("/")}
          className={getItemStyle("/")}
        >
          <Home className="h-5 w-5" />
          <span className="text-xs">Home</span>
        </div>
        <div
          onClick={() => isEnabled && navigate("/schedule")}
          className={getItemStyle("/schedule")}
        >
          <Calendar className="h-5 w-5" />
          <span className="text-xs">Programação</span>
        </div>
        <div
          onClick={() => isEnabled && navigate("/sponsors")}
          className={getItemStyle("/sponsors")}
        >
          <Heart className="h-5 w-5" />
          <span className="text-xs">Patrocinadores</span>
        </div>
        <div
          onClick={() => isEnabled && navigate("/marketplace")}
          className={getItemStyle("/marketplace")}
        >
          <ShoppingBag className="h-5 w-5" />
          <span className="text-xs">Loja</span>
        </div>
        <div
          onClick={() => isEnabled && navigate("/checkin")}
          className={getItemStyle("/checkin")}
        >
          <MapPin className="h-5 w-5" />
          <span className="text-xs">Check-in</span>
        </div>
        <div
          onClick={handleLogout}
          className="flex flex-col items-center gap-1 cursor-pointer text-red-500 hover:text-red-700"
        >
          <LogOut className="h-5 w-5" />
          <span className="text-xs">Sair</span>
        </div>
      </div>
    </div>
  );
};

export default BottomNav;
