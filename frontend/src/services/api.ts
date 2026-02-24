import type { Vaga, StatusGeral } from "../types";

const API_URL = "http://76.13.225.52:5002/api";

export async function getVagas(): Promise<Vaga[]> {
  const response = await fetch(`${API_URL}/vagas`);
  return response.json();
}

export async function getVaga(numero: number): Promise<Vaga> {
  const response = await fetch(`${API_URL}/vagas/${numero}`);
  return response.json();
}

export async function checkin(numero: number, nomeUsuario: string): Promise<{ message: string; pin?: string }> {
  const response = await fetch(`${API_URL}/vagas/${numero}/checkin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nomeUsuario }),
  });
  return response.json();
}

export async function checkout(numero: number, nomeUsuario: string, pin?: string): Promise<{ message: string }> {
  const response = await fetch(`${API_URL}/vagas/${numero}/checkout`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nomeUsuario, pin }),
  });
  return response.json();
}

export async function getStatus(): Promise<StatusGeral> {
  const response = await fetch(`${API_URL}/estacionamento/status`);
  return response.json();
}
