import { formatRelativeDate } from '../dates';

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
