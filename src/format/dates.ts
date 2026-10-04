/** Início do dia (00:00 no fuso do aparelho) da data informada. */
const startOfDay = (date: Date): number =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();

const MS_PER_DAY = 1000 * 60 * 60 * 24;

/**
 * Data relativa para o histórico: "Hoje", "Ontem", "N dias atrás" ou dd/mm/aa.
 * Compara dias do calendário, e não janelas de 24h: um cálculo de ontem às 23h,
 * visto hoje às 8h, é "Ontem" (e não "Hoje").
 */
export const formatRelativeDate = (isoDate: string, now: Date = new Date()): string => {
  const date = new Date(isoDate);
  // Math.round absorve a hora a mais/a menos dos dias de horário de verão
  const diffDays = Math.round((startOfDay(now) - startOfDay(date)) / MS_PER_DAY);

  if (diffDays <= 0) return 'Hoje';
  if (diffDays === 1) return 'Ontem';
  if (diffDays < 7) return `${diffDays} dias atrás`;

  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
  });
};

/** Data do aparelho no formato AAAA-MM-DD (o dia, no fuso local) */
export const toIsoDay = (date: Date): string => {
  const pad = (n: number): string => n.toString().padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
};

/** "AAAA-MM-DD" → Date à meia-noite local (e não UTC, que mudaria o dia no Brasil) */
const fromIsoDay = (isoDay: string): Date => {
  const [year, month, day] = isoDay.split('-').map(Number);
  return new Date(year, month - 1, day);
};

const WEEKDAYS = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'];

/**
 * Dia de um treino: "Hoje", "Ontem" ou "sáb, 27/09" (com o ano, se não for o atual).
 */
export const formatRunDay = (isoDay: string, now: Date = new Date()): string => {
  const date = fromIsoDay(isoDay);
  const diffDays = Math.round((startOfDay(now) - startOfDay(date)) / MS_PER_DAY);
  if (diffDays === 0) return 'Hoje';
  if (diffDays === 1) return 'Ontem';

  const dd = date.getDate().toString().padStart(2, '0');
  const mm = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear() === now.getFullYear() ? '' : `/${date.getFullYear()}`;
  return `${WEEKDAYS[date.getDay()]}, ${dd}/${mm}${year}`;
};

/** Os últimos `count` dias (hoje primeiro), para escolher o dia de um treino */
export const recentDays = (count: number, now: Date = new Date()): string[] =>
  Array.from({ length: count }, (_, i) =>
    toIsoDay(new Date(now.getFullYear(), now.getMonth(), now.getDate() - i)),
  );
