import type { TrainingZone } from '../domain/trainingZones';

export interface TrainingZoneInfo {
  /** Nome curto da zona */
  label: string;
  /** Para que serve, em linguagem de corredor */
  description: string;
}

// Textos de cada zona. A conta dos ritmos fica em src/domain/trainingZones.ts
export const TRAINING_ZONE_INFO: Record<TrainingZone, TrainingZoneInfo> = {
  easy: { label: 'Leve', description: 'Rodagem e longão, dá para conversar' },
  marathon: { label: 'Maratona', description: 'Ritmo de prova longa' },
  threshold: { label: 'Limiar', description: 'Forte e contínuo, até uns 20 min' },
  interval: { label: 'Intervalado', description: 'Tiros de 3 a 5 min' },
  repetition: { label: 'Repetição', description: 'Tiros curtos, até 2 min' },
};
