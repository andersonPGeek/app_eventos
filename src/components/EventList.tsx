import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { CalendarDays, MapPin, Users, Map, Car, ArrowRight } from "lucide-react";
import { API_ENDPOINTS } from "../config/api";
import { useNavigate } from "react-router-dom";
import LocationPermissionModal from './LocationPermissionModal';
import UberFallbackModal from './UberFallbackModal';

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
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showUberFallbackModal, setShowUberFallbackModal] = useState(false);
  const [pendingUberEvent, setPendingUberEvent] = useState<Event | null>(null);
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

  const geocodeAddress = async (address: string): Promise<{ lat: number; lng: number } | null> => {
    try {
      // Primeiro tenta com o endereço completo
      const searchQuery = `${address}, Brasil`;
      console.log('🔍 Tentando geocodificação para:', searchQuery);

      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1&addressdetails=1`,
        {
          headers: {
            'Accept-Language': 'pt-BR',
            'User-Agent': 'AppEventos/1.0'
          }
        }
      );
      
      const data = await response.json();
      console.log('📡 Resposta da API:', data);
      
      if (data && data[0]) {
        const result = {
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon)
        };
        console.log('✅ Coordenadas encontradas:', result);
        return result;
      }

      // Se não encontrou, tenta só com cidade e estado
      const cityStateMatch = address.match(/([^,]+),\s*([^-]+)\s*-\s*([^,]+)/);
      if (cityStateMatch) {
        const cidade = cityStateMatch[2].trim();
        const estado = cityStateMatch[3].trim();
        const fallbackQuery = `${cidade}, ${estado}, Brasil`;
        
        console.log('🔄 Tentando com cidade/estado:', fallbackQuery);

        const fallbackResponse = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(fallbackQuery)}&limit=1`,
          {
            headers: {
              'Accept-Language': 'pt-BR',
              'User-Agent': 'AppEventos/1.0'
            }
          }
        );
        
        const fallbackData = await fallbackResponse.json();
        
        if (fallbackData && fallbackData[0]) {
          const result = {
            lat: parseFloat(fallbackData[0].lat),
            lng: parseFloat(fallbackData[0].lon)
          };
          console.log('✅ Coordenadas encontradas (fallback):', result);
          return result;
        }
      }

      console.log('❌ Nenhum resultado encontrado para o endereço');
      return null;
    } catch (error) {
      console.error('❌ Erro na geocodificação:', error);
      return null;
    }
  };

  const fetchAndUpdateEvents = async () => {
    const fetchStartTime = performance.now();
    console.log(`📡 Fazendo requisição para: ${API_ENDPOINTS.eventos}`);
    const response = await fetch(API_ENDPOINTS.eventos);
    console.log(`⏱️ Tempo de requisição: ${(performance.now() - fetchStartTime).toFixed(2)}ms`);
    
    const jsonStartTime = performance.now();
    const data = await response.json();
    console.log(`⏱️ Tempo de parse JSON: ${(performance.now() - jsonStartTime).toFixed(2)}ms`);
    console.log(`📦 Quantidade de eventos recebidos: ${data.length}`);
    
    const formatStartTime = performance.now();
    const formattedEvents = await Promise.all(data.flatMap(async (event: EventData) => {
      console.log(`🔄 Processando evento: ${event.nomeEvento}`, {
        latitude: event.latitude,
        longitude: event.longitude,
        tipo_lat: typeof event.latitude,
        tipo_long: typeof event.longitude
      });
      const eventStartTime = performance.now();
      
      let coordinates = { lat: 0, lng: 0 };
      
      // Verificar se o evento já tem coordenadas válidas
      if (event.latitude !== undefined && event.longitude !== undefined) {
        const lat = Number(event.latitude);
        const lng = Number(event.longitude);
        
        console.log('📊 Valores convertidos:', {
          lat: lat,
          lng: lng,
          isNaN_lat: isNaN(lat),
          isNaN_lng: isNaN(lng)
        });

        if (!isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0) {
          coordinates = { lat, lng };
          console.log('📍 Usando coordenadas existentes do evento:', coordinates);
        } else {
          console.log('⚠️ Coordenadas existentes inválidas:', {
            latitude_original: event.latitude,
            longitude_original: event.longitude,
            latitude_convertida: lat,
            longitude_convertida: lng
          });
        }
      }
      
      // Se não tiver coordenadas válidas, tentar geocodificação
      if (coordinates.lat === 0 || coordinates.lng === 0) {
        const address = formatFullAddress(event);
        console.log('🔍 Tentando geocodificação para endereço:', address);
        const geocoded = await geocodeAddress(address);
        if (geocoded) {
          coordinates = geocoded;
          console.log('📍 Coordenadas obtidas por geocodificação:', coordinates);
        } else {
          console.warn('⚠️ Geocodificação falhou para:', event.nomeEvento);
        }
      }

      // Validação final das coordenadas
      if (coordinates.lat === 0 || coordinates.lng === 0 || 
          isNaN(coordinates.lat) || isNaN(coordinates.lng)) {
        console.error('❌ Coordenadas inválidas para o evento:', {
          evento: event.nomeEvento,
          coordenadas: coordinates,
          endereco: formatFullAddress(event)
        });
      }
      
      const formattedSessions = event.dataEvento.map((timestamp, index) => ({
        id: event.id,
        sessionId: `${event.id}-${index}`,
        title: event.nomeEvento,
        date: formatFirestoreDate(timestamp),
        location: `${event.cidade}, ${event.estado}`,
        fullAddress: formatFullAddress(event),
        attendees: event.participantes,
        imageUrl: event.foto,
        latitude: coordinates.lat,
        longitude: coordinates.lng
      }));
      
      console.log(`⏱️ Tempo total de processamento do evento: ${(performance.now() - eventStartTime).toFixed(2)}ms`);
      return formattedSessions;
    }));

    const flattenedEvents = formattedEvents.flat();
    console.log(`⏱️ Tempo total de formatação: ${(performance.now() - formatStartTime).toFixed(2)}ms`);
    console.log(`📊 Total de sessões formatadas: ${flattenedEvents.length}`);
    
    // Validar se todos os eventos têm coordenadas válidas
    const eventsWithoutCoordinates = flattenedEvents.filter(
      event => !event.latitude || !event.longitude || 
               event.latitude === 0 || event.longitude === 0
    );
    
    if (eventsWithoutCoordinates.length > 0) {
      console.warn('⚠️ Eventos sem coordenadas válidas:', eventsWithoutCoordinates.map(e => e.title));
    }
    
    setCache(flattenedEvents);
    setEvents(flattenedEvents);
  };

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

  const handleOpenUber = async (event: Event) => {
    setSelectedEvent(event);
    const permissionState = await checkLocationPermission();
    
    if (permissionState === 'granted') {
      // Se já tem permissão, tenta obter a localização atual
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude: fromLat, longitude: fromLng } = position.coords;
          const { latitude: toLat, longitude: toLng } = event;
          
          // Determina qual URL usar baseado no sistema operacional
          const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
          let uberUrl;
          
          if (isIOS) {
            // URL para iOS
            uberUrl = `uber://?action=setPickup&pickup[latitude]=${fromLat}&pickup[longitude]=${fromLng}&dropoff[latitude]=${toLat}&dropoff[longitude]=${toLng}`;
            
            // Fallback para web se o app não estiver instalado
            setTimeout(() => {
              window.location.href = `https://m.uber.com/ul/?action=setPickup&pickup[latitude]=${fromLat}&pickup[longitude]=${fromLng}&dropoff[latitude]=${toLat}&dropoff[longitude]=${toLng}`;
            }, 500);
          } else {
            // URL para Android e outros
            uberUrl = `https://m.uber.com/ul/?action=setPickup&pickup[latitude]=${fromLat}&pickup[longitude]=${fromLng}&dropoff[latitude]=${toLat}&dropoff[longitude]=${toLng}`;
          }
   
          window.location.href = uberUrl;
        },
        (error) => {
          console.error('Erro ao obter localização:', error);
          setShowUberFallbackModal(true);
        }
      );
    } else {
      // Se não tem permissão, guarda o evento e mostra o modal de permissão
      setPendingUberEvent(event);
      setShowLocationModal(true);
    }
  };

  const handleEventSelect = (eventId: string) => {
    onSelectEvent(eventId);
    navigate("/schedule");
  };

  const handleContinueToUber = async () => {
    if (!selectedEvent) return;

    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const encodedAddress = encodeURIComponent(selectedEvent.fullAddress);

    // URL do Uber apenas com endereço de destino
    const uberUrl = `https://m.uber.com/ul/?drop=${encodedAddress}`;

    if (isIOS) {
      // Tenta abrir o app primeiro
      window.open(`uber://?action=setPickup&dropoff[formatted_address]=${encodedAddress}`);
      
      // Fallback para web após 500ms
      setTimeout(() => {
        window.open(uberUrl, '_blank');
      }, 500);
    } else {
      // Em outros dispositivos, abre direto a versão web
      window.open(uberUrl, '_blank');
    }

    setShowUberFallbackModal(false);
  };

  const checkLocationPermission = async (): Promise<PermissionState> => {
    try {
      const permission = await navigator.permissions.query({ name: 'geolocation' });
      return permission.state;
    } catch (error) {
      console.error('Erro ao verificar permissão:', error);
      return 'denied';
    }
  };

  const requestLocationPermission = () => {
    let locationGranted = false;
    let timeoutId: NodeJS.Timeout;

    // Timer de 3 segundos
    const timer = new Promise((resolve) => {
      timeoutId = setTimeout(() => {
        if (!locationGranted) {
          console.log('Timeout: Permissão de localização não detectada em 3 segundos');
          resolve('timeout');
        }
      }, 3000);
    });

    // Requisição de localização
    const locationRequest = new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          locationGranted = true;
          clearTimeout(timeoutId);
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
          
          // Permissão concedida com sucesso
          setShowLocationModal(false);
          if (pendingUberEvent) {
            handleOpenUber(pendingUberEvent);
            setPendingUberEvent(null);
          }
          resolve('granted');
        },
        (error) => {
          locationGranted = true;
          clearTimeout(timeoutId);
          console.error('Erro ao obter localização:', error);
          resolve('error');

          // Se o erro for de permissão negada
          if (error.code === error.PERMISSION_DENIED) {
            setShowLocationModal(false);
            if (pendingUberEvent) {
              setSelectedEvent(pendingUberEvent);
              setShowUberFallbackModal(true);
              setPendingUberEvent(null);
            }
          }
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
    });

    // Corrida em paralelo entre o timer e a requisição de localização
    Promise.race([locationRequest, timer]).then((result) => {
      if (result === 'timeout' && !locationGranted) {
        // Se o timeout vencer e a localização não foi concedida
        setShowLocationModal(false);
        if (pendingUberEvent) {
          setSelectedEvent(pendingUberEvent);
          setShowUberFallbackModal(true);
          setPendingUberEvent(null);
        }
      }
    });
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
    <>
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

      <LocationPermissionModal
        isOpen={showLocationModal}
        onClose={() => setShowLocationModal(false)}
        onRequestPermission={requestLocationPermission}
      />

      <UberFallbackModal
        isOpen={showUberFallbackModal}
        onClose={() => setShowUberFallbackModal(false)}
        eventAddress={selectedEvent?.fullAddress || ''}
        onContinueToUber={handleContinueToUber}
      />
    </>
  );
};

export default EventList;
