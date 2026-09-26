// Distâncias de prova mais comuns, para os atalhos embaixo do campo de distância.
// Valores oficiais: meia maratona = 21,0975 km; maratona = 42,195 km.

export interface RaceDistance {
  /** Texto curto do atalho */
  label: string;
  /** Nome completo, lido pelo leitor de tela */
  name: string;
  km: number;
}

export const RACE_DISTANCES: readonly RaceDistance[] = [
  { label: '5K', name: '5 quilômetros', km: 5 },
  { label: '10K', name: '10 quilômetros', km: 10 },
  { label: '21K', name: 'Meia maratona', km: 21.0975 },
  { label: '42K', name: 'Maratona', km: 42.195 },
];
