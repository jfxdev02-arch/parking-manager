import { EstacionamentoMap } from "../components/EstacionamentoMap";
import { useEstacionamento } from "../hooks/useEstacionamento";

export function HomePage() {
  const { vagas, status, loading } = useEstacionamento();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <EstacionamentoMap vagas={vagas} status={status} loading={loading} />
    </div>
  );
}
