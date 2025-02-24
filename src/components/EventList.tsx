import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { CalendarDays, MapPin, Users } from "lucide-react";

interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  attendees: number;
  imageUrl: string;
}

interface EventListProps {
  events?: Event[];
  onSelectEvent: (eventId: string) => void;
}

const defaultEvents: Event[] = [
  {
    id: "1",
    title: "TechConf 2024",
    date: "2024-06-15",
    location: "São Paulo, SP",
    attendees: 500,
    imageUrl:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=400&fit=crop",
  },
  {
    id: "2",
    title: "DevSummit Brasil",
    date: "2024-07-20",
    location: "Rio de Janeiro, RJ",
    attendees: 300,
    imageUrl:
      "https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=800&h=400&fit=crop",
  },
];

const EventList = ({
  events = defaultEvents,
  onSelectEvent,
}: EventListProps) => {
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Selecione um Evento
        </h1>
        <div className="grid gap-4">
          {events.map((event) => (
            <Card
              key={event.id}
              className="overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="relative h-48">
                <img
                  src={event.imageUrl}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-2">{event.title}</h2>
                <div className="grid gap-2 text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-2">
                    <CalendarDays className="w-4 h-4" />
                    {new Date(event.date).toLocaleDateString("pt-BR")}
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {event.location}
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    {event.attendees} participantes
                  </div>
                </div>
                <Button
                  className="w-full"
                  onClick={() => onSelectEvent(event.id)}
                >
                  Participar
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EventList;
