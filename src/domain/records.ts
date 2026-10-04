// Recordes pessoais e metas, a partir do diário de treinos.
// Só números: quem formata para a tela é o format/, e os textos ficam nos componentes.

import { RIEGEL_EXPONENT, MIN_PREDICTION_KM } from './prediction';
import { calculateVdot } from './trainingZones';

/** O mínimo que um treino precisa ter para entrar nas contas */
export interface RunResult {
  id: string;
  distanceKm: number;
  durationSeconds: number;
  /** Data do treino (ISO) */
  date: string;
}

export interface PersonalRecord {
  /** Distância oficial da prova (ex: 21.0975) */
  km: number;
  /** Melhor tempo, em segundos */
  seconds: number;
  /** Pace desse tempo, em segundos por km */
  paceSeconds: number;
  /** Treino de onde veio o recorde */
  runId: string;
  date: string;
}

/**
 * Margem para um treino "valer" como a distância da prova: 1% (21,1 km conta
 * como meia maratona; 10,05 km conta como 10K). O GPS do relógio nunca bate exato.
 */
export const RECORD_DISTANCE_TOLERANCE = 0.01;

const matchesDistance = (runKm: number, raceKm: number): boolean =>
  Math.abs(runKm - raceKm) / raceKm <= RECORD_DISTANCE_TOLERANCE;

/**
 * Melhor marca em cada distância de prova. Um treino um pouco mais longo que a
 * prova (ex: 10,05 km) tem o tempo ajustado para a distância exata, para os
 * recordes serem comparáveis entre si.
 */
export const personalRecords = (
  runs: readonly RunResult[],
  raceDistancesKm: readonly number[],
): PersonalRecord[] =>
  raceDistancesKm.flatMap((km) => {
    const best = runs
      .filter((run) => matchesDistance(run.distanceKm, km))
      .map((run) => ({ run, seconds: Math.round(run.durationSeconds * (km / run.distanceKm)) }))
      .sort((a, b) => a.seconds - b.seconds || a.run.date.localeCompare(b.run.date))[0];
    if (!best) return [];
    return [
      {
        km,
        seconds: best.seconds,
        paceSeconds: Math.round(best.seconds / km),
        runId: best.run.id,
        date: best.run.date,
      },
    ];
  });

/**
 * Distâncias em que `run` passou a ser o recorde (comparando com os treinos
 * de antes dele). Lista vazia = não bateu nenhum recorde.
 */
export const recordsBrokenBy = (
  run: RunResult,
  previousRuns: readonly RunResult[],
  raceDistancesKm: readonly number[],
): number[] => {
  const before = personalRecords(previousRuns, raceDistancesKm);
  const after = personalRecords([...previousRuns, run], raceDistancesKm);
  return after
    .filter((record) => record.runId === run.id)
    .filter((record) => {
      const old = before.find((b) => b.km === record.km);
      return !old || record.seconds < old.seconds;
    })
    .map((record) => record.km);
};

/**
 * O treino que melhor mostra o condicionamento atual: o de maior VDOT entre os
 * que têm pelo menos 3 km (mesma regra da previsão de prova). Serve de base para
 * os ritmos de treino fixos do perfil. null se não houver treino que sirva.
 */
export const bestFitnessRun = (runs: readonly RunResult[]): RunResult | null => {
  const eligible = runs.filter((run) => run.distanceKm >= MIN_PREDICTION_KM);
  if (eligible.length === 0) return null;
  return eligible.reduce((best, run) =>
    calculateVdot(run.distanceKm, run.durationSeconds) >
    calculateVdot(best.distanceKm, best.durationSeconds)
      ? run
      : best,
  );
};

export interface Goal {
  distanceKm: number;
  targetSeconds: number;
}

export interface GoalProgress {
  /** Pace necessário para a meta, em segundos por km */
  targetPaceSeconds: number;
  /** Tempo de referência hoje: o recorde na distância ou, sem ele, a previsão */
  currentSeconds: number | null;
  /** De onde veio o tempo de referência */
  source: 'record' | 'prediction' | null;
  /** Quanto falta tirar (segundos). 0 ou menos = meta alcançada */
  gapSeconds: number | null;
  achieved: boolean;
}

/**
 * Situação da meta: compara com o recorde na mesma distância. Sem recorde nela,
 * estima pelo melhor treino (fórmula de Riegel), para a pessoa ter uma ideia.
 */
export const goalProgress = (goal: Goal, runs: readonly RunResult[]): GoalProgress => {
  const targetPaceSeconds = Math.round(goal.targetSeconds / goal.distanceKm);
  const record = personalRecords(runs, [goal.distanceKm])[0];

  let currentSeconds: number | null = null;
  let source: GoalProgress['source'] = null;
  if (record) {
    currentSeconds = record.seconds;
    source = 'record';
  } else {
    const base = bestFitnessRun(runs);
    if (base) {
      currentSeconds = Math.round(
        base.durationSeconds * (goal.distanceKm / base.distanceKm) ** RIEGEL_EXPONENT,
      );
      source = 'prediction';
    }
  }

  const gapSeconds = currentSeconds === null ? null : currentSeconds - goal.targetSeconds;
  return {
    targetPaceSeconds,
    currentSeconds,
    source,
    gapSeconds,
    achieved: source === 'record' && gapSeconds !== null && gapSeconds <= 0,
  };
};
