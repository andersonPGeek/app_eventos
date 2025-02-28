import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Check, Camera } from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Html5Qrcode } from "html5-qrcode";
import { useAuth } from "../contexts/AuthContext";
import { API_ENDPOINTS } from "../config/api";

interface CheckInSectionProps {
  eventId: string;
}

const CheckInSection = ({ eventId }: CheckInSectionProps) => {
  const [hasCheckedIn, setHasCheckedIn] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const { userId } = useAuth();
  const scannerId = 'qr-reader';

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
    let html5QrCode: Html5Qrcode | null = null;

    const initializeScanner = async () => {
      if (isScanning && !hasCheckedIn) {
        try {
          console.log('Iniciando scanner...');
          
          // Criar instância do scanner
          html5QrCode = new Html5Qrcode(scannerId);
          
          // Listar câmeras disponíveis
          const devices = await Html5Qrcode.getCameras();
          console.log('Câmeras disponíveis:', devices);
          
          if (devices && devices.length > 0) {
            const cameraId = devices[0].id;
            console.log('Usando câmera:', cameraId);
            
            // Iniciar scanner
            await html5QrCode.start(
              cameraId,
              {
                fps: 10,
                qrbox: { width: 250, height: 250 },
              },
              onScanSuccess,
              onScanError
            );
            
            console.log('Scanner iniciado com sucesso');
            setIsCameraReady(true);
            setError(null);
          } else {
            throw new Error('Nenhuma câmera encontrada');
          }
        } catch (err) {
          console.error('Erro ao inicializar scanner:', err);
          setError('Erro ao acessar a câmera. Por favor, verifique as permissões e tente novamente.');
          setIsScanning(false);
        }
      }
    };

    initializeScanner();

    return () => {
      if (html5QrCode) {
        console.log('Limpando scanner...');
        html5QrCode.stop().catch(error => {
          console.error('Erro ao limpar scanner:', error);
        });
      }
    };
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

  const startScanning = async () => {
    try {
      // Verificar permissão da câmera antes de iniciar
      const permissionResult = await navigator.permissions.query({ name: 'camera' as PermissionName });
      console.log('Status da permissão da câmera:', permissionResult.state);
      
      if (permissionResult.state === 'denied') {
        throw new Error('Permissão da câmera negada. Por favor, habilite o acesso à câmera nas configurações do seu navegador.');
      }
      
      setError(null);
      setIsScanning(true);
      setIsCameraReady(false);
    } catch (err) {
      console.error('Erro ao verificar permissão da câmera:', err);
      setError('Erro ao acessar a câmera. Por favor, verifique as permissões.');
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
            <p className="text-sm text-gray-500 mt-2">Você já está registrado neste evento.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-center mb-4">
              <p className="text-sm text-gray-600">
                {isScanning 
                  ? "Aponte a câmera para o QR Code do evento"
                  : "Clique no botão abaixo para iniciar o scanner"}
              </p>
            </div>
            
            {!isScanning ? (
              <Button 
                onClick={startScanning}
                className="w-full flex items-center justify-center gap-2"
              >
                <Camera className="w-4 h-4" />
                Iniciar Scanner QR Code
              </Button>
            ) : (
              <div className="space-y-4">
                <div id={scannerId} className="relative">
                  {!isCameraReady && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg min-h-[250px]">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-2"></div>
                        <p className="text-sm text-gray-600">Iniciando câmera...</p>
                      </div>
                    </div>
                  )}
                </div>
                <Button 
                  onClick={() => setIsScanning(false)}
                  variant="outline"
                  className="w-full"
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
