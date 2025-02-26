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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import PageContainer from "./PageContainer";

interface Track {
  id: string;
  name: string;
  color: string;
}

interface Stage {
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
  stage: string;
  location: string;
  duration: string;
}

interface TimeSlot {
  time: string;
  sessions: Session[];
}

interface EventScheduleProps {
  stages?: Stage[];
  tracks?: Track[];
  timeSlots?: TimeSlot[];
  initialDate?: Date;
}

const EventSchedule = ({
  stages = [
    { id: "1", name: "Palco Principal", color: "bg-blue-500" },
    { id: "2", name: "Palco 2", color: "bg-green-500" },
    { id: "3", name: "Palco 3", color: "bg-purple-500" },
  ],
  tracks = [
    { id: "1", name: "Desenvolvimento", color: "bg-orange-500" },
    { id: "2", name: "Design", color: "bg-pink-500" },
    { id: "3", name: "Negócios", color: "bg-cyan-500" },
  ],
  timeSlots = [
    {
      time: "09:00",
      sessions: [
        {
          id: "1",
          title: "Keynote: O Futuro dos Eventos",
          description:
            "Uma exploração profunda sobre como a tecnologia está transformando a indústria de eventos.",
          speaker: {
            name: "João Silva",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=joao",
            role: "CEO, EventTech",
            bio: "João Silva é um líder visionário na indústria de eventos.",
            social: {
              twitter: "https://twitter.com/joaosilva",
              linkedin: "https://linkedin.com/in/joaosilva",
              website: "https://joaosilva.com",
            },
          },
          track: "Desenvolvimento",
          stage: "Palco Principal",
          location: "Auditório Principal",
          duration: "60 min",
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
  const [selectedTrack, setSelectedTrack] = useState(tracks[0].id);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const filteredTimeSlots = timeSlots.filter((slot) => {
    return slot.sessions.some((session) =>
      session.speaker.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  });

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

            <div
              className={`space-y-4 ${isFiltersOpen ? "block" : "hidden"} md:block`}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

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
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-2 h-2 rounded-full ${track.color}`}
                            />
                            {track.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          <Tabs defaultValue={stages[0].id} className="w-full">
            <TabsList className="mb-4 flex-wrap h-auto gap-2">
              {stages.map((stage) => (
                <TabsTrigger
                  key={stage.id}
                  value={stage.id}
                  className="flex-1 sm:flex-none"
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${stage.color}`} />
                    {stage.name}
                  </div>
                </TabsTrigger>
              ))}
            </TabsList>

            {stages.map((stage) => (
              <TabsContent key={stage.id} value={stage.id}>
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
                          .filter(
                            (session) =>
                              session.stage === stage.name &&
                              session.track ===
                                tracks.find((t) => t.id === selectedTrack)
                                  ?.name,
                          )
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
