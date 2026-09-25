// Cálculos de pace e tempo. Só números entram e saem: formatar para a tela
// é trabalho de src/format, e validar a entrada é trabalho de src/validation.

/**
 * Pace (segundos por km) a partir do tempo total e da distância.
 * Arredonda ao segundo, igual a calculateTotalTime: as abas Pace e Tempo batem entre si.
 */
export const calculatePace = (totalSeconds: number, distanceKm: number): number =>
  Math.round(totalSeconds / distanceKm);

/** Tempo total (segundos) para percorrer a distância no pace informado. */
export const calculateTotalTime = (distanceKm: number, paceSeconds: number): number =>
  Math.round(distanceKm * paceSeconds);
