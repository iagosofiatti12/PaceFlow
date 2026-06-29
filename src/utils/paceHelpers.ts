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

interface PaceFeedback {
  text: string;
  color: string;
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

  if (dist <= 0 || dist > 500) {
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
  seconds: string
): TimeValidationResult => {
  const h = parseInt(hours) || 0;
  const m = parseInt(minutes) || 0;
  const s = parseInt(seconds) || 0;
  const totalSeconds = h * 3600 + m * 60 + s;

  if (totalSeconds <= 0) {
    return { valid: false, message: 'Por favor, insira um tempo válido', totalSeconds: 0 };
  }

  if (totalSeconds > 86400) {
    return { valid: false, message: 'O tempo deve ser menor que 24 horas', totalSeconds: 0 };
  }

  return { valid: true, totalSeconds };
};

/**
 * Calcula o pace em formato legível (min:seg)
 */
export const calculatePaceValue = (totalSeconds: number, distance: number): PaceResult => {
  const paceInSeconds = totalSeconds / distance;
  const paceMinutes = Math.floor(paceInSeconds / 60);
  const paceSeconds = Math.floor(paceInSeconds % 60);

  return {
    formatted: `${paceMinutes}:${paceSeconds.toString().padStart(2, '0')}`,
    paceInSeconds,
  };
};

/**
 * Retorna feedback baseado no pace (ritmo) do corredor
 */
export const getPaceFeedback = (paceInSeconds: number): PaceFeedback => {
  const totalMinutes = paceInSeconds / 60;
  if (totalMinutes < 3) return { text: 'Alienígena 👽! 🏅', color: '#587a0e' };
  if (totalMinutes < 4) return { text: 'Pace de elite! 🏆', color: '#A73E12' };
  if (totalMinutes < 5) return { text: 'Pace avançado! 💪', color: '#D9591E' };
  if (totalMinutes < 6) return { text: 'Pace intermediário! 👏', color: '#EC7A42' };
  if (totalMinutes < 8) return { text: 'Pace iniciante! 🎯', color: '#F29A6A' };
  return { text: 'Continue treinando! 🚀', color: '#FBB896' };
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
  
  if (minutes < 0 || minutes > 20) {
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
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  let formatted = '';
  if (hours > 0) {
    formatted = `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  } else {
    formatted = `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  return { formatted, totalSeconds };
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
