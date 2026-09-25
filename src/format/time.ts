// Conversões entre segundos (como o domínio pensa) e texto (como a tela mostra)

const pad2 = (n: number): string => n.toString().padStart(2, '0');

/** Segundos → "m:ss" ou, a partir de 1 hora, "h:mm:ss" */
export const formatSecondsToTime = (totalSeconds: number): string => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}:${pad2(minutes)}:${pad2(seconds)}`;
  }
  return `${minutes}:${pad2(seconds)}`;
};

/**
 * Pace (segundos por km) → "m:ss", sempre em minutos, mesmo passando de 1 hora
 * (3600 s/km vira "60:00", e não "1:00:00"). Assim o texto volta certo para
 * segundos em paceToSeconds, ao restaurar um cálculo do histórico.
 */
export const formatPace = (paceSeconds: number): string =>
  `${Math.floor(paceSeconds / 60)}:${pad2(paceSeconds % 60)}`;

/** Pace "m:ss" → segundos. Espera um texto já validado (ver validatePace). */
export const paceToSeconds = (pace: string): number => {
  const [minutes, seconds] = pace.split(':').map(Number);
  return minutes * 60 + seconds;
};

export interface DurationFields {
  hours: string;
  minutes: string;
  seconds: string;
}

/**
 * Segundos → texto dos três campos de tempo, para preencher a aba Pace
 * ao restaurar um cálculo. Horas zeradas ficam vazias (mostra o placeholder).
 */
export const splitDuration = (totalSeconds: number): DurationFields => {
  const hours = Math.floor(totalSeconds / 3600);
  return {
    hours: hours > 0 ? hours.toString() : '',
    minutes: pad2(Math.floor((totalSeconds % 3600) / 60)),
    seconds: pad2(totalSeconds % 60),
  };
};
