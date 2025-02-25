import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { CalendarDays, MapPin, Users } from "lucide-react";
import { API_ENDPOINTS } from "../config/api";

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

const EventList = ({ onSelectEvent }: EventListProps) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        console.log('Iniciando busca de eventos na URL:', API_ENDPOINTS.eventos);
        const response = await fetch(API_ENDPOINTS.eventos);
        console.log('Status da resposta:', response.status);
        const data = await response.json();
        console.log('Dados recebidos:', data);
        
        const formattedEvents = data.map((event: any) => ({
          id: event.id,
          title: event.nomeEvento,
          date: new Date(event.dataEvento._seconds * 1000).toISOString(),
          location: event.cidade,
          attendees: event.participantes,
          imageUrl: event.foto
        }));
        console.log('Eventos formatados:', formattedEvents);

        setEvents(formattedEvents);
      } catch (error) {
        console.error('Erro detalhado ao buscar eventos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return <div className="text-center p-4">Carregando eventos...</div>;
  }

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
