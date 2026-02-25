import { ParkingMap } from "../components/ParkingMap";
import { useEstacionamento } from "../hooks/useEstacionamento";

export function HomePage() {
  const { vagas, status, loading } = useEstacionamento();

  return (
    <ParkingMap vagas={vagas} status={status} loading={loading} />
  );
}
