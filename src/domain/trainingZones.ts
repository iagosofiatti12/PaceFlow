// Ritmos de treino pelo método de Jack Daniels (VDOT), do livro "Daniels' Running Formula".
//
// A ideia em dois passos:
// 1. Um resultado de prova vira um número só, o VDOT: uma "nota" do condicionamento
//    (parecido com o VO2máx, mas medido pela prova, sem laboratório).
// 2. Cada tipo de treino é uma porcentagem desse VDOT. É só fazer a conta ao contrário
//    para descobrir o pace de cada um.

import { MIN_PREDICTION_KM } from './prediction';

export type TrainingZone = 'easy' | 'marathon' | 'threshold' | 'interval' | 'repetition';

/**
 * Intensidade de cada zona, em fração do VDOT. O leve é uma faixa; os outros são
 * um ritmo alvo. Valores que reproduzem as tabelas publicadas por Daniels.
 */
export const ZONE_INTENSITY: Readonly<Record<TrainingZone, { min: number; max: number }>> = {
  easy: { min: 0.62, max: 0.7 },
  marathon: { min: 0.8, max: 0.8 },
  threshold: { min: 0.88, max: 0.88 },
  interval: { min: 0.975, max: 0.975 },
  repetition: { min: 1.05, max: 1.05 },
};

/** Ordem de exibição: do mais leve ao mais forte */
export const TRAINING_ZONES: readonly TrainingZone[] = [
  'easy',
  'marathon',
  'threshold',
  'interval',
  'repetition',
];

/**
 * Faixa de VDOT em que as fórmulas são confiáveis. Abaixo de 20 é caminhada;
 * acima de 85 fica além dos recordes mundiais.
 */
export const MIN_VDOT = 20;
export const MAX_VDOT = 85;

/** Consumo de oxigênio (ml/kg/min) para correr a `metersPerMinute` */
const oxygenCost = (metersPerMinute: number): number =>
  -4.6 + 0.182258 * metersPerMinute + 0.000104 * metersPerMinute ** 2;

/** Fração do VO2máx que dá para sustentar por `minutes` minutos */
const sustainableFraction = (minutes: number): number =>
  0.8 + 0.1894393 * Math.exp(-0.012778 * minutes) + 0.2989558 * Math.exp(-0.1932605 * minutes);

/** VDOT de um resultado de prova (fórmula de Daniels e Gilbert) */
export const calculateVdot = (distanceKm: number, durationSeconds: number): number => {
  const minutes = durationSeconds / 60;
  return oxygenCost((distanceKm * 1000) / minutes) / sustainableFraction(minutes);
};

/**
 * Pace (segundos por km, arredondado) para treinar a uma fração do VDOT.
 * É a conta do oxygenCost ao contrário (fórmula de Bhaskara).
 */
export const paceAtIntensity = (vdot: number, intensity: number): number => {
  const a = 0.000104;
  const b = 0.182258;
  const c = -(4.6 + vdot * intensity);
  const metersPerMinute = (-b + Math.sqrt(b * b - 4 * a * c)) / (2 * a);
  return Math.round(60000 / metersPerMinute);
};

export interface ZonePace {
  zone: TrainingZone;
  /** Pace mais rápido da zona (segundos por km) */
  fastSeconds: number;
  /** Pace mais lento da zona (igual ao rápido quando a zona é um ritmo alvo) */
  slowSeconds: number;
}

/**
 * Ritmos de treino a partir de um resultado. Devolve null quando a base é curta
 * demais (mesma regra da previsão de prova) ou o VDOT fica fora da faixa confiável.
 */
export const trainingPaces = (distanceKm: number, durationSeconds: number): ZonePace[] | null => {
  if (distanceKm < MIN_PREDICTION_KM) return null;
  const vdot = calculateVdot(distanceKm, durationSeconds);
  if (vdot < MIN_VDOT || vdot > MAX_VDOT) return null;

  return TRAINING_ZONES.map((zone) => ({
    zone,
    fastSeconds: paceAtIntensity(vdot, ZONE_INTENSITY[zone].max),
    slowSeconds: paceAtIntensity(vdot, ZONE_INTENSITY[zone].min),
  }));
};
