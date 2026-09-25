import { COLORS } from '../constants/theme';
import type { PaceFeedback } from '../types';

// Tipos para validação
interface ValidationResult {
  valid: boolean;
  message?: string;
}

interface TimeValidationResult extends ValidationResult {
  totalSeconds: number;
}

interface PaceResult {
  formatted: string;
  paceInSeconds: number;
}

interface TimeResult {
  formatted: string;
  totalSeconds: number;
}

export interface PaceTableRow {
  km: number;
  time: string;
  cumulativeTime: string;
}

/** Maior tempo aceito: 99:59:59 */
export const MAX_TIME_SECONDS = 99 * 3600 + 59 * 60 + 59;

/**
 * Função para formatar entradas de tempo (horas, minutos, segundos)
 * Garante que o valor não exceda o máximo permitido
 */
export const formatTimeInput = (value: string, maxValue: number): string => {
  const num = value.replace(/[^0-9]/g, '');
  if (num === '') return '';
  const numValue = parseInt(num, 10);
  return numValue > maxValue ? maxValue.toString() : num;
};

/**
 * Função para validar e formatar entrada de distância
 * Aceita vírgula e ponto como separador decimal
 */
export const formatDistanceInput = (value: string): string | null => {
  const formatted = value.replace(',', '.');
  if (formatted === '' || /^\d*\.?\d*$/.test(formatted)) {
    return formatted;
  }
  return null;
};

/**
 * Valida se uma distância está dentro dos limites aceitáveis
 */
export const validateDistance = (distance: string): ValidationResult => {
  const dist = parseFloat(distance);

  if (!distance || isNaN(dist)) {
    return { valid: false, message: 'Por favor, insira uma distância válida' };
  }

  if (dist < 0.1 || dist > 500) {
    return { valid: false, message: 'A distância deve estar entre 0.1 e 500 km' };
  }

  return { valid: true };
};

/**
 * Valida se o tempo total está dentro dos limites aceitáveis
 */
export const validateTime = (
  hours: string,
  minutes: string,
  seconds: string,
): TimeValidationResult => {
  const h = parseInt(hours, 10) || 0;
  const m = parseInt(minutes, 10) || 0;
  const s = parseInt(seconds, 10) || 0;
  const totalSeconds = h * 3600 + m * 60 + s;

  if (totalSeconds <= 0) {
    return { valid: false, message: 'Por favor, insira um tempo válido', totalSeconds: 0 };
  }

  // Até 99:59:59 (o campo de horas tem 2 dígitos): cabe de um tiro de 400 m
  // a ultramaratonas de 100 milhas, coerente com o limite de 500 km de distância
  if (totalSeconds > MAX_TIME_SECONDS) {
    return { valid: false, message: 'O tempo deve ser de no máximo 99:59:59', totalSeconds: 0 };
  }

  return { valid: true, totalSeconds };
};

/**
 * Calcula o pace em formato legível (min:seg)
 */
export const calculatePaceValue = (totalSeconds: number, distance: number): PaceResult => {
  const paceInSeconds = totalSeconds / distance;
  // Arredonda para o segundo mais próximo (e não trunca), igual ao calculateTime:
  // 299,9 s/km vira "5:00", não "4:59". Arredondar o total evita um "4:60".
  const rounded = Math.round(paceInSeconds);

  return {
    formatted: formatSecondsToTime(rounded),
    paceInSeconds,
  };
};

// Monta o feedback: o emoji só aparece na tela; o leitor de tela lê o texto limpo
const feedback = (
  label: string,
  emoji: string,
  color: string,
  textColor: string,
): PaceFeedback => ({ text: `${label} ${emoji}`, accessibilityText: label, color, textColor });

/**
 * Retorna feedback baseado no pace (ritmo) do corredor
 */
