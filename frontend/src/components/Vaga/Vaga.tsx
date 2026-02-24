import React, { useState } from 'react';

interface VagaProps {
  numero: number;
  status: 'livre' | 'ocupada' | 'reservada';
  veiculo?: {
    placa: string;
    proprietario?: string;
    entrada?: string;
  };
  onClick?: () => void;
}

const Vaga: React.FC<VagaProps> = ({ numero, status, veiculo, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  const formatarHora = (data?: string) => {
    if (!data) return '--:--';
    try {
      const d = new Date(data);
      return d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '--:--';
    }
  };

  const CarIcon = () => (
    <svg 
      className="car-icon" 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      style={{ 
        filter: status === 'ocupada' 
          ? 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' 
          : 'none' 
      }}
    >
      {/* Car Body */}
      <path 
        d="M3 11L4.5 6.5C4.8 5.6 5.6 5 6.5 5H17.5C18.4 5 19.2 5.6 19.5 6.5L21 11"
        stroke="currentColor" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        fill="rgba(255,255,255,0.1)"
      />
      <path 
        d="M2 14C2 12.9 2.9 12 4 12H20C21.1 12 22 12.9 22 14V17C22 17.6 21.6 18 21 18H20C20 16.3 18.7 15 17 15C15.3 15 14 16.3 14 18H10C10 16.3 8.7 15 7 15C5.3 15 4 16.3 4 18H3C2.4 18 2 17.6 2 17V14Z"
        fill="rgba(255,255,255,0.15)"
        stroke="currentColor" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      {/* Windows */}
      <path 
        d="M6 11L7 7H10V11H6Z" 
        fill="rgba(100,180,255,0.4)" 
        stroke="currentColor" 
        strokeWidth="0.5"
      />
      <path 
        d="M11 7H13V11H11V7Z" 
        fill="rgba(100,180,255,0.4)" 
        stroke="currentColor" 
        strokeWidth="0.5"
      />
      <path 
        d="M14 7H17L18 11H14V7Z" 
        fill="rgba(100,180,255,0.4)" 
        stroke="currentColor" 
        strokeWidth="0.5"
      />
      {/* Wheels */}
      <circle cx="7" cy="17" r="2" fill="#1f2937" stroke="currentColor" strokeWidth="1" />
      <circle cx="17" cy="17" r="2" fill="#1f2937" stroke="currentColor" strokeWidth="1" />
      {/* Headlights */}
      <circle cx="20" cy="13" r="0.8" fill="#fbbf24" />
      <circle cx="4" cy="13" r="0.8" fill="#fbbf24" />
    </svg>
  );

  return (
    <div
      className={`vaga ${status}`}
      data-number={String(numero).padStart(2, '0')}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        animationDelay: `${(numero % 10) * 50}ms`
      }}
    >
      {status === 'ocupada' && <CarIcon />}
      
      {isHovered && (
        <div className="tooltip">
          <div className="tooltip-title">
            Vaga {String(numero).padStart(2, '0')}
          </div>
          {status === 'ocupada' && veiculo && (
            <>
              <div className="tooltip-info">
                <svg className="tooltip-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0110 0v4"/>
                </svg>
                <span>{veiculo.placa.toUpperCase()}</span>
              </div>
              {veiculo.proprietario && (
                <div className="tooltip-info">
                  <svg className="tooltip-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                  <span>{veiculo.proprietario}</span>
                </div>
              )}
              <div className="tooltip-info">
                <svg className="tooltip-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12,6 12,12 16,14"/>
                </svg>
                <span>Entrada: {formatarHora(veiculo.entrada)}</span>
              </div>
            </>
          )}
          {status === 'livre' && (
            <div className="tooltip-info" style={{ color: '#4ade80' }}>
              <svg className="tooltip-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20,6 9,17 4,12"/>
              </svg>
              <span>Disponível</span>
            </div>
          )}
          {status === 'reservada' && (
            <div className="tooltip-info" style={{ color: '#fbbf24' }}>
              <svg className="tooltip-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                <path d="M2 17l10 5 10-5"/>
                <path d="M2 12l10 5 10-5"/>
              </svg>
              <span>Reservada</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Vaga;
