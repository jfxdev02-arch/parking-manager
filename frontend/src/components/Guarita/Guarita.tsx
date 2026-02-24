export function Guarita() {
  return (
    <div className="flex flex-col items-center justify-center bg-gray-700 rounded-lg p-4 w-32">
      <div className="text-3xl mb-2">🏠</div>
      <span className="text-white text-sm font-semibold">GUARITA</span>
      <div className="flex gap-2 mt-2 text-xs text-gray-300">
        <span>⬅️ Entrada</span>
        <span>Saída ➡️</span>
      </div>
    </div>
  );
}
