import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { CalendarDays, Clock, MapPin } from "lucide-react";

interface SessionCardProps {
  title?: string;
  speaker?: {
    name: string;
    avatar: string;
    role: string;
  };
  time?: string;
  duration?: string;
  track?: string;
  stage?: string;
  location?: string;
  onClick?: () => void;
}

const SessionCard = ({
  title = "Introduction to Event Management",
  speaker = {
    name: "Jane Smith",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=jane",
    role: "Senior Event Planner",
  },
  time = "09:00 AM",
  duration = "45 min",
  track = "Main Track",
  stage = "Main Stage",
  location = "Room 101",
  onClick,
}: SessionCardProps) => {
  return (
    <Card
      className="w-full max-w-[280px] h-[160px] bg-white hover:shadow-lg transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <CardHeader className="p-4 pb-2">
        <div className="space-y-2">
          <div className="flex flex-wrap gap-1">
            <Badge variant="secondary" className="text-[10px] h-5">
              {stage}
            </Badge>
            <Badge variant="outline" className="text-[10px] h-5">
              {track}
            </Badge>
          </div>
          <div>
            <CardTitle className="text-sm font-semibold line-clamp-1">
              {title}
            </CardTitle>
            <CardDescription className="text-xs mt-1">
              <div className="flex items-center gap-2">
                <Clock className="w-3 h-3" />
                <span>
                  {time} • {duration}
                </span>
              </div>
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="flex items-center gap-3 mb-2">
          <Avatar className="w-8 h-8">
            <AvatarImage src={speaker.avatar} alt={speaker.name} />
            <AvatarFallback>
              {speaker.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{speaker.name}</p>
            <p className="text-xs text-muted-foreground truncate">
              {speaker.role}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="w-3 h-3" />
          <span>{location}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default SessionCard;
