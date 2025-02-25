import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { QrCode, MapPin, Loader2 } from "lucide-react";
import { Badge } from "./ui/badge";

interface CheckInSectionProps {
  isCheckedIn?: boolean;
  userLocation?: { lat: number; lng: number };
  eventLocation?: { lat: number; lng: number };
  onCheckIn?: () => void;
}

const CheckInSection = ({
  isCheckedIn = false,
  userLocation = { lat: 40.7128, lng: -74.006 },
  eventLocation = { lat: -23.5505, lng: -46.6333 }, // São Paulo coordinates
  onCheckIn = () => {},
}: CheckInSectionProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("location");

  const handleLocationCheckIn = () => {
    setIsLoading(true);
    // Simulate check-in process
    setTimeout(() => {
      onCheckIn();
      setIsLoading(false);
    }, 1500);
  };

  return (
    <Card className="w-full max-w-[400px] h-[300px] bg-white mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Check-In
          {isCheckedIn && (
            <Badge variant="default" className="bg-green-500 text-white">
              Checked In
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="location" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger
              value="location"
              onClick={() => setActiveTab("location")}
            >
              <MapPin className="w-4 h-4 mr-2" />
              Location
            </TabsTrigger>
            <TabsTrigger value="qr" onClick={() => setActiveTab("qr")}>
              <QrCode className="w-4 h-4 mr-2" />
              QR Code
            </TabsTrigger>
          </TabsList>

          <TabsContent value="location" className="mt-4">
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Faça check-in verificando sua localização no local do evento
              </p>
              <div className="flex justify-center">
                <Button
                  onClick={handleLocationCheckIn}
                  disabled={isLoading || isCheckedIn}
                  className="w-full"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Verificando Localização
                    </>
                  ) : (
                    "Check-in por Localização"
                  )}
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="qr" className="mt-4">
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Scan the QR code at the event entrance to check in
              </p>
              <div className="flex justify-center">
                <div className="w-48 h-48 border-2 border-dashed rounded-lg flex items-center justify-center">
                  <QrCode className="w-24 h-24 text-muted-foreground" />
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default CheckInSection;
