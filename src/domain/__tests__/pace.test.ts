import { calculatePace, calculateTotalTime } from '../pace';
import { formatPace } from '../../format/time';

describe('calculatePace', () => {
  it('deve calcular pace corretamente', () => {
    expect(calculatePace(1800, 5)).toBe(360); // 30 min para 5 km = 6:00/km
  });

  it('deve arredondar ao segundo', () => {
    expect(calculatePace(1805, 5)).toBe(361); // 30:05 para 5 km = 6:01/km
  });

  it('deve arredondar para o segundo mais próximo, como o calculateTotalTime', () => {
    // 1499,5 s em 5 km = 299,9 s/km: arredonda para 5:00 (antes truncava para 4:59)
    expect(formatPace(calculatePace(1499.5, 5))).toBe('5:00');
    // 1802 s em 5 km = 360,4 s/km: arredonda para 6:00
    expect(formatPace(calculatePace(1802, 5))).toBe('6:00');
  });

  it('não deve gerar "X:60" ao arredondar', () => {
    // 359,8 s/km arredonda para 360 s = 6:00, e não "5:60"
    expect(formatPace(calculatePace(1799, 5))).toBe('6:00');
  });
});

describe('calculateTotalTime', () => {
  it('deve calcular tempo total em minutos', () => {
    expect(calculateTotalTime(5, 330)).toBe(1650); // 5 km a 5:30/km = 27:30
  });

  it('deve passar de 1 hora quando necessário', () => {
    expect(calculateTotalTime(21.1, 360)).toBe(7596); // meia a 6:00/km = 2:06:36
  });
});
