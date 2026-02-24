import { useState, useEffect, useCallback } from "react";
import type { Vaga, StatusGeral, VagaAtualizadaEvent, StatusGeralEvent } from "../types";
import { getVagas, getStatus } from "../services/api";
import { useSignalR } from "./useSignalR";

export function useEstacionamento() {
  const [vagas, setVagas] = useState<Vaga[]>([]);
  const [status, setStatus] = useState<StatusGeral | null>(null);
  const [loading, setLoading] = useState(true);

  const loadVagas = useCallback(async () => {
    try {
      const data = await getVagas();
      setVagas(data);
    } catch (error) {
      console.error("Error loading vagas:", error);
    }
  }, []);

  const loadStatus = useCallback(async () => {
    try {
      const data = await getStatus();
      setStatus(data);
    } catch (error) {
      console.error("Error loading status:", error);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    Promise.all([loadVagas(), loadStatus()]).finally(() => setLoading(false));
  }, []);

  const handleVagaAtualizada = useCallback((event: VagaAtualizadaEvent) => {
    setVagas((prev) =>
      prev.map((v) =>
        v.numero === event.vagaNumero
          ? {
              ...v,
              ocupada: event.ocupada,
              nomeUsuario: event.nomeUsuario,
              horaEntrada: event.horaEntrada,
            }
          : v
      )
    );
  }, []);

  const handleStatusGeral = useCallback((event: StatusGeralEvent) => {
    setStatus((prev) =>
      prev
        ? { ...prev, vagasLivres: event.totalLivre, vagasOcupadas: event.totalOcupado }
        : null
    );
  }, []);

  useSignalR(handleVagaAtualizada, handleStatusGeral);

  return { vagas, status, loading, refresh: loadVagas };
}
