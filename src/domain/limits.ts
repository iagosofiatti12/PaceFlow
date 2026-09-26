// Limites do domínio, num lugar só: validação, máscaras e mensagens leem daqui

/** Menor distância aceita (100 m) */
export const MIN_DISTANCE_KM = 0.1;

/** Maior distância aceita: cobre ultramaratonas */
export const MAX_DISTANCE_KM = 500;

/** Maior tempo aceito: 99:59:59 (o campo de horas tem 2 dígitos) */
export const MAX_TIME_SECONDS = 99 * 3600 + 59 * 60 + 59;

/** Maior hora digitável no campo de horas */
export const MAX_HOURS = 99;

/** Pace mais lento aceito: 20:00/km (caminhada lenta) */
export const MAX_PACE_SECONDS = 20 * 60;

/** Menor velocidade de esteira aceita: 3 km/h = pace de 20:00/km (o limite de pace) */
export const MIN_SPEED_KMH = 3;

/** Maior velocidade de esteira aceita (as de academia vão até ~20-25 km/h) */
export const MAX_SPEED_KMH = 30;
