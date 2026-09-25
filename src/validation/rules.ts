import {
  MAX_DISTANCE_KM,
  MAX_PACE_SECONDS,
  MAX_TIME_SECONDS,
  MIN_DISTANCE_KM,
} from '../domain/limits';
import { paceToSeconds } from '../format/time';

// A validação devolve um CÓDIGO de erro, e não o texto da mensagem.
// O texto mora em src/constants/messages.ts, perto da interface:
// a regra ("distância fora do limite") não muda se a frase mudar.
export type ValidationError =
  | 'distance.empty'
  | 'distance.range'
  | 'time.empty'
  | 'time.max'
  | 'pace.empty'
  | 'pace.format'
  | 'pace.range'
  | 'pace.zero';

// Quando é válido, já devolve o número convertido: o componente
// não precisa chamar parseFloat de novo (e não corre o risco de esquecer)
export type ValidationResult<T> =
  | { valid: true; value: T }
  | { valid: false; error: ValidationError };

const fail = (error: ValidationError): { valid: false; error: ValidationError } => ({
  valid: false,
  error,
});

/** Distância em km (texto do campo) → número entre os limites do domínio */
export const validateDistance = (distance: string): ValidationResult<number> => {
  const km = parseFloat(distance);
  if (!distance || isNaN(km)) return fail('distance.empty');
  if (km < MIN_DISTANCE_KM || km > MAX_DISTANCE_KM) return fail('distance.range');
  return { valid: true, value: km };
};

/** Três campos de tempo (vazio conta como zero) → total em segundos */
export const validateTime = (
  hours: string,
  minutes: string,
  seconds: string,
): ValidationResult<number> => {
  const h = parseInt(hours, 10) || 0;
  const m = parseInt(minutes, 10) || 0;
  const s = parseInt(seconds, 10) || 0;
  const totalSeconds = h * 3600 + m * 60 + s;

  if (totalSeconds <= 0) return fail('time.empty');
  if (totalSeconds > MAX_TIME_SECONDS) return fail('time.max');
  return { valid: true, value: totalSeconds };
};

/** Pace "m:ss" → segundos por km */
export const validatePace = (pace: string): ValidationResult<number> => {
  if (!pace || pace.trim() === '') return fail('pace.empty');
  if (!/^(\d+):([0-5]\d)$/.test(pace)) return fail('pace.format');

  const paceSeconds = paceToSeconds(pace);
  if (paceSeconds === 0) return fail('pace.zero');
  if (paceSeconds > MAX_PACE_SECONDS) return fail('pace.range');
  return { valid: true, value: paceSeconds };
};
