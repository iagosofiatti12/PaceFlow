import { formatSpeed, parseSpeed } from '../speed';

describe('formatSpeed', () => {
  it('sempre com 1 casa e vírgula', () => {
    expect(formatSpeed(10)).toBe('10,0');
    expect(formatSpeed(10.9)).toBe('10,9');
    expect(formatSpeed(8.5)).toBe('8,5');
  });
});

describe('parseSpeed', () => {
  it('aceita vírgula ou ponto', () => {
    expect(parseSpeed('10,5')).toBe(10.5);
    expect(parseSpeed('10.5')).toBe(10.5);
  });

  it('NaN para texto que não é número', () => {
    expect(parseSpeed('')).toBeNaN();
  });
});
