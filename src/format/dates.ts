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
