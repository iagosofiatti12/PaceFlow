// Tabela de parciais km a km (a aba Tabela)

export interface Split {
  /** Km da linha: 1, 2, 3... e, na última, a distância exata (ex: 21.0975) */
  km: number;
  /** Tempo só deste trecho, em segundos */
  splitSeconds: number;
  /** Tempo acumulado até o fim deste trecho, em segundos */
  cumulativeSeconds: number;
}

/**
 * Estratégia de prova:
 * - `even`: ritmo constante, o mesmo pace do começo ao fim
 * - `negative`: negative split, a segunda metade mais rápida que a primeira
 */
export type SplitStrategy = 'even' | 'negative';

/**
 * Quanto a segunda metade é mais rápida no negative split: 2% (ex: 5:33 → 5:27).
 * Um valor pequeno de propósito: o objetivo é largar contido, não "guardar" a prova.
 */
export const NEGATIVE_SPLIT_FACTOR = 0.02;

export interface HalfPaces {
  /** Pace da primeira metade, em segundos por km (sem arredondar) */
  firstHalf: number;
  /** Pace da segunda metade, em segundos por km (sem arredondar) */
  secondHalf: number;
}

/**
 * Paces das duas metades para um negative split que termina no MESMO tempo final
 * do ritmo constante. Conta: (D/2)·p1 + (D/2)·p1·(1 − f) = D·p  →  p1 = 2p / (2 − f).
 */
export const negativeSplitPaces = (paceSeconds: number): HalfPaces => {
  const firstHalf = (2 * paceSeconds) / (2 - NEGATIVE_SPLIT_FACTOR);
  return { firstHalf, secondHalf: firstHalf * (1 - NEGATIVE_SPLIT_FACTOR) };
};

/** Tempo decorrido (em segundos, sem arredondar) ao passar pelo km `x` da prova */
const elapsedAt = (
  x: number,
  distanceKm: number,
  paceSeconds: number,
  strategy: SplitStrategy,
): number => {
  if (strategy === 'even') return x * paceSeconds;
  const { firstHalf, secondHalf } = negativeSplitPaces(paceSeconds);
  const half = distanceKm / 2;
  return x <= half ? x * firstHalf : half * firstHalf + (x - half) * secondHalf;
};

/**
 * Gera uma linha por km inteiro e, se a distância tiver fração,
 * uma linha final com o trecho que sobra (ex: os 0,1 km de 21,1 km).
 *
 * O parcial de cada linha é a diferença entre os acumulados já arredondados:
 * assim a soma dos parciais sempre bate com o tempo final, sem sobrar segundo.
 */
export const generateSplits = (
  distanceKm: number,
  paceSeconds: number,
  strategy: SplitStrategy = 'even',
): Split[] => {
  const marks: number[] = [];
  for (let km = 1; km <= Math.floor(distanceKm); km++) marks.push(km);
  if (distanceKm % 1 !== 0) marks.push(distanceKm);

  let previous = 0;
  return marks.map((km) => {
    const cumulativeSeconds = Math.round(elapsedAt(km, distanceKm, paceSeconds, strategy));
    const split = { km, splitSeconds: cumulativeSeconds - previous, cumulativeSeconds };
    previous = cumulativeSeconds;
    return split;
  });
};
