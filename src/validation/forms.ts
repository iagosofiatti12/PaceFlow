import { calculatePace, calculateTotalTime } from '../domain/pace';
import { validateDistance, validatePace, validateTime, type ValidationError } from './rules';

// Avaliação dos formulários para o cálculo ao vivo: a cada tecla, a tela
// pergunta "já dá para calcular? tem algum campo errado?".
//
// Regra de ouro: campo VAZIO não é erro, é só "ainda não preenchido".
// Assim a tela não fica vermelha antes de a pessoa começar a digitar.

export interface FormEvaluation<Field extends string, Value> {
  /** Resultado pronto quando todos os campos são válidos; null caso contrário */
  value: Value | null;
  /** Erro de cada campo preenchido com valor inválido */
  errors: Partial<Record<Field, ValidationError>>;
}

const isBlank = (text: string): boolean => text.trim() === '';

// ---------- Aba Pace: distância + tempo ----------

export interface PaceFormInput {
  distance: string;
  hours: string;
  minutes: string;
  seconds: string;
}

export interface PaceFormValue {
  distanceKm: number;
  durationSeconds: number;
  paceSeconds: number;
}

export const evaluatePaceForm = ({
  distance,
  hours,
  minutes,
  seconds,
}: PaceFormInput): FormEvaluation<'distance' | 'time', PaceFormValue> => {
  const errors: FormEvaluation<'distance' | 'time', PaceFormValue>['errors'] = {};

  const distanceResult = validateDistance(distance);
  if (!distanceResult.valid && !isBlank(distance)) errors.distance = distanceResult.error;

  const timeBlank = isBlank(hours) && isBlank(minutes) && isBlank(seconds);
  const timeResult = validateTime(hours, minutes, seconds);
  if (!timeResult.valid && !timeBlank) errors.time = timeResult.error;

  if (!distanceResult.valid || !timeResult.valid) return { value: null, errors };

  return {
    value: {
      distanceKm: distanceResult.value,
      durationSeconds: timeResult.value,
      paceSeconds: calculatePace(timeResult.value, distanceResult.value),
    },
    errors,
  };
};

// ---------- Abas Tempo e Tabela: distância + pace ----------

export interface DistancePaceFormInput {
  distance: string;
  pace: string;
}

export interface DistancePaceFormValue {
  distanceKm: number;
  paceSeconds: number;
  totalSeconds: number;
}

export const evaluateDistancePaceForm = ({
  distance,
  pace,
}: DistancePaceFormInput): FormEvaluation<'distance' | 'pace', DistancePaceFormValue> => {
  const errors: FormEvaluation<'distance' | 'pace', DistancePaceFormValue>['errors'] = {};

  const distanceResult = validateDistance(distance);
  if (!distanceResult.valid && !isBlank(distance)) errors.distance = distanceResult.error;

  const paceResult = validatePace(pace);
  if (!paceResult.valid && !isBlank(pace)) errors.pace = paceResult.error;

  if (!distanceResult.valid || !paceResult.valid) return { value: null, errors };

  return {
    value: {
      distanceKm: distanceResult.value,
      paceSeconds: paceResult.value,
      totalSeconds: calculateTotalTime(distanceResult.value, paceResult.value),
    },
    errors,
  };
};

// ---------- Quando mostrar o erro na tela ----------

/**
 * Erros que acontecem naturalmente no MEIO da digitação ("5:" antes de "5:30",
 * "0" antes de "0,5"). Só aparecem depois que a pessoa sai do campo.
 */
const IN_PROGRESS_ERRORS: readonly ValidationError[] = [
  'distance.empty',
  'distance.min',
  'time.empty',
  'pace.empty',
  'pace.format',
  'pace.zero',
];

/**
 * Decide se o erro de um campo aparece agora. Erros de limite ("máximo 500 km")
 * aparecem na hora, porque continuar digitando não resolve; erros de "ainda
 * incompleto" esperam a pessoa sair do campo (`touched`).
 */
export const shouldShowError = (
  error: ValidationError | undefined,
  touched: boolean,
): error is ValidationError => {
  if (!error) return false;
  return touched || !IN_PROGRESS_ERRORS.includes(error);
};
