import {
  getPaceFeedback,
  calculatePaceValue,
  validateDistance,
  validateTime,
} from '../paceHelpers';

describe('paceHelpers', () => {
  describe('validateDistance', () => {
    it('deve validar distância válida', () => {
      const result = validateDistance('10');
      expect(result.valid).toBe(true);
    });

    it('deve rejeitar distância vazia', () => {
      const result = validateDistance('');
      expect(result.valid).toBe(false);
      expect(result.message).toBe('Por favor, insira uma distância válida');
    });

    it('deve rejeitar distância maior que 500km', () => {
      const result = validateDistance('501');
      expect(result.valid).toBe(false);
      expect(result.message).toBe('A distância deve estar entre 0.1 e 500 km');
    });

    it('deve rejeitar distância zero ou negativa', () => {
      const result = validateDistance('0');
      expect(result.valid).toBe(false);
      expect(result.message).toBe('A distância deve estar entre 0.1 e 500 km');
    });
  });

  describe('validateTime', () => {
    it('deve validar tempo válido', () => {
      const result = validateTime('0', '30', '0');
      expect(result.valid).toBe(true);
      expect(result.totalSeconds).toBe(1800);
    });

    it('deve rejeitar tempo zero', () => {
      const result = validateTime('0', '0', '0');
      expect(result.valid).toBe(false);
      expect(result.message).toBe('Por favor, insira um tempo válido');
    });

    it('deve rejeitar tempo maior que 24 horas', () => {
      const result = validateTime('25', '0', '0');
      expect(result.valid).toBe(false);
      expect(result.message).toBe('O tempo deve ser menor que 24 horas');
    });
  });

  describe('calculatePaceValue', () => {
    it('deve calcular pace corretamente', () => {
      const result = calculatePaceValue(1800, 5); // 30 min para 5km
      expect(result.formatted).toBe('6:00');
      expect(result.paceInSeconds).toBe(360); // 6 min/km
    });

    it('deve formatar segundos com zero à esquerda', () => {
      const result = calculatePaceValue(1805, 5); // 30:05 para 5km
      expect(result.formatted).toBe('6:01');
    });
  });

  describe('getPaceFeedback', () => {
    it('deve retornar feedback de elite para pace < 4 min/km', () => {
      const result = getPaceFeedback(230); // 3:50 min/km
      expect(result.text).toContain('elite');
      expect(result.color).toBeDefined();
    });

    it('deve retornar feedback avançado para pace entre 4-5 min/km', () => {
      const result = getPaceFeedback(270); // 4:30 min/km
      expect(result.text).toContain('avançado');
      expect(result.color).toBeDefined();
    });

    it('deve retornar feedback intermediário para pace entre 5-6 min/km', () => {
      const result = getPaceFeedback(330); // 5:30 min/km
      expect(result.text).toContain('intermediário');
      expect(result.color).toBeDefined();
    });

    it('deve retornar feedback iniciante para pace entre 6-8 min/km', () => {
      const result = getPaceFeedback(420); // 7:00 min/km
      expect(result.text).toContain('iniciante');
      expect(result.color).toBeDefined();
    });

    it('deve retornar feedback de treino para pace > 8 min/km', () => {
      const result = getPaceFeedback(540); // 9:00 min/km
      expect(result.text).toContain('treinando');
      expect(result.color).toBeDefined();
    });
  });
});
