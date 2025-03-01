import React, { useState, useEffect } from "react";
import { ScrollArea } from "./ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import SessionCard from "./SessionCard";
import SessionDetails from "./SessionDetails";
import { Button } from "./ui/button";
import { Calendar as CalendarIcon, Filter, Search } from "lucide-react";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Input } from "./ui/input";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import PageContainer from "./PageContainer";
import { API_ENDPOINTS } from "../config/api";

interface Track {
  id: string;
  nome: string;
}

interface Stage {
  id: string;
  nome: string;
}

interface FirestoreTimestamp {
  _seconds: number;
  _nanoseconds: number;
}

interface Lecture {
  hora: FirestoreTimestamp;
  nomePalco: string;
  nomeTrilha: string;
  titulo_palestra: string;
  duracao: number;
  descricao_palestra: string;
  nome_palestrante: string;
  cargo_palestrante: string;
  empresa_palestrante: string;
  local: string;
  foto_palestrante: string;
  minibio_palestrante: string;
  linkedin_palestrante: string;
  instagram_palestrante: string;
  facebook_palestrante: string;
}

interface Session {
  id: string;
  title: string;
  description: string;
  speaker: {
    name: string;
    avatar: string;
    role: string;
    bio: string;
    social: {
      linkedin?: string;
      instagram?: string;
      facebook?: string;
    };
  };
  track: string;
  stage: string;
  location: string;
  duration: string;
  time?: string;
}

interface EventScheduleProps {
  eventId: string;
}

interface EventDates {
  dataInicio: FirestoreTimestamp;
  dataFim: FirestoreTimestamp;
}

