import { formatSecondsToTime, formatPace, paceToSeconds } from '../time';

describe('formatSecondsToTime', () => {
  it('deve formatar minutos e segundos', () => {
    expect(formatSecondsToTime(330)).toBe('5:30');
    expect(formatSecondsToTime(65)).toBe('1:05');
  });

  it('deve incluir horas quando necessário', () => {
    expect(formatSecondsToTime(3661)).toBe('1:01:01');
    expect(formatSecondsToTime(7596)).toBe('2:06:36');
  });
});

describe('paceToSeconds', () => {
  it('deve converter pace para segundos', () => {
    expect(paceToSeconds('5:30')).toBe(330);
    expect(paceToSeconds('6:00')).toBe(360);
    expect(paceToSeconds('0:45')).toBe(45);
  });
});

describe('formatPace', () => {
  it('deve formatar pace como m:ss', () => {
    expect(formatPace(330)).toBe('5:30');
    expect(formatPace(65)).toBe('1:05');
  });

  it('deve continuar em minutos acima de 1 hora por km', () => {
    expect(formatPace(3600)).toBe('60:00');
    expect(formatPace(3725)).toBe('62:05');
  });

  it('deve fazer ida e volta com paceToSeconds', () => {
    [45, 330, 1200, 3600, 3725].forEach((seconds) => {
      expect(paceToSeconds(formatPace(seconds))).toBe(seconds);
    });
  });
});
