import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Car, Copy, Check } from "lucide-react";

interface UberFallbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventAddress: string;
  onContinueToUber: () => void;
}

const UberFallbackModal = ({
  isOpen,
  onClose,
  eventAddress,
  onContinueToUber,
}: UberFallbackModalProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(eventAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Erro ao copiar endereço:', err);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Car className="h-5 w-5 text-primary" />
            Continuar para o Uber
          </DialogTitle>
          <DialogDescription>
            Não foi possível obter sua localização atual. Você ainda pode abrir o Uber, mas precisará inserir seu endereço manualmente.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-4">
          <div className="text-sm text-gray-600">
            <p className="mb-2">Endereço do evento:</p>
            <div className="bg-gray-50 p-3 rounded-lg flex items-start justify-between gap-2">
              <p className="text-gray-700">{eventAddress}</p>
              <Button
                variant="ghost"
                size="icon"
                className="shrink-0"
                onClick={handleCopyAddress}
                title="Copiar endereço"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
          
          <div className="text-sm text-gray-500">
            Dica: Copie o endereço acima para facilitar o preenchimento no Uber.
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={onContinueToUber}>
            Abrir Uber
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UberFallbackModal; 