import { useEffect, useRef, useCallback } from "react";
import * as signalR from "@microsoft/signalr";
import type { VagaAtualizadaEvent, StatusGeralEvent } from "../types";

const HUB_URL = "http://76.13.225.52:5002/hubs/estacionamento";

export function useSignalR(
  onVagaAtualizada?: (event: VagaAtualizadaEvent) => void,
  onStatusGeral?: (event: StatusGeralEvent) => void
) {
  const connectionRef = useRef<signalR.HubConnection | null>(null);

  useEffect(() => {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl(HUB_URL)
      .withAutomaticReconnect()
      .build();

    connectionRef.current = connection;

    connection.on("VagaAtualizada", (event: VagaAtualizadaEvent) => {
      onVagaAtualizada?.(event);
    });

    connection.on("StatusGeral", (event: StatusGeralEvent) => {
      onStatusGeral?.(event);
    });

    connection
      .start()
      .then(() => connection.invoke("JoinParking"))
      .catch((err) => console.error("SignalR connection error:", err));

    return () => {
      connection.stop();
    };
  }, []);
}

export function useSignalRConnection() {
  return useCallback(() => {
    return new signalR.HubConnectionBuilder()
      .withUrl(HUB_URL)
      .withAutomaticReconnect()
      .build();
  }, []);
}