export const getPaceFeedback = (paceInSeconds: number): PaceFeedback => {
  const totalMinutes = paceInSeconds / 60;
  const colors = COLORS.paceFeedback;
  // Fundos escuros recebem texto branco; fundos claros, texto escuro (contraste WCAG)
  const light = COLORS.white;
  const dark = COLORS.paceFeedbackDarkText;
  if (totalMinutes < 3) return feedback('Alienígena!', '👽🏅', colors.alien, light);
  if (totalMinutes < 4) return feedback('Pace de elite!', '🏆', colors.elite, light);
  if (totalMinutes < 5) return feedback('Pace avançado!', '💪', colors.advanced, light);
  if (totalMinutes < 6) return feedback('Pace intermediário!', '👏', colors.intermediate, dark);
  if (totalMinutes < 8) return feedback('Pace iniciante!', '🎯', colors.beginner, dark);
  return feedback('Continue treinando!', '🚀', colors.keepTraining, dark);
};

/**
 * Máscara de digitação do pace: mantém só dígitos e ":", limita a min:seg
 * e insere o ":" automaticamente após dois dígitos (ex: "530" vira "5:30" ao digitar "53" + "0")
 */
export const formatPaceInput = (value: string): string => {
  // Remove tudo que não é número ou :
  let cleaned = value.replace(/[^\d:]/g, '');

  // Garante apenas um :
  const colonCount = (cleaned.match(/:/g) || []).length;
  if (colonCount > 1) {
    cleaned = cleaned.replace(/:.*:/, ':');
  }

  // Limita formato min:seg
  const parts = cleaned.split(':');
  if (parts.length === 2) {
    const minutes = parts[0].slice(0, 2);
    const seconds = parts[1].slice(0, 2);
    cleaned = `${minutes}:${seconds}`;
  } else if (cleaned.length > 2 && !cleaned.includes(':')) {
    // Auto-adiciona : após 2 dígitos
    cleaned = `${cleaned.slice(0, 2)}:${cleaned.slice(2, 4)}`;
  }

  return cleaned;
};

/**
 * Valida o formato de pace (min:seg)
 */
export const validatePaceFormat = (pace: string): ValidationResult => {
  if (!pace || pace.trim() === '') {
    return { valid: false, message: 'Por favor, insira um pace válido' };
  }

  const paceRegex = /^(\d+):([0-5]\d)$/;
  if (!paceRegex.test(pace)) {
    return { valid: false, message: 'Formato inválido. Use: minutos:segundos (ex: 5:30)' };
  }

  const [minutes, seconds] = pace.split(':').map(Number);

  if (minutes > 20 || (minutes === 20 && seconds > 0)) {
    return { valid: false, message: 'Pace deve estar entre 0:01 e 20:00 por km' };
  }

  if (minutes === 0 && seconds === 0) {
    return { valid: false, message: 'Pace não pode ser zero' };
  }

  return { valid: true };
};

/**
 * Converte pace (min:seg) para segundos totais
 */
export const paceToSeconds = (pace: string): number => {
  const [minutes, seconds] = pace.split(':').map(Number);
  return minutes * 60 + seconds;
};

/**
 * Calcula o tempo total baseado em distância e pace
 */
export const calculateTime = (distance: number, paceInSeconds: number): TimeResult => {
  const totalSeconds = Math.round(distance * paceInSeconds);
  return { formatted: formatSecondsToTime(totalSeconds), totalSeconds };
};

/**
 * Formata segundos para string de tempo legível
 */
export const formatSecondsToTime = (totalSeconds: number): string => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

/**
 * Gera tabela de pace com tempo por km
 */
export const generatePaceTable = (distance: number, paceInSeconds: number): PaceTableRow[] => {
  const table: PaceTableRow[] = [];
  const totalKm = Math.floor(distance);
  const hasDecimal = distance % 1 !== 0;

  for (let km = 1; km <= totalKm; km++) {
    const cumulativeSeconds = Math.round(km * paceInSeconds);
    table.push({
      km,
      time: formatSecondsToTime(paceInSeconds),
      cumulativeTime: formatSecondsToTime(cumulativeSeconds),
    });
  }

  // Adiciona linha para km decimal se houver
  if (hasDecimal) {
    const cumulativeSeconds = Math.round(distance * paceInSeconds);
    table.push({
      km: distance,
      time: formatSecondsToTime(Math.round((distance % 1) * paceInSeconds)),
      cumulativeTime: formatSecondsToTime(cumulativeSeconds),
    });
  }

  return table;
};
