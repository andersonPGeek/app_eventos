import React from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "./ui/sheet";
import { Button } from "./ui/button";
import { MapPin } from "lucide-react";

interface LocationPermissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRequestPermission: () => void;
}

const LocationPermissionModal = ({
  isOpen,
  onClose,
  onRequestPermission,
}: LocationPermissionModalProps) => {
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="bottom" className="h-[90vh] sm:h-[450px]">
        <SheetHeader className="space-y-4">
          <SheetTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            Permissão de Localização
          </SheetTitle>
          <SheetDescription>
            Para chamar um Uber, precisamos da sua localização atual. Por favor, permita o acesso à sua localização.
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col gap-4 py-6">
          <div className="text-sm text-gray-600">
            <p className="mb-2">Ao permitir, você poderá:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Chamar um Uber diretamente do aplicativo</li>
              <li>Ver a distância até o local do evento</li>
              <li>Obter direções precisas</li>
            </ul>
          </div>
          
          <div className="text-sm text-gray-500">
            Você pode alterar esta configuração a qualquer momento nas configurações do seu navegador.
          </div>
        </div>

        <SheetFooter className="flex-col gap-2 sm:flex-row sm:justify-end">
          <Button onClick={onRequestPermission} className="w-full sm:w-auto">
            Permitir localização
          </Button>
          <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">
            Agora não
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default LocationPermissionModal; 