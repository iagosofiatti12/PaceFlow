// Conversões da esteira: velocidade (km/h) ↔ pace (segundos por km).
// São o inverso uma da outra: a 10 km/h você leva 3600 s ÷ 10 = 360 s (6:00) por km.

const SECONDS_PER_HOUR = 3600;

/** Velocidade da esteira (km/h) → pace em segundos por km, arredondado ao segundo */
export const speedToPace = (kmh: number): number => Math.round(SECONDS_PER_HOUR / kmh);

/** Pace (segundos por km) → velocidade em km/h, arredondada a 1 casa (como no painel da esteira) */
export const paceToSpeed = (paceSeconds: number): number =>
  Math.round((SECONDS_PER_HOUR / paceSeconds) * 10) / 10;

/** Velocidades da tabela de consulta rápida: de 8 a 16 km/h, de 0,5 em 0,5 */
export const TREADMILL_REFERENCE_SPEEDS: readonly number[] = Array.from(
  { length: 17 },
  (_, i) => 8 + i * 0.5,
);
