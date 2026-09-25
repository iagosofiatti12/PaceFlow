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
 * Gera uma linha por km inteiro e, se a distância tiver fração,
 * uma linha final com o trecho que sobra (ex: os 0,1 km de 21,1 km).
 */
export const generateSplits = (distanceKm: number, paceSeconds: number): Split[] => {
  const splits: Split[] = [];
  const fullKms = Math.floor(distanceKm);

  for (let km = 1; km <= fullKms; km++) {
    splits.push({
      km,
      splitSeconds: paceSeconds,
      cumulativeSeconds: Math.round(km * paceSeconds),
    });
  }

  const remainder = distanceKm % 1;
  if (remainder !== 0) {
    splits.push({
      km: distanceKm,
      splitSeconds: Math.round(remainder * paceSeconds),
      cumulativeSeconds: Math.round(distanceKm * paceSeconds),
    });
  }

  return splits;
};
