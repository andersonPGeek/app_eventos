import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";

interface InstallPWAModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInstall: () => void;
  isIOS: boolean;
}

const InstallPWAModal = ({ isOpen, onClose, onInstall, isIOS }: InstallPWAModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center gap-4">
            <img
              src="/icons/icon-72x72.jpg"
              alt="App Icon"
              className="w-12 h-12 rounded-xl"
            />
            <DialogTitle>Instalar Sublime</DialogTitle>
          </div>
        </DialogHeader>

        {isIOS ? (
          <DialogDescription className="space-y-4">
            <p>Para instalar o Sublime no seu iPhone:</p>
            <ol className="list-decimal pl-4 space-y-2">
              <li>Toque no botão compartilhar no Safari</li>
              <li>Role para baixo e toque em "Adicionar à Tela de Início"</li>
              <li>Toque em "Adicionar" para confirmar</li>
            </ol>
          </DialogDescription>
        ) : (
          <DialogDescription>
            Instale o Sublime para ter acesso rápido e uma experiência otimizada.
          </DialogDescription>
        )}

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={onClose}>
            Agora não
          </Button>
          {!isIOS && (
            <Button onClick={onInstall}>
              Instalar
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default InstallPWAModal; 