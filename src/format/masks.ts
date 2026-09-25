import { MAX_HOURS } from '../domain/limits';

// Máscaras de digitação: rodam a cada tecla e só limpam o texto.
// Não dizem se o valor é válido (isso é trabalho de src/validation).

/**
 * Campo de hora/minuto/segundo: só dígitos, sem passar do máximo.
 * Ex: com máximo 59, "75" vira "59".
 */
export const formatTimeInput = (value: string, maxValue: number): string => {
  const digits = value.replace(/[^0-9]/g, '');
  if (digits === '') return '';
  return parseInt(digits, 10) > maxValue ? maxValue.toString() : digits;
};

/**
 * Campo de distância: aceita vírgula ou ponto como separador decimal e sempre
 * MOSTRA vírgula, como o brasileiro escreve ("10.5" vira "10,5").
 * Retorna null quando a tecla deve ser ignorada (ex: uma letra ou um segundo separador).
 */
export const formatDistanceInput = (value: string): string | null => {
  const normalized = value.replace('.', ',');
  if (normalized === '' || /^\d*,?\d*$/.test(normalized)) {
    return normalized;
  }
  return null;
};

/**
 * Campo de pace: mantém só dígitos e ":", limita a min:seg
 * e insere o ":" automaticamente depois de dois dígitos.
 */
export const formatPaceInput = (value: string): string => {
  let cleaned = value.replace(/[^\d:]/g, '');

  // Garante um único ":"
  if ((cleaned.match(/:/g) || []).length > 1) {
    cleaned = cleaned.replace(/:.*:/, ':');
  }

  const parts = cleaned.split(':');
  if (parts.length === 2) {
    cleaned = `${parts[0].slice(0, 2)}:${parts[1].slice(0, 2)}`;
  } else if (cleaned.length > 2) {
    cleaned = `${cleaned.slice(0, 2)}:${cleaned.slice(2, 4)}`;
  }

  return cleaned;
};

/** Campo de horas: até 99 (MAX_HOURS) */
export const formatHoursInput = (value: string): string => formatTimeInput(value, MAX_HOURS);

/** Campo de minutos ou segundos: até 59 */
export const formatMinutesInput = (value: string): string => formatTimeInput(value, 59);
