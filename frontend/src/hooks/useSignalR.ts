import { useEffect } from "react";
import * as signalR from "@microsoft/signalr";
import type { VagaAtualizadaEvent, StatusGeralEvent } from "../types";

const HUB_URL = "http://76.13.225.52:5002/hubs/estacionamento";

// Singleton para garantir uma única conexão
let connection: signalR.HubConnection | null = null;
let isStarting = false;
let listeners: {
  onVagaAtualizada?: (event: VagaAtualizadaEvent) => void;
  onStatusGeral?: (event: StatusGeralEvent) => void;
}[] = [];

const startConnection = async () => {
  if (isStarting || connection) return;
  isStarting = true;

  connection = new signalR.HubConnectionBuilder()
    .withUrl(HUB_URL, {
      skipNegotiation: true,
      transport: signalR.HttpTransportType.WebSockets
    })
    .withAutomaticReconnect({ nextRetryDelayInMilliseconds: () => 5000 })
    .build();

  connection.on("VagaAtualizada", (event: VagaAtualizadaEvent) => {
    listeners.forEach(l => l.onVagaAtualizada?.(event));
  });

  connection.on("StatusGeral", (event: StatusGeralEvent) => {
    listeners.forEach(l => l.onStatusGeral?.(event));
  });

  connection.onreconnected(() => {
    connection?.invoke("JoinParking").catch(() => {});
  });

  try {
    await connection.start();
    await connection.invoke("JoinParking");
  } catch (e) {
    connection = null;
    isStarting = false;
    setTimeout(startConnection, 5000);
  }
  
  isStarting = false;
};

export function useSignalR(
  onVagaAtualizada?: (event: VagaAtualizadaEvent) => void,
  onStatusGeral?: (event: StatusGeralEvent) => void
) {
  useEffect(() => {
    const listener = { onVagaAtualizada, onStatusGeral };
    listeners.push(listener);
    
    startConnection();

    return () => {
      listeners = listeners.filter(l => l !== listener);
    };
  }, []);
}
