import { useEffect, useRef, useCallback } from "react";
import * as signalR from "@microsoft/signalr";
import type { VagaAtualizadaEvent, StatusGeralEvent } from "../types";

const HUB_URL = "http://76.13.225.52:5002/hubs/estacionamento";

export function useSignalR(
  onVagaAtualizada?: (event: VagaAtualizadaEvent) => void,
  onStatusGeral?: (event: StatusGeralEvent) => void
) {
  const connectionRef = useRef<signalR.HubConnection | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(HUB_URL, {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets
      })
      .withAutomaticReconnect({
        nextRetryDelayInMilliseconds: () => 5000
      })
      .build();

    connectionRef.current = connection;

    connection.on("VagaAtualizada", (event: VagaAtualizadaEvent) => {
      if (mountedRef.current) {
        onVagaAtualizada?.(event);
      }
    });

    connection.on("StatusGeral", (event: StatusGeralEvent) => {
      if (mountedRef.current) {
        onStatusGeral?.(event);
      }
    });

    connection.onreconnecting(() => {
      console.log("SignalR reconectando...");
    });

    connection.onreconnected(() => {
      console.log("SignalR reconectado!");
      connection.invoke("JoinParking").catch(console.error);
    });

    connection.onclose(() => {
      console.log("SignalR conexão fechada");
    });

    connection
      .start()
      .then(() => {
        if (mountedRef.current) {
          console.log("SignalR conectado!");
          return connection.invoke("JoinParking");
        }
      })
      .catch((err) => {
        console.error("SignalR erro:", err);
      });

    return () => {
      mountedRef.current = false;
      connection.stop().catch(() => {});
    };
  }, []);
}

export function useSignalRConnection() {
  return useCallback(() => {
    return new signalR.HubConnectionBuilder()
      .withUrl(HUB_URL, {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets
      })
      .withAutomaticReconnect()
      .build();
  }, []);
}
