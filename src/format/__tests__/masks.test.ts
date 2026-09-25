import {
  formatTimeInput,
  formatDistanceInput,
  formatPaceInput,
  formatHoursInput,
  formatMinutesInput,
} from '../masks';

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

describe('formatHoursInput / formatMinutesInput', () => {
  it('deve limitar horas a 99', () => {
    expect(formatHoursInput('42')).toBe('42');
    expect(formatHoursInput('120')).toBe('99');
  });

  it('deve limitar minutos e segundos a 59', () => {
    expect(formatMinutesInput('59')).toBe('59');
    expect(formatMinutesInput('60')).toBe('59');
  });
});
