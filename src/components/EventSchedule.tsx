import React, { useState } from "react";
import { ScrollArea } from "./ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import SessionCard from "./SessionCard";
import SessionDetails from "./SessionDetails";
import { Button } from "./ui/button";
import { Calendar, Filter } from "lucide-react";

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
  selectedDate?: Date;
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
  selectedDate = new Date(),
}: EventScheduleProps) => {
  const [selectedSession, setSelectedSession] = useState<
    (Session & { time: string }) | null
  >(null);

  return (
    <div className="w-full h-full bg-white p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <h2 className="text-xl md:text-2xl font-bold">Agenda do Evento</h2>
          <Button variant="outline" size="sm">
            <Calendar className="w-4 h-4 mr-2" />
            {selectedDate.toLocaleDateString("pt-BR")}
          </Button>
        </div>
        <Button variant="outline" size="sm">
          <Filter className="w-4 h-4 mr-2" />
          Filtrar
        </Button>
      </div>

      <Tabs defaultValue={tracks[0].id} className="w-full">
        <TabsList className="mb-4">
          {tracks.map((track) => (
            <TabsTrigger key={track.id} value={track.id}>
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
              {timeSlots.map((slot, index) => (
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
                            setSelectedSession({ ...session, time: slot.time })
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
  );
};

export default EventSchedule;
