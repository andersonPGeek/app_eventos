import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Check, Camera } from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { useAuth } from "../contexts/AuthContext";
import { API_ENDPOINTS } from "../config/api";

interface CheckInSectionProps {
  eventId?: string;
}

const CheckInSection = ({ eventId }: CheckInSectionProps) => {
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { userId } = useAuth();

  // Verifica se o usuário já fez check-in neste evento
  useEffect(() => {
    const checkStatus = async () => {
      if (!userId || !eventId) return;
      
      try {
        const response = await fetch(`${API_ENDPOINTS.checkins}/status/${eventId}/${userId}`);
        if (response.ok) {
          const data = await response.json();
          setIsCheckedIn(data.checkedIn);
        }
      } catch (error) {
        console.error('Erro ao verificar status do check-in:', error);
      }
    };

    checkStatus();
  }, [userId, eventId]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraActive(true);
        setError(null);
      }
    } catch (err) {
      console.error('Erro ao acessar a câmera:', err);
      setError('Não foi possível acessar a câmera. Verifique as permissões.');
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsCameraActive(false);
    }
  };

  const handleCheckIn = async () => {
    if (!userId || !eventId) {
      setError('Informações de usuário ou evento não disponíveis');
      return;
    }

    try {
      const response = await fetch(API_ENDPOINTS.checkins, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ID_usuario: userId,
          ID_evento: eventId
        }),
      });

      if (response.ok) {
        setIsCheckedIn(true);
        setError(null);
        stopCamera();
      } else {
        throw new Error('Falha ao realizar check-in');
      }
    } catch (error) {
      console.error('Erro ao realizar check-in:', error);
      setError('Não foi possível realizar o check-in. Tente novamente.');
    }
  };

  // Limpa a câmera quando o componente é desmontado
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <Card className="w-full max-w-[400px] bg-white mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Check-in
          {isCheckedIn && (
            <Badge variant="default" className="bg-green-500 text-white">
              <Check className="w-4 h-4 mr-1" />
              Check-in Realizado
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isCheckedIn ? (
          <div className="text-center p-6">
            <Check className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <p className="text-lg font-medium text-green-700">Check-in realizado com sucesso!</p>
            <p className="text-sm text-gray-500 mt-2">Você já está registrado neste evento.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-center mb-4">
              <p className="text-sm text-gray-600">
                {isCameraActive 
                  ? "Aponte a câmera para o QR Code do evento"
                  : "Clique no botão abaixo para iniciar a câmera"}
              </p>
            </div>
            
            {isCameraActive ? (
              <div className="relative aspect-square max-w-[300px] mx-auto overflow-hidden rounded-lg">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <Button 
                onClick={startCamera}
                className="w-full"
              >
                <Camera className="w-4 h-4 mr-2" />
                Iniciar Câmera
              </Button>
            )}

            {error && (
              <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded">
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
