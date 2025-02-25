import { Calendar, Heart, ShoppingBag, Radio, MapPin } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: Calendar, label: "Agenda", path: "/schedule" },
    { icon: Heart, label: "Patrocinadores", path: "/sponsors" },
    { icon: ShoppingBag, label: "Loja", path: "/marketplace" },
    { icon: Radio, label: "Live", path: "/live" },
    { icon: MapPin, label: "Check-in", path: "/checkin" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
      <nav className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                "flex flex-col items-center justify-center flex-1 h-full",
                "transition-colors duration-200",
                isActive
                  ? "text-primary hover:text-primary/90"
                  : "text-muted-foreground hover:text-primary",
              )}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-xs mt-1">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default BottomNav;
