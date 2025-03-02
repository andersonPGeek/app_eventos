import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "./ui/dialog";
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            Permissão de Localização
          </DialogTitle>
          <DialogDescription>
            Para chamar um Uber, precisamos da sua localização atual. Por favor, permita o acesso à sua localização.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-4">
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

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={onClose}>
            Agora não
          </Button>
          <Button onClick={onRequestPermission}>
            Permitir localização
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LocationPermissionModal; 