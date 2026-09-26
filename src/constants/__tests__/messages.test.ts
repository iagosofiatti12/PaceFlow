import { VALIDATION_MESSAGES } from '../messages';
import { PACE_LEVELS } from '../paceLevels';

// Textos exibidos ao usuário (a distância usa vírgula decimal, como no Brasil)
describe('VALIDATION_MESSAGES', () => {
  it('deve manter os textos de erro exibidos ao usuário', () => {
    expect(VALIDATION_MESSAGES['distance.empty']).toBe('Por favor, insira uma distância válida');
    expect(VALIDATION_MESSAGES['distance.min']).toBe('A distância mínima é 0,1 km');
    expect(VALIDATION_MESSAGES['distance.max']).toBe('A distância máxima é 500 km');
    expect(VALIDATION_MESSAGES['time.empty']).toBe('Por favor, insira um tempo válido');
    expect(VALIDATION_MESSAGES['time.max']).toBe('O tempo deve ser de no máximo 99:59:59');
    expect(VALIDATION_MESSAGES['pace.empty']).toBe('Por favor, insira um pace válido');
    expect(VALIDATION_MESSAGES['pace.zero']).toBe('Pace não pode ser zero');
    expect(VALIDATION_MESSAGES['speed.max']).toBe('A velocidade máxima é 30 km/h');
  });
});

describe('PACE_LEVELS', () => {
  it('deve ter rótulo sem emoji para o leitor de tela', () => {
    expect(PACE_LEVELS.alien.label).toBe('Alienígena!');
    expect(PACE_LEVELS.alien.emoji).toContain('👽');
    Object.values(PACE_LEVELS).forEach((level) => {
      expect(level.label).not.toMatch(/\p{Extended_Pictographic}/u);
    });
  });

  it('deve ter cor de fundo e de texto em todos os níveis', () => {
    Object.values(PACE_LEVELS).forEach((level) => {
      expect(level.color).toMatch(/^#/);
      expect(level.textColor).toMatch(/^#/);
    });
  });
});
