import React, { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "./ui/sheet";
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
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="bottom" className="h-[90vh] sm:h-[400px]">
        <SheetHeader className="space-y-4">
          <SheetTitle className="flex items-center gap-2">
            <Car className="h-5 w-5 text-primary" />
            Continuar para o Uber
          </SheetTitle>
          <SheetDescription>
            Não foi possível obter sua localização atual. Você ainda pode abrir o Uber, mas precisará inserir seu endereço manualmente.
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col gap-4 py-6">
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

        <SheetFooter className="flex-col gap-2 sm:flex-row sm:justify-end">
          <Button onClick={onContinueToUber} className="w-full sm:w-auto">
            Continuar para o Uber
          </Button>
          <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">
            Cancelar
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default UberFallbackModal; 