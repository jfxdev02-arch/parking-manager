export function GateHouse() {
  return (
    <div className="flex items-center justify-center gap-8 my-4">
      {/* Seta de Entrada */}
      <div className="flex flex-col items-center">
        <svg className="w-8 h-8 text-green-400 animate-pulse" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
        </svg>
        <span className="text-green-400 text-xs font-bold mt-1 tracking-widest">ENTRADA</span>
      </div>

      {/* Guarita */}
      <div className="relative">
        <div className="gate-house">
          <div className="gate-house-icon">🏠</div>
          <div className="gate-house-label">Guarita</div>
        </div>
        
        {/* Barreira de entrada */}
        <div className="absolute -left-8 top-1/2 -translate-y-1/2">
          <div className="w-6 h-1 bg-yellow-400 rounded shadow-lg"></div>
          <div className="w-2 h-8 bg-gray-500 rounded-b -mt-1 mx-auto"></div>
        </div>
      </div>

      {/* Seta de Saída */}
      <div className="flex flex-col items-center">
        <svg className="w-8 h-8 text-orange-400 animate-pulse" viewBox="0 0 24 24" fill="currentColor" style={{ transform: "scaleX(-1)" }}>
          <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
        </svg>
        <span className="text-orange-400 text-xs font-bold mt-1 tracking-widest">SAÍDA</span>
      </div>
    </div>
  );
}
