import React from "react";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Bell,
  Calendar,
  LogOut,
  Settings,
  Users,
  Heart,
  ShoppingBag,
  UserCircle,
  Radio,
  MapPin,
  PlayCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface DashboardHeaderProps {
  user?: {
    name: string;
    email: string;
    avatar: string;
  };
  notifications?: number;
  onLogout?: () => void;
}

const DashboardHeader = ({
  user = {
    name: "John Doe",
    email: "john@example.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
  },
  notifications = 3,
  onLogout = () => console.log("Logout clicked"),
}: DashboardHeaderProps) => {
  const navigate = useNavigate();
  return (
    <header className="w-full h-20 bg-white border-b border-gray-200 px-6 flex items-center justify-between">
      <div className="flex items-center gap-4 md:gap-8">
        <h1 className="text-xl md:text-2xl font-bold">
          Gerenciador de Eventos
        </h1>

        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/schedule")}
          >
            <Calendar className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/sponsors")}
          >
            <Heart className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/marketplace")}
          >
            <ShoppingBag className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/profile")}
          >
            <UserCircle className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => navigate("/live")}>
            <Radio className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/checkin")}
          >
            <MapPin className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {notifications > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {notifications}
            </span>
          )}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <span className="font-medium">{user.name}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default DashboardHeader;
