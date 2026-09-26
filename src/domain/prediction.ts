// Previsão de prova pela fórmula de Riegel (Pete Riegel, 1977):
//   T2 = T1 × (D2 / D1) ^ 1,06
// Em palavras: cada vez que a distância dobra, o tempo mais que dobra,
// porque o pace fica um pouco mais lento em provas mais longas.

/** Expoente de fadiga da fórmula de Riegel */
export const RIEGEL_EXPONENT = 1.06;

/**
 * Menor distância que serve de base para a previsão. Abaixo disso (tiros de
 * 400 m, 1 km), a fórmula erra demais: tiro curto não diz muito sobre maratona.
 */
export const MIN_PREDICTION_KM = 3;

export interface Prediction {
  km: number;
  /** Tempo previsto, em segundos */
  seconds: number;
  /** Pace previsto, em segundos por km */
  paceSeconds: number;
}

/** Tempo previsto (segundos) para `targetKm`, a partir de um resultado conhecido. */
export const predictTime = (knownKm: number, knownSeconds: number, targetKm: number): number =>
  Math.round(knownSeconds * (targetKm / knownKm) ** RIEGEL_EXPONENT);

/**
 * Previsões para várias distâncias. Pula a distância que já é a do resultado
 * (margem de 1%, para "21,1" contar como meia maratona) e devolve lista vazia
 * quando a base é curta demais para prever (ver MIN_PREDICTION_KM).
 */
export const predictRaces = (
  knownKm: number,
  knownSeconds: number,
  targetsKm: readonly number[],
): Prediction[] => {
  if (knownKm < MIN_PREDICTION_KM) return [];

  return targetsKm
    .filter((targetKm) => Math.abs(targetKm - knownKm) / knownKm > 0.01)
    .map((targetKm) => {
      const seconds = predictTime(knownKm, knownSeconds, targetKm);
      return { km: targetKm, seconds, paceSeconds: Math.round(seconds / targetKm) };
    });
};
