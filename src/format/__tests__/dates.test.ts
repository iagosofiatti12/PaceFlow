import { formatRelativeDate, formatRunDay, recentDays, toIsoDay } from '../dates';

// Datas montadas no fuso local, como o app faz no aparelho
const local = (y: number, mo: number, d: number, h = 12, mi = 0): Date =>
  new Date(y, mo - 1, d, h, mi);

describe('formatRelativeDate', () => {
  const now = local(2026, 9, 25, 8, 0);

  it('deve mostrar "Hoje" para o mesmo dia do calendário', () => {
    expect(formatRelativeDate(local(2026, 9, 25, 0, 5).toISOString(), now)).toBe('Hoje');
  });

  it('deve mostrar "Ontem" para ontem à noite, mesmo com menos de 24h de diferença', () => {
    expect(formatRelativeDate(local(2026, 9, 24, 23, 0).toISOString(), now)).toBe('Ontem');
  });

  it('deve mostrar "N dias atrás" entre 2 e 6 dias', () => {
    expect(formatRelativeDate(local(2026, 9, 23).toISOString(), now)).toBe('2 dias atrás');
    expect(formatRelativeDate(local(2026, 9, 19).toISOString(), now)).toBe('6 dias atrás');
  });

  it('deve mostrar a data completa a partir de 7 dias', () => {
    expect(formatRelativeDate(local(2026, 9, 18).toISOString(), now)).toBe('18/09/26');
  });

  it('deve tratar datas no futuro (relógio do aparelho ajustado) como "Hoje"', () => {
    expect(formatRelativeDate(local(2026, 9, 26).toISOString(), now)).toBe('Hoje');
  });
});

describe('dias dos treinos', () => {
  // Sábado, 4 de outubro de 2026, 10h (horário local)
  const now = new Date(2026, 9, 4, 10, 0);

  it('toIsoDay usa o dia local', () => {
    expect(toIsoDay(new Date(2026, 0, 5, 23, 59))).toBe('2026-01-05');
  });

  it('formatRunDay: hoje, ontem e dia da semana com data', () => {
    expect(formatRunDay('2026-10-04', now)).toBe('Hoje');
    expect(formatRunDay('2026-10-03', now)).toBe('Ontem');
    expect(formatRunDay('2026-09-27', now)).toBe('dom, 27/09');
    expect(formatRunDay('2025-12-31', now)).toBe('qua, 31/12/2025');
  });

  it('recentDays: hoje primeiro, atravessando o mês', () => {
    expect(recentDays(5, now)).toEqual([
      '2026-10-04',
      '2026-10-03',
      '2026-10-02',
      '2026-10-01',
      '2026-09-30',
    ]);
  });
});
