import React from "react";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { Sheet, SheetContent, SheetHeader } from "./ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import {
  ArrowLeft,
  Clock,
  MapPin,
  Linkedin,
  Facebook,
  Instagram
} from "lucide-react";

interface SessionDetailsProps {
  session?: {
    title: string;
    description: string;
    speaker: {
      name: string;
      avatar: string;
      role: string;
      bio: string;
      social: {
        linkedin?: string;
        facebook?: string;
        instagram?: string;
      };
    };
    time: string;
    duration: string;
    track: string;
    location: string;
  };
  onBack: () => void;
}

const SessionDetails = ({
  session = {
    title: "Keynote: O Futuro dos Eventos",
    description:
      "Uma exploração profunda sobre como a tecnologia está transformando a indústria de eventos e o que podemos esperar nos próximos anos. Discutiremos tendências emergentes, casos de uso inovadores e estratégias práticas para se manter à frente no mercado.",
    speaker: {
      name: "João Silva",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
      role: "CEO, EventTech",
      bio: "João Silva é um líder visionário na indústria de eventos com mais de 15 anos de experiência. Ele já liderou a transformação digital de várias empresas do setor.",
      social: {
        linkedin: "https://linkedin.com/in/joaosilva",
      },
    },
    time: "09:00",
    duration: "60 min",
    track: "Principal",
    location: "Auditório Principal",
  },
  onBack,
}: SessionDetailsProps) => {
  return (
    <Sheet open={true} onOpenChange={() => onBack()}>
      <SheetContent side="bottom" className="h-[85vh] sm:h-[90vh] p-0">
        <SheetHeader className="sticky top-0 bg-white border-b p-4 flex-row items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="shrink-0"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Badge className="shrink-0">{session.track}</Badge>
        </SheetHeader>

        <ScrollArea className="h-[calc(100%-4rem)]">
          <div className="p-4 space-y-6">
            {/* Título e Informações Básicas */}
            <div className="space-y-2">
              <h2 className="text-xl font-bold">{session.title}</h2>
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {session.time} • {session.duration}
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {session.location}
                </div>
              </div>
            </div>

            {/* Descrição da Palestra */}
            <div className="space-y-2">
              <h3 className="font-semibold">Sobre a Palestra</h3>
              <p className="text-muted-foreground text-sm">
                {session.description}
              </p>
            </div>

            {/* Informações do Palestrante */}
            <div className="space-y-4">
              <h3 className="font-semibold">Palestrante</h3>
              <div className="flex flex-col sm:flex-row gap-4">
                <Avatar className="h-16 w-16 shrink-0">
                  <AvatarImage src={session.speaker.avatar} />
                  <AvatarFallback>
                    {session.speaker.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <div>
                    <h4 className="font-medium">{session.speaker.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {session.speaker.role}
                    </p>
                  </div>
                  <p className="text-sm">{session.speaker.bio}</p>
                  <div className="flex gap-3">
                    {session.speaker.social?.linkedin && session.speaker.social.linkedin.trim() !== '' && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          window.open(session.speaker.social.linkedin, "_blank")
                        }
                        title="LinkedIn"
                        className="p-1 h-auto"
                      >
                        <img 
                          src="/icons/linkedin.png" 
                          alt="LinkedIn"
                          className="w-6 h-6"
                        />
                      </Button>
                    )}
                    {session.speaker.social?.instagram && session.speaker.social.instagram.trim() !== '' && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          window.open(session.speaker.social.instagram, "_blank")
                        }
                        title="Instagram"
                        className="p-1 h-auto"
                      >
                        <img 
                          src="/icons/instagram.png" 
                          alt="Instagram"
                          className="w-6 h-6"
                        />
                      </Button>
                    )}
                    {session.speaker.social?.facebook && session.speaker.social.facebook.trim() !== '' && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          window.open(session.speaker.social.facebook, "_blank")
                        }
                        title="Facebook"
                        className="p-1 h-auto"
                      >
                        <img 
                          src="/icons/facebook.png" 
                          alt="Facebook"
                          className="w-6 h-6"
                        />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default SessionDetails;
