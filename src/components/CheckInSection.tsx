import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Check, Camera } from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Html5QrcodeScanner } from "html5-qrcode";
import { useAuth } from "../contexts/AuthContext";
import { API_ENDPOINTS } from "../config/api";

interface CheckInSectionProps {
  eventId: string;
}

const CheckInSection = ({ eventId }: CheckInSectionProps) => {
  const [hasCheckedIn, setHasCheckedIn] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const { userId } = useAuth();
  const scannerId = 'html5-qr-scanner';

  useEffect(() => {
    // Verificar se o usuário já fez check-in
    const checkStatus = async () => {
      try {
        const response = await fetch(`${API_ENDPOINTS.checkins}/status/${eventId}/${userId}`);
        const data = await response.json();
        setHasCheckedIn(data.hasCheckedIn);
      } catch (err) {
        console.error('Erro ao verificar status do check-in:', err);
      }
    };
    
    if (userId) {
      checkStatus();
    }
  }, [eventId, userId]);

  useEffect(() => {
    if (isScanning && !hasCheckedIn) {
      const scanner = new Html5QrcodeScanner(
        scannerId,
        { 
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0
        },
        false
      );

      scanner.render(onScanSuccess, onScanError);

      return () => {
        scanner.clear().catch(error => {
          console.error('Erro ao limpar scanner:', error);
        });
      };
    }
  }, [isScanning, hasCheckedIn]);

  const onScanSuccess = async (decodedText: string) => {
    console.log('QR Code detectado:', decodedText);
    
    try {
      // Verifica se o QR code contém a URL esperada
      if (!decodedText.includes('/api/checkins')) {
        setError('QR Code inválido. Por favor, tente novamente.');
        return;
      }

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
        setIsScanning(false);
      } else {
        throw new Error('Falha ao realizar check-in');
      }
    } catch (err: any) {
      console.error('Erro ao realizar check-in:', err);
      setError(err.message || 'Erro ao realizar check-in');
    }
  };

  const onScanError = (error: any) => {
    console.error('Erro na leitura do QR Code:', error);
  };

  const startScanning = () => {
    setIsScanning(true);
    setError(null);
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
            <p className="text-sm text-gray-500 mt-2">Você já está registrado neste evento.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-center mb-4">
              <p className="text-sm text-gray-600">
                Aponte a câmera para o QR Code do evento para realizar o check-in
              </p>
            </div>
            
            {!isScanning ? (
              <Button onClick={startScanning}>
                Iniciar Scanner QR Code
              </Button>
            ) : (
              <div>
                <div id={scannerId} />
                <Button 
                  onClick={() => setIsScanning(false)}
                  variant="outline"
                  className="mt-4"
                >
                  Cancelar Scanner
                </Button>
              </div>
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
