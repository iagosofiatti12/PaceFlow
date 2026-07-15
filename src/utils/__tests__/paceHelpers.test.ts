import {
  getPaceFeedback,
  calculatePaceValue,
  validateDistance,
  validateTime,
  validatePaceFormat,
  formatTimeInput,
  formatDistanceInput,
  formatPaceInput,
  paceToSeconds,
  calculateTime,
  formatSecondsToTime,
  generatePaceTable,
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

    it('deve rejeitar distância menor que 0.1 km', () => {
      const result = validateDistance('0.05');
      expect(result.valid).toBe(false);
      expect(result.message).toBe('A distância deve estar entre 0.1 e 500 km');
    });

    it('deve aceitar exatamente os limites 0.1 e 500', () => {
      expect(validateDistance('0.1').valid).toBe(true);
      expect(validateDistance('500').valid).toBe(true);
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

    it('deve tratar campos vazios como zero', () => {
      const result = validateTime('', '45', '');
      expect(result.valid).toBe(true);
      expect(result.totalSeconds).toBe(2700);
    });
  });

  describe('validatePaceFormat', () => {
    it('deve aceitar pace válido', () => {
      expect(validatePaceFormat('5:30').valid).toBe(true);
      expect(validatePaceFormat('20:00').valid).toBe(true);
    });

    it('deve rejeitar pace vazio', () => {
      const result = validatePaceFormat('');
      expect(result.valid).toBe(false);
      expect(result.message).toBe('Por favor, insira um pace válido');
    });

    it('deve rejeitar formato inválido', () => {
      expect(validatePaceFormat('530').valid).toBe(false);
      expect(validatePaceFormat('5:7').valid).toBe(false);
      expect(validatePaceFormat('5:70').valid).toBe(false);
    });

    it('deve rejeitar pace acima de 20:00', () => {
      expect(validatePaceFormat('21:00').valid).toBe(false);
      expect(validatePaceFormat('20:01').valid).toBe(false);
      expect(validatePaceFormat('20:59').valid).toBe(false);
    });

    it('deve rejeitar pace zero', () => {
      const result = validatePaceFormat('0:00');
      expect(result.valid).toBe(false);
      expect(result.message).toBe('Pace não pode ser zero');
    });
  });

  describe('formatTimeInput', () => {
    it('deve manter valores dentro do limite', () => {
      expect(formatTimeInput('45', 59)).toBe('45');
    });

    it('deve limitar valores acima do máximo', () => {
      expect(formatTimeInput('75', 59)).toBe('59');
      expect(formatTimeInput('30', 23)).toBe('23');
    });

    it('deve remover caracteres não numéricos', () => {
      expect(formatTimeInput('4a5', 59)).toBe('45');
    });

    it('deve retornar vazio para entrada vazia', () => {
      expect(formatTimeInput('', 59)).toBe('');
    });
  });

  describe('formatDistanceInput', () => {
    it('deve aceitar números com ponto decimal', () => {
      expect(formatDistanceInput('10.5')).toBe('10.5');
    });

    it('deve converter vírgula em ponto', () => {
      expect(formatDistanceInput('10,5')).toBe('10.5');
    });

    it('deve rejeitar letras retornando null', () => {
      expect(formatDistanceInput('10a')).toBeNull();
    });

    it('deve aceitar string vazia', () => {
      expect(formatDistanceInput('')).toBe('');
    });
  });

  describe('formatPaceInput', () => {
    it('deve inserir dois-pontos automaticamente após 2 dígitos', () => {
      expect(formatPaceInput('530')).toBe('53:0');
      expect(formatPaceInput('0530')).toBe('05:30');
    });

    it('deve remover caracteres inválidos', () => {
      expect(formatPaceInput('5a:3b0')).toBe('5:30');
    });

    it('deve limitar minutos e segundos a 2 dígitos', () => {
      expect(formatPaceInput('123:456')).toBe('12:45');
    });

    it('deve manter apenas um dois-pontos', () => {
      expect(formatPaceInput('5:30:99')).toBe('5:99');
    });
  });

  describe('paceToSeconds', () => {
    it('deve converter pace para segundos', () => {
      expect(paceToSeconds('5:30')).toBe(330);
      expect(paceToSeconds('6:00')).toBe(360);
      expect(paceToSeconds('0:45')).toBe(45);
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

  describe('calculateTime', () => {
    it('deve calcular tempo total em minutos', () => {
      const result = calculateTime(5, 330); // 5km a 5:30/km
      expect(result.formatted).toBe('27:30');
      expect(result.totalSeconds).toBe(1650);
    });

    it('deve formatar com horas quando passar de 1 hora', () => {
      const result = calculateTime(21.1, 360); // meia maratona a 6:00/km
      expect(result.formatted).toBe('2:06:36');
      expect(result.totalSeconds).toBe(7596);
    });
  });

  describe('formatSecondsToTime', () => {
    it('deve formatar minutos e segundos', () => {
      expect(formatSecondsToTime(330)).toBe('5:30');
      expect(formatSecondsToTime(65)).toBe('1:05');
    });

    it('deve incluir horas quando necessário', () => {
      expect(formatSecondsToTime(3661)).toBe('1:01:01');
    });
  });

  describe('generatePaceTable', () => {
    it('deve gerar uma linha por km', () => {
      const table = generatePaceTable(5, 330); // 5km a 5:30/km
      expect(table).toHaveLength(5);
      expect(table[0]).toEqual({ km: 1, time: '5:30', cumulativeTime: '5:30' });
      expect(table[4]).toEqual({ km: 5, time: '5:30', cumulativeTime: '27:30' });
    });

    it('deve adicionar linha extra para distância com decimal', () => {
      const table = generatePaceTable(5.5, 300); // 5.5km a 5:00/km
      expect(table).toHaveLength(6);
      expect(table[5].km).toBe(5.5);
      expect(table[5].cumulativeTime).toBe('27:30');
    });

    it('acumulado do último km deve bater com calculateTime', () => {
      const distance = 10;
      const pace = 330;
      const table = generatePaceTable(distance, pace);
      const { formatted } = calculateTime(distance, pace);
      expect(table[table.length - 1].cumulativeTime).toBe(formatted);
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
