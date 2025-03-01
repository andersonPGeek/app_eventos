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

  const CACHE_KEY = 'events_cache';
  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos em millisegundos

  const getCache = () => {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < CACHE_DURATION) {
        console.log('📦 Usando dados do cache');
        return data;
      }
      console.log('🕒 Cache expirado');
    }
    return null;
  };

  const setCache = (data: Event[]) => {
    localStorage.setItem(CACHE_KEY, JSON.stringify({
      data,
      timestamp: Date.now()
    }));
  };

  const formatFirestoreDate = (timestamp: FirestoreTimestamp) => {
    const startTime = performance.now();
    try {
      const date = new Date(timestamp._seconds * 1000);
      const formattedDate = date.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        weekday: 'long',
      });
      console.log(`⏱️ Formatação de data: ${(performance.now() - startTime).toFixed(2)}ms`);
      return formattedDate;
    } catch (error) {
      console.error('❌ Erro ao formatar data:', error);
      return 'Data não disponível';
    }
  };

  const formatFullAddress = (event: EventData): string => {
    const startTime = performance.now();
    const address = `${event.logradouro}, ${event.numero} - ${event.bairro}, ${event.cidade} - ${event.estado}, ${event.cep}`;
    console.log(`⏱️ Formatação de endereço: ${(performance.now() - startTime).toFixed(2)}ms`);
    return address;
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
    console.time('🌍 Tempo total para obter localização');
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.timeEnd('🌍 Tempo total para obter localização');
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
          console.log('📍 Localização obtida:', position.coords);
        },
        (error) => {
          console.timeEnd('🌍 Tempo total para obter localização');
          console.error('❌ Erro ao obter localização:', error);
        }
      );
    }
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      const totalStartTime = performance.now();
      console.log('🚀 Iniciando busca de eventos...');
      
      try {
        // Tentar usar cache primeiro
        const cachedEvents = getCache();
        if (cachedEvents) {
          setEvents(cachedEvents);
          setLoading(false);
          
          // Atualizar em background
          fetchAndUpdateEvents();
          return;
        }

        await fetchAndUpdateEvents();
      } catch (error) {
        console.error('❌ Erro detalhado ao buscar eventos:', error);
      } finally {
        setLoading(false);
        console.log(`⏱️ Tempo total de execução: ${(performance.now() - totalStartTime).toFixed(2)}ms`);
      }
    };

    const fetchAndUpdateEvents = async () => {
      // Medindo tempo da requisição
      const fetchStartTime = performance.now();
      console.log(`📡 Fazendo requisição para: ${API_ENDPOINTS.eventos}`);
      const response = await fetch(API_ENDPOINTS.eventos);
      console.log(`⏱️ Tempo de requisição: ${(performance.now() - fetchStartTime).toFixed(2)}ms`);
      
      // Medindo tempo do parse JSON
      const jsonStartTime = performance.now();
      const data = await response.json();
      console.log(`⏱️ Tempo de parse JSON: ${(performance.now() - jsonStartTime).toFixed(2)}ms`);
      console.log(`📦 Quantidade de eventos recebidos: ${data.length}`);
      
      // Medindo tempo da formatação dos dados
      const formatStartTime = performance.now();
      const formattedEvents = data.flatMap((event: EventData) => {
        console.log(`🔄 Processando evento: ${event.nomeEvento}`);
        const eventStartTime = performance.now();
        
        const formattedSessions = event.dataEvento.map((timestamp, index) => {
          const sessionStartTime = performance.now();
          const formatted = {
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
          };
          console.log(`⏱️ Tempo de formatação da sessão ${index + 1}: ${(performance.now() - sessionStartTime).toFixed(2)}ms`);
          return formatted;
        });
        
        console.log(`⏱️ Tempo total de processamento do evento: ${(performance.now() - eventStartTime).toFixed(2)}ms`);
        return formattedSessions;
      });

      console.log(`⏱️ Tempo total de formatação: ${(performance.now() - formatStartTime).toFixed(2)}ms`);
      console.log(`📊 Total de sessões formatadas: ${formattedEvents.length}`);
      
      setCache(formattedEvents);
      setEvents(formattedEvents);
    };

    console.log('🔄 Iniciando ciclo de busca de eventos');
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
    return (
      <div className="min-h-screen bg-gray-100 p-4 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
          <p className="text-lg text-gray-600">Carregando eventos...</p>
          <p className="text-sm text-gray-400">Isso pode levar alguns segundos</p>
        </div>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 p-4 flex items-center justify-center">
        <div className="text-center space-y-2">
          <p className="text-lg text-gray-600">Nenhum evento encontrado</p>
          <p className="text-sm text-gray-400">Tente novamente mais tarde</p>
        </div>
      </div>
    );
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
