import React, { useState } from "react";
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
import PageContainer from "./PageContainer";

interface Track {
  id: string;
  name: string;
  color: string;
}

interface Session {
  id: string;
  title: string;
  description?: string;
  speaker: {
    name: string;
    avatar: string;
    role: string;
    bio?: string;
    social?: {
      twitter?: string;
      linkedin?: string;
      website?: string;
    };
  };
  track: string;
  location: string;
  duration: string;
}

interface TimeSlot {
  time: string;
  sessions: Session[];
}

interface EventScheduleProps {
  tracks?: Track[];
  timeSlots?: TimeSlot[];
  initialDate?: Date;
}

const EventSchedule = ({
  tracks = [
    { id: "1", name: "Principal", color: "bg-blue-500" },
    { id: "2", name: "Workshop", color: "bg-green-500" },
    { id: "3", name: "Lightning Talks", color: "bg-purple-500" },
  ],
  timeSlots = [
    {
      time: "09:00",
      sessions: [
        {
          id: "1",
          title: "Keynote: O Futuro dos Eventos",
          description:
            "Uma exploração profunda sobre como a tecnologia está transformando a indústria de eventos e o que podemos esperar nos próximos anos.",
          speaker: {
            name: "João Silva",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=joao",
            role: "CEO, EventTech",
            bio: "João Silva é um líder visionário na indústria de eventos com mais de 15 anos de experiência.",
            social: {
              twitter: "https://twitter.com/joaosilva",
              linkedin: "https://linkedin.com/in/joaosilva",
              website: "https://joaosilva.com",
            },
          },
          track: "Principal",
          location: "Auditório Principal",
          duration: "60 min",
        },
        {
          id: "2",
          title: "Workshop de Planejamento de Eventos",
          description:
            "Aprenda as melhores práticas para planejar eventos de sucesso.",
          speaker: {
            name: "Maria Santos",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=maria",
            role: "Especialista em Eventos",
            bio: "Maria tem mais de 10 anos de experiência em planejamento de eventos corporativos.",
            social: {
              linkedin: "https://linkedin.com/in/mariasantos",
              website: "https://mariasantos.com",
            },
          },
          track: "Workshop",
          location: "Sala A",
          duration: "45 min",
        },
      ],
    },
    {
      time: "10:00",
      sessions: [
        {
          id: "3",
          title: "Melhores Práticas em Eventos Digitais",
          description:
            "Descubra como criar experiências digitais memoráveis em seus eventos.",
          speaker: {
            name: "Pedro Costa",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=pedro",
            role: "Especialista em Eventos Digitais",
            bio: "Pedro é especialista em transformação digital de eventos.",
            social: {
              twitter: "https://twitter.com/pedrocosta",
              linkedin: "https://linkedin.com/in/pedrocosta",
            },
          },
          track: "Principal",
          location: "Auditório Principal",
          duration: "45 min",
        },
      ],
    },
  ],
  initialDate = new Date(),
}: EventScheduleProps) => {
  const [selectedSession, setSelectedSession] = useState<
    (Session & { time: string }) | null
  >(null);
  const [selectedDate, setSelectedDate] = useState<Date>(initialDate);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTimeSlots = timeSlots.filter((slot) => {
    return slot.sessions.some((session) =>
      session.speaker.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  });

  return (
    <PageContainer>
      <div className="p-4">
        <div className="w-full h-full bg-white p-6 rounded-lg shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
              <h2 className="text-xl font-bold">Agenda do Evento</h2>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full sm:w-auto"
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
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="w-full sm:w-auto">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar palestrante..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 h-9 w-full"
                />
              </div>
            </div>
          </div>

          <Tabs defaultValue={tracks[0].id} className="w-full">
            <TabsList className="mb-4 flex-wrap h-auto gap-2">
              {tracks.map((track) => (
                <TabsTrigger
                  key={track.id}
                  value={track.id}
                  className="flex-1 sm:flex-none"
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${track.color}`} />
                    {track.name}
                  </div>
                </TabsTrigger>
              ))}
            </TabsList>

            {tracks.map((track) => (
              <TabsContent key={track.id} value={track.id}>
                <ScrollArea className="h-[600px] pr-4">
                  {filteredTimeSlots.map((slot, index) => (
                    <div key={index} className="mb-8">
                      <div className="sticky top-0 bg-white z-10 py-2">
                        <h3 className="text-sm font-medium text-muted-foreground">
                          {slot.time}
                        </h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
                        {slot.sessions
                          .filter((session) => session.track === track.name)
                          .map((session) => (
                            <SessionCard
                              key={session.id}
                              title={session.title}
                              speaker={session.speaker}
                              time={slot.time}
                              duration={session.duration}
                              track={session.track}
                              location={session.location}
                              onClick={() =>
                                setSelectedSession({
                                  ...session,
                                  time: slot.time,
                                })
                              }
                            />
                          ))}
                      </div>
                    </div>
                  ))}
                </ScrollArea>
              </TabsContent>
            ))}
          </Tabs>

          {selectedSession && (
            <SessionDetails
              session={selectedSession}
              onBack={() => setSelectedSession(null)}
            />
          )}
        </div>
      </div>
    </PageContainer>
  );
};

export default EventSchedule;
