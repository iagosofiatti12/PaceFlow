import { getPaceLevel } from '../levels';

describe('getPaceLevel', () => {
  it('deve retornar alien para pace < 3 min/km', () => {
    expect(getPaceLevel(150)).toBe('alien'); // 2:30
  });

  it('deve retornar elite para pace < 4 min/km', () => {
    expect(getPaceLevel(230)).toBe('elite'); // 3:50
  });

  it('deve retornar advanced para pace entre 4-5 min/km', () => {
    expect(getPaceLevel(270)).toBe('advanced'); // 4:30
  });

  it('deve retornar intermediate para pace entre 5-6 min/km', () => {
    expect(getPaceLevel(330)).toBe('intermediate'); // 5:30
  });

  it('deve retornar beginner para pace entre 6-8 min/km', () => {
    expect(getPaceLevel(420)).toBe('beginner'); // 7:00
  });

  it('deve retornar training para pace > 8 min/km', () => {
    expect(getPaceLevel(540)).toBe('training'); // 9:00
  });

  it('limite exato pertence ao nível mais lento', () => {
    expect(getPaceLevel(240)).toBe('advanced'); // 4:00 cravado não é elite
    expect(getPaceLevel(480)).toBe('training'); // 8:00 cravado
  });
});
