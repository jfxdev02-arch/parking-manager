export interface Vaga {
  numero: number;
  lado: string;
  ocupada: boolean;
  nomeUsuario?: string;
  horaEntrada?: string;
}

export interface StatusGeral {
  totalVagas: number;
  vagasLivres: number;
  vagasOcupadas: number;
}

export interface VagaAtualizadaEvent {
  vagaNumero: number;
  ocupada: boolean;
  nomeUsuario?: string;
  horaEntrada?: string;
}

export interface StatusGeralEvent {
  totalLivre: number;
  totalOcupado: number;
}
