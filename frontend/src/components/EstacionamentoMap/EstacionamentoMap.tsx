import React, { useState, useEffect, useCallback } from 'react';
import Vaga from '../Vaga/Vaga';
import Legenda from '../Legenda/Legenda';

interface Veiculo {
  placa: string;
  proprietario?: string;
  entrada?: string;
}

interface VagaData {
  numero: number;
  status: 'livre' | 'ocupada' | 'reservada';
  veiculo?: Veiculo;
}

const API_BASE = 'http://76.13.225.52:5002/api';

const EstacionamentoMap: React.FC = () => {
  const [vagas, setVagas] = useState<VagaData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Inicializar vagas
  const inicializarVagas = useCallback(() => {
    const vagasIniciais: VagaData[] = [];
    for (let i = 1; i <= 50; i++) {
      vagasIniciais.push({
        numero: i,
        status: 'livre'
      });
    }
    return vagasIniciais;
  }, []);

  // Buscar dados do backend
  const fetchVagas = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE}/vagas`);
      if (!response.ok) throw new Error('Falha ao carregar vagas');
      const data = await response.json();
      
      // Se o backend retornar dados, mapear para o formato local
      if (Array.isArray(data) && data.length > 0) {
        const vagasAtualizadas = inicializarVagas().map(vagaBase => {
          const vagaBackend = data.find((v: any) => v.numero === vagaBase.numero || v.id === vagaBase.numero);
          if (vagaBackend) {
            return {
              numero: vagaBase.numero,
              status: vagaBackend.status || 'livre',
              veiculo: vagaBackend.veiculo ? {
                placa: vagaBackend.veiculo.placa || '',
                proprietario: vagaBackend.veiculo.proprietario || vagaBackend.veiculo.nome || '',
                entrada: vagaBackend.veiculo.entrada || vagaBackend.entrada || ''
              } : undefined
            };
          }
          return vagaBase;
        });
        setVagas(vagasAtualizadas);
      } else {
        setVagas(inicializarVagas());
      }
      setError(null);
    } catch (err) {
      console.error('Erro ao buscar vagas:', err);
      setVagas(inicializarVagas());
      setError('Usando dados locais - Backend indisponível');
    } finally {
      setLoading(false);
    }
  }, [inicializarVagas]);

  useEffect(() => {
    fetchVagas();
    // Atualizar a cada 10 segundos
    const interval = setInterval(fetchVagas, 10000);
    return () => clearInterval(interval);
  }, [fetchVagas]);

  // Calcular estatísticas
  const stats = {
    total: vagas.length,
    livres: vagas.filter(v => v.status === 'livre').length,
    ocupadas: vagas.filter(v => v.status === 'ocupada').length,
    reservadas: vagas.filter(v => v.status === 'reservada').length
  };

  // Dividir vagas em lados
  const vagasEsquerda = vagas.filter(v => v.numero >= 1 && v.numero <= 25);
  const vagasDireita = vagas.filter(v => v.numero >= 26 && v.numero <= 50);

  const handleVagaClick = (numero: number) => {
    console.log('Vaga clicada:', numero);
    // Aqui pode abrir modal de registro/entrada
  };

  // Ícones SVG
  const EntryArrow = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 12h14" />
      <path d="M12 5l7 7-7 7" />
    </svg>
  );

  const ExitArrow = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M19 12H5" />
      <path d="M12 19l-7-7 7-7" />
    </svg>
  );

  const GuaritaIcon = () => (
    <svg className="guarita-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M3 21h18" strokeLinecap="round" />
      <path d="M5 21V7l7-4 7 4v14" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="9" y="13" width="6" height="8" fill="rgba(255,255,255,0.1)" />
      <rect x="6" y="9" width="3" height="3" rx="0.5" fill="rgba(100,180,255,0.4)" />
      <rect x="15" y="9" width="3" height="3" rx="0.5" fill="rgba(100,180,255,0.4)" />
    </svg>
  );

  if (loading) {
    return (
      <div className="parking-map-container">
        <div className="parking-lot" style={{ minHeight: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="loading-pulse" style={{ color: '#94a3b8', fontSize: '18px' }}>
            Carregando mapa...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="parking-map-container">
      {/* Legenda */}
      <Legenda 
        totalVagas={stats.total}
        vagasLivres={stats.livres}
        vagasOcupadas={stats.ocupadas}
        vagasReservadas={stats.reservadas}
      />

      {/* Stats Bar */}
      <div className="stats-bar fade-in">
        <div className="stat-item">
          <div className="stat-value">{stats.livres}</div>
          <div className="stat-label">Vagas Livres</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">{stats.ocupadas}</div>
          <div className="stat-label">Ocupadas</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">{stats.reservadas}</div>
          <div className="stat-label">Reservadas</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">{Math.round((stats.livres / stats.total) * 100)}%</div>
          <div className="stat-label">Disponibilidade</div>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: '8px',
          padding: '12px',
          marginBottom: '20px',
          color: '#fca5a5',
          fontSize: '13px',
          textAlign: 'center'
        }}>
          ⚠️ {error}
        </div>
      )}

      {/* Parking Lot Map */}
      <div className="parking-lot">
        {/* Entry/Exit Indicators */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '30px',
          padding: '0 20px'
        }}>
          <div className="flow-arrow entry">
            <EntryArrow />
            <span>ENTRADA</span>
          </div>
          <div className="flow-arrow exit">
            <span>SAÍDA</span>
            <ExitArrow />
          </div>
        </div>

        {/* Main Parking Grid */}
        <div style={{
          display: 'flex',
          gap: '20px',
          justifyContent: 'center',
          alignItems: 'flex-start'
        }}>
          {/* Left Side - Vagas 01-25 */}
          <div className="parking-side">
            <div className="parking-side-label">Lado A • Vagas 01-25</div>
            <div className="stagger-children" style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', maxWidth: '680px', justifyContent: 'center' }}>
              {vagasEsquerda.map(vaga => (
                <Vaga
                  key={vaga.numero}
                  numero={vaga.numero}
                  status={vaga.status}
                  veiculo={vaga.veiculo}
                  onClick={() => handleVagaClick(vaga.numero)}
                />
              ))}
            </div>
          </div>

          {/* Center - Aisle with Guard Booth */}
          <div className="parking-center">
            <div className="guarita">
              <GuaritaIcon />
            </div>
            <div className="center-line"></div>
          </div>

          {/* Right Side - Vagas 26-50 */}
          <div className="parking-side">
            <div className="parking-side-label">Lado B • Vagas 26-50</div>
            <div className="stagger-children" style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', maxWidth: '680px', justifyContent: 'center' }}>
              {vagasDireita.map(vaga => (
                <Vaga
                  key={vaga.numero}
                  numero={vaga.numero}
                  status={vaga.status}
                  veiculo={vaga.veiculo}
                  onClick={() => handleVagaClick(vaga.numero)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div style={{
          marginTop: '30px',
          textAlign: 'center',
          color: '#475569',
          fontSize: '11px',
          letterSpacing: '1px'
        }}>
          ESTACIONAMENTO INTELIGENTE • ATUALIZAÇÃO AUTOMÁTICA A CADA 10 SEGUNDOS
        </div>
      </div>
    </div>
  );
};

export default EstacionamentoMap;
