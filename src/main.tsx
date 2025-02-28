import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";

import { TempoDevtools } from "tempo-devtools";
TempoDevtools.init();

const basename = import.meta.env.BASE_URL;

declare global {
  interface ServiceWorkerRegistration {
    readonly sync?: SyncManager;
  }

  interface SyncManager {
    register(tag: string): Promise<void>;
  }
}


ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter basename={basename}>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);

if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/sw.js")
    .then(() => console.log("Service Worker registrado!"))
    .catch((err) => console.log("Erro ao registrar SW:", err));
}

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
    .then((registration) => {
      console.log('Service Worker registrado com sucesso!', registration);

      // 🔹 Verifica se a API de Background Sync está disponível
      if ('sync' in registration && registration.sync) {
        (registration.sync as SyncManager).register('sync-data')
          .then(() => console.log('Sincronização em segundo plano registrada.'))
          .catch((err) => console.warn('Erro ao registrar sincronização:', err));
      } else {
        console.warn('Background Sync não suportado.');
      }

      // 🔹 Verifica se a API de Periodic Sync está disponível
      if ('periodicSync' in registration && (registration as any).periodicSync) {
        (registration as any).periodicSync.register('content-sync', {
          minInterval: 24 * 60 * 60 * 1000 // 1 dia
        }).then(() => {
          console.log('Sincronização periódica registrada.');
        }).catch((err) => {
          console.warn('Erro ao registrar sincronização periódica:', err);
        });
      } else {
        console.warn('Periodic Background Sync não suportado.');
      }

    })
    .catch((error) => {
      console.error('Falha ao registrar o Service Worker:', error);
    });
}

// 🔹 Solicitar permissão para notificações push
if ('Notification' in window) {
  Notification.requestPermission().then((permission) => {
    if (permission === 'granted') {
      console.log("Permissão concedida para notificações!");
    }
  });
}


Notification.requestPermission().then((permission) => {
  if (permission === 'granted') {
    console.log("Permissão concedida para notificações!");
  }
});
