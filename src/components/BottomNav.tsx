import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Home,
  Calendar,
  Heart,
  ShoppingBag,
  MoreHorizontal,
  MapPin,
  LogOut
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const getItemStyle = (path: string) => {
    const baseStyle = "flex flex-col items-center gap-1 cursor-pointer";
    const activeStyle = isActive(path) ? "text-primary" : "text-gray-500";
    return `${baseStyle} ${activeStyle} hover:text-gray-900`;
  };

  const handleLogout = () => {
    logout();
    navigate("/");
    setIsMoreOpen(false);
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
          onClick={() => navigate("/schedule")}
          className={getItemStyle("/schedule")}
        >
          <Calendar className="h-5 w-5" />
          <span className="text-xs">Programação</span>
        </div>
        <div
          onClick={() => navigate("/sponsors")}
          className={getItemStyle("/sponsors")}
        >
          <Heart className="h-5 w-5" />
          <span className="text-xs">Patrocinadores</span>
        </div>
        <div
          onClick={() => navigate("/marketplace")}
          className={getItemStyle("/marketplace")}
        >
          <ShoppingBag className="h-5 w-5" />
          <span className="text-xs">Loja</span>
        </div>

        <Sheet open={isMoreOpen} onOpenChange={setIsMoreOpen}>
          <SheetTrigger asChild>
            <div className={`flex flex-col items-center gap-1 cursor-pointer ${isMoreOpen ? 'text-primary' : 'text-gray-500'} hover:text-gray-900`}>
              <MoreHorizontal className="h-5 w-5" />
              <span className="text-xs">Mais</span>
            </div>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[200px]">
            <SheetHeader className="text-left">
              <SheetTitle>Mais opções</SheetTitle>
            </SheetHeader>
            <div className="mt-6 space-y-4">
              <div
                onClick={() => {
                  navigate("/checkin");
                  setIsMoreOpen(false);
                }}
                className="flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-gray-100"
              >
                <MapPin className="h-5 w-5" />
                <span>Check-in</span>
              </div>
              <div
                onClick={handleLogout}
                className="flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-gray-100 text-red-500 hover:text-red-700"
              >
                <LogOut className="h-5 w-5" />
                <span>Sair</span>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default BottomNav;
