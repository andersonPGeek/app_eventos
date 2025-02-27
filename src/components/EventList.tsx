import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { CalendarDays, MapPin, Users, Map, Car, ArrowRight } from "lucide-react";
import { API_ENDPOINTS } from "../config/api";
import { useNavigate } from "react-router-dom";

interface FirestoreTimestamp {
  _seconds: number;
  _nanoseconds: number;
}

interface EventData {
  id: string;
  nomeEvento: string;
  dataEvento: FirestoreTimestamp[];
  cidade: string;
  participantes: number;
  foto: string;
  bairro: string;
  estado: string;
  duracao: number;
  logradouro: string;
  numero: string;
  cep: string;
  latitude: number;
  longitude: number;
}

interface Event {
  id: string;
  sessionId: string;
  title: string;
  date: string;
  location: string;
  fullAddress: string;
  attendees: number;
  imageUrl: string;
  latitude: number;
  longitude: number;
}

interface EventListProps {
  events?: Event[];
  onSelectEvent: (eventId: string) => void;
}

const EventList = ({ onSelectEvent }: EventListProps) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const navigate = useNavigate();

  const formatFirestoreDate = (timestamp: FirestoreTimestamp) => {
    try {
      const date = new Date(timestamp._seconds * 1000);
      return date.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        weekday: 'long',
      });
    } catch (error) {
      console.error('Erro ao formatar data:', error);
      return 'Data não disponível';
    }
  };

  const formatFullAddress = (event: EventData): string => {
    return `${event.logradouro}, ${event.numero} - ${event.bairro}, ${event.cidade} - ${event.estado}, ${event.cep}`;
  };

  const isIOS = () => {
    return /iPad|iPhone|iPod/.test(navigator.userAgent);
  };

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          console.error('Erro ao obter localização:', error);
        }
      );
    }
  };

  useEffect(() => {
    getUserLocation();
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        console.log('Iniciando busca de eventos na URL:', API_ENDPOINTS.eventos);
        const response = await fetch(API_ENDPOINTS.eventos);
        console.log('Status da resposta:', response.status);
        const data = await response.json();
        console.log('Dados recebidos:', data);
        
        const formattedEvents = data.flatMap((event: EventData) => {
          return event.dataEvento.map((timestamp, index) => ({
            id: event.id,
            sessionId: `${event.id}-${index}`,
            title: event.nomeEvento,
            date: formatFirestoreDate(timestamp),
            location: `${event.cidade}, ${event.estado}`,
            fullAddress: formatFullAddress(event),
            attendees: event.participantes,
            imageUrl: event.foto,
            latitude: event.latitude,
            longitude: event.longitude
          }));
        });

        console.log('Eventos formatados com múltiplas datas:', formattedEvents);
        setEvents(formattedEvents);
      } catch (error) {
        console.error('Erro detalhado ao buscar eventos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleOpenMaps = (event: Event) => {
    const encodedAddress = encodeURIComponent(event.fullAddress);
    
    if (isIOS()) {
      // Apple Maps URL format
      window.open(`maps://maps.apple.com/?daddr=${encodedAddress}`, '_blank');
      // Fallback para web se o app não abrir
      setTimeout(() => {
        window.open(`https://maps.apple.com/?daddr=${encodedAddress}`, '_blank');
      }, 500);
    } else {
      // Google Maps para outros dispositivos
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`, '_blank');
    }
  };

  const handleOpenUber = (event: Event) => {
    if (!userLocation) {
      alert('Não foi possível obter sua localização. Por favor, permita o acesso à localização.');
      return;
    }

    const uberUrl = `https://m.uber.com/ul/?action=setPickup&pickup[latitude]=${userLocation.latitude}&pickup[longitude]=${userLocation.longitude}&pickup[formatted_address]=Localização%20Atual&dropoff[latitude]=${event.latitude}&dropoff[longitude]=${event.longitude}&dropoff[formatted_address]=${encodeURIComponent(event.title)}`;
    
    window.open(uberUrl, '_blank');
  };

  const handleEventSelect = (eventId: string) => {
    onSelectEvent(eventId);
    navigate("/schedule");
  };

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
              key={event.sessionId}
              className="overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="relative h-48">
                <img
                  src={event.imageUrl}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-0 right-0 bg-black bg-opacity-70 text-white px-4 py-2 m-2 rounded-md">
                  <CalendarDays className="w-4 h-4 inline-block mr-2" />
                  {event.date}
                </div>
              </div>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-2">{event.title}</h2>
                <div className="grid gap-2 text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {event.fullAddress}
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    {event.attendees} participantes
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    className="flex-1 flex items-center justify-center gap-2"
                    onClick={() => handleEventSelect(event.id)}
                  >
                    Entrar
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleOpenMaps(event)}
                    title="Abrir no Maps"
                  >
                    <Map className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleOpenUber(event)}
                    title="Abrir no Uber"
                  >
                    <Car className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EventList;
