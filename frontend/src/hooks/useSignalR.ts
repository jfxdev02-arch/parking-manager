import { useEffect, useRef, useCallback } from "react";
import * as signalR from "@microsoft/signalr";
import type { VagaAtualizadaEvent, StatusGeralEvent } from "../types";

const HUB_URL = "http://76.13.225.52:5002/hubs/estacionamento";

export function useSignalR(
  onVagaAtualizada?: (event: VagaAtualizadaEvent) => void,
  onStatusGeral?: (event: StatusGeralEvent) => void
) {
  const connectionRef = useRef<signalR.HubConnection | null>(null);
  const isConnectingRef = useRef(false);
  const isMountedRef = useRef(true);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const startConnection = useCallback(async () => {
    // Evita múltiplas conexões simultâneas
    if (isConnectingRef.current || connectionRef.current) {
      return;
    }

    if (!isMountedRef.current) {
      return;
    }

    isConnectingRef.current = true;

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(HUB_URL, {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets
      })
      .withAutomaticReconnect({
        nextRetryDelayInMilliseconds: (retryContext) => {
          // Exponential backoff: 0s, 2s, 4s, 8s, 16s, 30s (max)
          if (retryContext.elapsedMilliseconds < 60000) {
            return Math.min(1000 * Math.pow(2, retryContext.previousRetryCount), 30000);
          }
          return 30000; // Max 30 seconds
        }
      })
      .build();

    connectionRef.current = connection;

    connection.on("VagaAtualizada", (event: VagaAtualizadaEvent) => {
      if (isMountedRef.current) {
        onVagaAtualizada?.(event);
      }
    });

    connection.on("StatusGeral", (event: StatusGeralEvent) => {
      if (isMountedRef.current) {
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
      connectionRef.current = null;
      isConnectingRef.current = false;
      
      // Tentar reconectar após 5 segundos se ainda montado
      if (isMountedRef.current) {
        reconnectTimeoutRef.current = setTimeout(() => {
          if (isMountedRef.current && !connectionRef.current) {
            startConnection();
          }
        }, 5000);
      }
    });

    try {
      await connection.start();
      if (isMountedRef.current) {
        console.log("SignalR conectado!");
        await connection.invoke("JoinParking");
        isConnectingRef.current = false;
      } else {
        // Se desmontou durante a conexão, fecha imediatamente
        await connection.stop();
        connectionRef.current = null;
        isConnectingRef.current = false;
      }
    } catch (err) {
      console.error("SignalR erro:", err);
      connectionRef.current = null;
      isConnectingRef.current = false;
      
      // Tentar reconectar após 5 segundos
      if (isMountedRef.current) {
        reconnectTimeoutRef.current = setTimeout(() => {
          if (isMountedRef.current) {
            startConnection();
          }
        }, 5000);
      }
    }
  }, [onVagaAtualizada, onStatusGeral]);

  useEffect(() => {
    isMountedRef.current = true;
    startConnection();

    return () => {
      isMountedRef.current = false;
      
      // Limpar timeout de reconexão
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
      
      // Fechar conexão de forma segura
      const connection = connectionRef.current;
      connectionRef.current = null;
      isConnectingRef.current = false;
      
      if (connection) {
        connection.stop().catch((err) => {
          // Ignora erros de stop - conexão pode já estar fechada
          if (err && !String(err).includes('stop() was called')) {
            console.error('Erro ao fechar conexão:', err);
          }
        });
      }
    };
  }, [startConnection]);
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
