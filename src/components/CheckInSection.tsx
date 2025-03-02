import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Check, MapPin } from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useAuth } from "../contexts/AuthContext";
import { API_ENDPOINTS } from "../config/api";

interface CheckInSectionProps {
  eventId: string;
  isCheckedIn?: boolean;
}

interface EventLocation {
  latitude: number;
  longitude: number;
  cidade: string;
  bairro: string;
  logradouro: string;
  numero: string;
}

interface CheckInData {
  id: string;
  ID_evento: string;
  ID_usuario: string;
  dataCheckin: {
    _seconds: number;
    _nanoseconds: number;
  };
}

const CheckInSection: React.FC<CheckInSectionProps> = ({ eventId, isCheckedIn }) => {
  const [hasCheckedIn, setHasCheckedIn] = useState(false);
  const [checkInDate, setCheckInDate] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [eventLocation, setEventLocation] = useState<EventLocation | null>(null);
  const { userId } = useAuth();
  const [showManualVerification, setShowManualVerification] = useState(false);
  const [verificationCode, setVerificationCode] = useState(['', '', '', '']);
  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  // Função para calcular a distância entre dois pontos usando a fórmula de Haversine
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371e3; // Raio da Terra em metros
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distância em metros
  };

  // Buscar dados do evento
  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const response = await fetch(`${API_ENDPOINTS.eventos}/${eventId}`);
        const data = await response.json();
        setEventLocation({
          latitude: data.latitude,
          longitude: data.longitude,
          cidade: data.cidade,
          bairro: data.bairro,
          logradouro: data.logradouro,
          numero: data.numero
        });
      } catch (err) {
        console.error('Erro ao buscar dados do evento:', err);
        setError('Não foi possível carregar os dados do evento.');
      }
    };

    fetchEventData();
  }, [eventId]);

  // Verificar se já existe check-in
  useEffect(() => {
    const fetchCheckIns = async () => {
      try {
        const response = await fetch(API_ENDPOINTS.checkins);
        const checkIns: CheckInData[] = await response.json();
        
        const existingCheckIn = checkIns.find(
          checkIn => checkIn.ID_evento === eventId && checkIn.ID_usuario === userId
        );

        if (existingCheckIn) {
          setHasCheckedIn(true);
          const date = new Date(
            existingCheckIn.dataCheckin._seconds * 1000 +
            existingCheckIn.dataCheckin._nanoseconds / 1000000
          );
          setCheckInDate(date);
        }
      } catch (err) {
        console.error('Erro ao verificar check-ins:', err);
        setError('Não foi possível verificar o status do check-in.');
      }
    };

    if (userId && eventId) {
      fetchCheckIns();
    }
  }, [userId, eventId]);

  const handleCodeChange = (index: number, value: string) => {
    if (value.length > 1) return; // Aceita apenas um dígito
    if (!/^\d*$/.test(value)) return; // Aceita apenas números

    const newCode = [...verificationCode];
    newCode[index] = value;
    setVerificationCode(newCode);

    // Move para o próximo input se houver um valor
    if (value && index < 3) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !verificationCode[index] && index > 0) {
      // Move para o input anterior ao pressionar backspace em um campo vazio
      inputRefs[index - 1].current?.focus();
    }
  };

  const validateManualCode = () => {
    const expectedCode = ['1', '3', '0', '4'];
    return verificationCode.every((digit, index) => digit === expectedCode[index]);
  };

  const handleCheckIn = async () => {
    setLoading(true);
    setError(null);

    try {
      if (showManualVerification) {
        if (!validateManualCode()) {
          setError('Código de verificação inválido');
          return;
        }
      } else {
        // Obter localização atual
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
          });
        });

        if (!eventLocation) {
          throw new Error('Dados do evento não disponíveis');
        }

        const distance = calculateDistance(
          position.coords.latitude,
          position.coords.longitude,
          eventLocation.latitude,
          eventLocation.longitude
        );

        if (distance > 10) {
          setShowManualVerification(true);
          setError(null);
          return;
        }
      }

      // Realizar check-in
      const response = await fetch(API_ENDPOINTS.checkins, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ID_usuario: userId,
          ID_evento: eventId
        })
      });

      if (response.ok) {
        setHasCheckedIn(true);
        setError(null);
      } else {
        throw new Error('Falha ao realizar check-in');
      }
    } catch (err: any) {
      console.error('Erro:', err);
      if (err.code === 1 || err.code === 2) {
        setShowManualVerification(true);
        setError(null);
      } else {
        setError('Erro ao realizar check-in');
        setShowManualVerification(true);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-[400px] bg-white mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Check-in
          {hasCheckedIn && (
            <Badge variant="default" className="bg-green-500 text-white">
              <Check className="w-4 h-4 mr-1" />
              Check-in Realizado
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {hasCheckedIn ? (
          <div className="text-center p-6">
            <Check className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <p className="text-lg font-medium text-green-700">Check-in realizado com sucesso!</p>
            {checkInDate && (
              <p className="text-sm text-gray-500 mt-2">
                Realizado em: {checkInDate.toLocaleDateString('pt-BR')} às {checkInDate.toLocaleTimeString('pt-BR')}
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-center mb-4">
              <p className="text-sm text-gray-600">
                {showManualVerification 
                  ? "Digite o código de verificação fornecido no local"
                  : "Para realizar o check-in, você precisa estar no local do evento"}
              </p>
              {eventLocation && !showManualVerification && (
                <p className="text-xs text-gray-500 mt-2">
                  {eventLocation.logradouro}, {eventLocation.numero} - {eventLocation.bairro}, {eventLocation.cidade}
                </p>
              )}
            </div>

            {showManualVerification ? (
              <div className="space-y-4">
                <div className="flex justify-center gap-2">
                  {verificationCode.map((digit, index) => (
                    <Input
                      key={index}
                      ref={inputRefs[index]}
                      type="text"
                      value={digit}
                      onChange={(e) => handleCodeChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      className="w-12 h-12 text-center text-lg font-bold"
                      maxLength={1}
                    />
                  ))}
                </div>
                <Button 
                  onClick={handleCheckIn}
                  className="w-full"
                  disabled={loading || verificationCode.some(digit => !digit)}
                >
                  {loading ? "Verificando..." : "Verificar Código"}
                </Button>
              </div>
            ) : (
              <Button 
                onClick={handleCheckIn}
                className="w-full flex items-center justify-center gap-2"
                disabled={loading || !eventLocation}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Verificando localização...
                  </div>
                ) : (
                  <>
                    <MapPin className="w-4 h-4" />
                    Realizar Check-in
                  </>
                )}
              </Button>
            )}

            {error && !showManualVerification && (
              <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded whitespace-pre-line">
                {error}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CheckInSection;