const EventSchedule = ({ eventId }: EventScheduleProps) => {
  const [stages, setStages] = useState<Stage[]>([]);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [eventDates, setEventDates] = useState<EventDates | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTrack, setSelectedTrack] = useState<string>("");
  const [selectedStage, setSelectedStage] = useState<string>("");
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [isLoadingInitial, setIsLoadingInitial] = useState(true);
  const [isLoadingLectures, setIsLoadingLectures] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);

  const formatFirestoreDate = (timestamp: FirestoreTimestamp) => {
    try {
      const date = new Date(timestamp._seconds * 1000);
      return date.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit"
      });
    } catch (error) {
      console.error('Erro ao formatar data:', error);
      return 'Horário não disponível';
    }
  };

  // Buscar dados do evento incluindo as datas
  useEffect(() => {
    const fetchEventData = async () => {
      try {
        setIsLoadingInitial(true);
        
        // Buscar dados do evento (datas)
        const eventResponse = await fetch(`${API_ENDPOINTS.eventos}/${eventId}`);
        if (!eventResponse.ok) {
          throw new Error('Falha ao buscar dados do evento');
        }
        const eventData = await eventResponse.json();
        
        if (eventData.dataInicio && eventData.dataFim) {
          setEventDates({
            dataInicio: eventData.dataInicio,
            dataFim: eventData.dataFim
          });
          setSelectedDate(new Date(eventData.dataInicio._seconds * 1000));
        }

        // Buscar dados da agenda (trilhas e palcos)
        const agendaResponse = await fetch(`${API_ENDPOINTS.agenda}/${eventId}`);
        if (!agendaResponse.ok) {
          throw new Error('Falha ao buscar dados da agenda');
        }
        const agendaData = await agendaResponse.json();
        
        setTracks(agendaData.trilhas || []);
        setStages(agendaData.palcos || []);
        
        if (agendaData.trilhas?.length > 0) {
          setSelectedTrack(agendaData.trilhas[0].id);
        }
        if (agendaData.palcos?.length > 0) {
          setSelectedStage(agendaData.palcos[0].id);
        }
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
        setError(error instanceof Error ? error.message : 'Erro desconhecido');
      } finally {
        setIsLoadingInitial(false);
      }
    };

    if (eventId) {
      fetchEventData();
    } else {
      setError('ID do evento não fornecido');
      setIsLoadingInitial(false);
    }
  }, [eventId]);

  // Buscar detalhes das palestras quando trilha ou palco são selecionados
  useEffect(() => {
    console.log('EventSchedule - Verificando condições para buscar palestras:', {
      eventId,
      selectedTrack,
      selectedStage
    });

    if (!eventId || !selectedTrack || !selectedStage) {
      console.log('EventSchedule - Faltam parâmetros para buscar palestras');
      return;
    }

    const fetchLectureDetails = async () => {
      console.log('EventSchedule - Iniciando busca de palestras');
      try {
        setIsLoadingLectures(true);
        const url = `${API_ENDPOINTS.palestras}/${eventId}/${selectedStage}/${selectedTrack}`;
        console.log('EventSchedule - Fazendo requisição para:', url);
        
        const response = await fetch(url);
        console.log('EventSchedule - Status da resposta de palestras:', response.status);
        
        if (response.status === 404) {
          console.log('EventSchedule - Nenhuma palestra encontrada para os filtros selecionados');
          setSessions([]);
          return;
        }
        
        if (!response.ok) {
          throw new Error(`Erro ao buscar detalhes das palestras: ${response.status}`);
        }
        const data = await response.json();
        console.log('EventSchedule - Palestras recebidas:', data.palestras?.length || 0);

        // Mapear palestras para o formato Session
        console.log('EventSchedule - Iniciando mapeamento das palestras');
        const formattedSessions = data.palestras?.map((lecture: Lecture) => {
          console.log('Dados do palestrante:', {
            nome: lecture.nome_palestrante,
            instagram: lecture.instagram_palestrante,
            linkedin: lecture.linkedin_palestrante,
            facebook: lecture.facebook_palestrante,
          });
          
          return {
            id: Math.random().toString(36).substr(2, 9),
            title: lecture.titulo_palestra,
            description: lecture.descricao_palestra,
            speaker: {
              name: lecture.nome_palestrante,
              avatar: lecture.foto_palestrante,
              role: `${lecture.cargo_palestrante} @ ${lecture.empresa_palestrante}`,
              bio: lecture.minibio_palestrante,
              social: {
                linkedin: lecture.linkedin_palestrante || null,
                instagram: lecture.instagram_palestrante || null,
                facebook: lecture.facebook_palestrante || null
              }
            },
            track: lecture.nomeTrilha,
            stage: lecture.nomePalco,
            location: lecture.local,
            duration: `${lecture.duracao} min`,
            time: formatFirestoreDate(lecture.hora)
          };
        }) || [];
        console.log('Sessões formatadas:', formattedSessions);

        setSessions(formattedSessions);
      } catch (error) {
        console.error('EventSchedule - Erro ao buscar detalhes das palestras:', error);
        setError(error instanceof Error ? error.message : 'Erro desconhecido');
      } finally {
        setIsLoadingLectures(false);
        console.log('EventSchedule - Finalizada busca de palestras');
      }
    };

    fetchLectureDetails();
  }, [eventId, selectedTrack, selectedStage]);

  const LoadingSpinner = ({ message }: { message: string }) => (
    <div className="flex items-center justify-center h-full min-h-[400px]">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mb-4"></div>
        <p className="text-gray-600">{message}</p>
      </div>
    </div>
  );

  if (isLoadingInitial) {
    return <LoadingSpinner message="Carregando dados do evento..." />;
  }

  if (error) {
    return <div className="text-red-500 p-4">Erro: {error}</div>;
  }

  // Primeiro filtrar as sessões pelo nome do palestrante
  const filteredSessions = sessions.filter((session) =>
    session.speaker.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Depois agrupar as sessões filtradas por horário
  const timeSlots = filteredSessions.reduce((acc: { time: string; sessions: Session[] }[], session) => {
    const existingSlot = acc.find(slot => slot.time === session.time);
    if (existingSlot) {
      existingSlot.sessions.push(session);
    } else {
      acc.push({ time: session.time || '', sessions: [session] });
    }
    return acc;
  }, []).sort((a, b) => a.time.localeCompare(b.time));

  return (
    <PageContainer>
      <div className="p-4">
        <div className="w-full h-full bg-white p-6 rounded-lg shadow-sm">
          <div className="flex flex-col gap-4 mb-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Agenda do Evento</h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                className="md:hidden"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filtros
              </Button>
            </div>

            <div className={`space-y-4 ${isFiltersOpen ? "block" : "hidden"} md:block`}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {eventDates?.dataInicio && eventDates?.dataFim && 
                  new Date(eventDates.dataInicio._seconds * 1000).getTime() !== 
                  new Date(eventDates.dataFim._seconds * 1000).getTime() && (
                  <div>
                    <label className="text-sm font-medium mb-1 block">Data</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full justify-start"
                        >
                          <CalendarIcon className="w-4 h-4 mr-2" />
                          {format(selectedDate, "d MMM yyyy", { locale: ptBR })}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={(date) => date && setSelectedDate(date)}
                          disabled={(date) => {
                            if (!eventDates?.dataInicio || !eventDates?.dataFim) return true;
                            const start = new Date(eventDates.dataInicio._seconds * 1000);
                            const end = new Date(eventDates.dataFim._seconds * 1000);
                            return date < start || date > end;
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                )}

                <div>
                  <label className="text-sm font-medium mb-1 block">
                    Palestrante
                  </label>
                  <div className="relative">
                    <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar palestrante..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-8 h-9"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">
                    Trilha
                  </label>
                  <Select
                    value={selectedTrack}
                    onValueChange={setSelectedTrack}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione a trilha" />
                    </SelectTrigger>
                    <SelectContent>
                      {tracks.map((track) => (
                        <SelectItem key={track.id} value={track.id}>
                          {track.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          <Tabs value={selectedStage} onValueChange={setSelectedStage} className="w-full">
            <TabsList className="mb-4 flex-wrap h-auto gap-2">
              {stages.map((stage) => (
                <TabsTrigger
                  key={stage.id}
                  value={stage.id}
                  className="flex-1 sm:flex-none"
                >
                  {stage.nome}
                </TabsTrigger>
              ))}
            </TabsList>

            {stages.map((stage) => (
              <TabsContent key={stage.id} value={stage.id}>
                <ScrollArea className="h-[600px] pr-4">
                  {(() => {
                    if (isLoadingLectures) {
                      return <LoadingSpinner message="Carregando palestras..." />;
                    }

                    if (timeSlots.length === 0) {
                      return (
                        <div className="flex items-center justify-center h-full">
                          <p className="text-gray-500 text-center">
                            Não há palestras cadastradas para os filtros selecionados
                          </p>
                        </div>
                      );
                    }

                    return timeSlots.map((slot, index) => (
                      <div key={index} className="mb-8">
                        <div className="sticky top-0 bg-white z-10 py-2">
                          <h3 className="text-lg font-semibold text-primary">
                            {slot.time}
                          </h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
                          {slot.sessions
                            .filter((session) => session.stage === stage.nome)
                            .map((session) => (
                              <SessionCard
                                key={session.id}
                                title={session.title}
                                speaker={session.speaker}
                                time={slot.time}
                                duration={session.duration}
                                track={session.track}
                                stage={session.stage}
                                location={session.location}
                                onClick={() => setSelectedSession(session)}
                              />
                            ))}
                        </div>
                      </div>
                    ));
                  })()}
                </ScrollArea>
              </TabsContent>
            ))}
          </Tabs>

          {selectedSession && (
            <SessionDetails
              session={{
                title: selectedSession.title,
                description: selectedSession.description || '',
                speaker: {
                  name: selectedSession.speaker.name,
                  avatar: selectedSession.speaker.avatar,
                  role: selectedSession.speaker.role,
                  bio: selectedSession.speaker.bio || '',
                  social: {
                    linkedin: selectedSession.speaker.social?.linkedin || null,
                    facebook: selectedSession.speaker.social?.facebook || null,
                    instagram: selectedSession.speaker.social?.instagram || null
                  }
                },
                time: selectedSession.time || '',
                duration: selectedSession.duration,
                track: selectedSession.track,
                location: selectedSession.location
              }}
              onBack={() => setSelectedSession(null)}
            />
          )}
        </div>
      </div>
    </PageContainer>
  );
};

export default EventSchedule;
