import { formatKm, parseKm } from '../distance';

describe('formatKm', () => {
  it('deve mostrar inteiros sem casas decimais', () => {
    expect(formatKm(10)).toBe('10');
  });

  it('deve usar vírgula decimal', () => {
    expect(formatKm(5.5)).toBe('5,5');
    expect(formatKm(21.0975)).toBe('21,0975');
  });

  it('deve limitar as casas decimais e tirar zeros à direita', () => {
    expect(formatKm(21.0975, 1)).toBe('21,1');
    expect(formatKm(5.5, 2)).toBe('5,5');
    expect(formatKm(0.1 + 0.2)).toBe('0,3'); // sem "0,30000000000000004"
  });
});

describe('parseKm', () => {
  it('deve aceitar vírgula ou ponto', () => {
    expect(parseKm('10,5')).toBe(10.5);
    expect(parseKm('10.5')).toBe(10.5);
  });

  it('deve devolver NaN para texto que não é número', () => {
    expect(parseKm('')).toBeNaN();
    expect(parseKm('abc')).toBeNaN();
  });

  it('deve fazer ida e volta com formatKm', () => {
    [0.1, 5, 10.5, 21.0975, 42.195].forEach((km) => expect(parseKm(formatKm(km))).toBe(km));
  });
});
