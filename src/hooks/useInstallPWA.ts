import { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const useInstallPWA = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Detectar iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(isIOSDevice);

    // Detectar se o app já está instalado
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    
    if (!isStandalone) {
      // Capturar evento beforeinstallprompt
      const handler = (e: Event) => {
        e.preventDefault();
        setDeferredPrompt(e as BeforeInstallPromptEvent);
        setIsOpen(true);
      };

      window.addEventListener('beforeinstallprompt', handler);

      return () => window.removeEventListener('beforeinstallprompt', handler);
    }
  }, []);

  const onClose = () => {
    setIsOpen(false);
  };

  const onInstall = async () => {
    if (!deferredPrompt) return;

    try {
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      
      if (choiceResult.outcome === 'accepted') {
        console.log('Usuário aceitou a instalação do PWA');
      }
      
      setDeferredPrompt(null);
      setIsOpen(false);
    } catch (error) {
      console.error('Erro ao instalar PWA:', error);
    }
  };

  return {
    isOpen,
    onClose,
    onInstall,
    isIOS
  };
};

export default useInstallPWA; 