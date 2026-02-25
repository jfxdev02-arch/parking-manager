import React from 'react';

interface LegendaProps {
  totalVagas?: number;
  vagasLivres?: number;
  vagasOcupadas?: number;
  vagasReservadas?: number;
}

const Legenda: React.FC<LegendaProps> = ({ 
  totalVagas = 50, 
  vagasLivres = 0, 
  vagasOcupadas = 0,
  vagasReservadas = 0 
}) => {
  return (
    <div className="legend fade-in">
      <div className="legend-title">📍 Map Key</div>
      
      <div className="legend-item">
        <div className="legend-color livre"></div>
        <span>Livre ({vagasLivres})</span>
      </div>
      
      <div className="legend-item">
        <div className="legend-color ocupada"></div>
        <span>Ocupada ({vagasOcupadas})</span>
      </div>
      
      <div className="legend-item">
        <div className="legend-color reservada"></div>
        <span>Reservada ({vagasReservadas})</span>
      </div>
      
      <div style={{ 
        marginTop: '12px', 
        paddingTop: '12px', 
        borderTop: '1px solid #475569',
        fontSize: '11px',
        color: '#64748b'
      }}>
        Total: {totalVagas} vagas
      </div>
    </div>
  );
};

export { Legenda };
