import {
  formatTimeInput,
  formatDistanceInput,
  formatPaceInput,
  formatHoursInput,
  formatMinutesInput,
  isTimeFieldComplete,
  formatSpeedInput,
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
  it('deve manter a vírgula decimal', () => {
    expect(formatDistanceInput('10,5')).toBe('10,5');
  });

  it('deve trocar ponto por vírgula (teclados que só têm ponto)', () => {
    expect(formatDistanceInput('10.5')).toBe('10,5');
  });

  it('deve ignorar um segundo separador decimal', () => {
    expect(formatDistanceInput('10,5,')).toBeNull();
    expect(formatDistanceInput('10,5.')).toBeNull();
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

describe('isTimeFieldComplete', () => {
  it('horas: completa só com 2 dígitos', () => {
    expect(isTimeFieldComplete('', 'hours')).toBe(false);
    expect(isTimeFieldComplete('1', 'hours')).toBe(false);
    expect(isTimeFieldComplete('9', 'hours')).toBe(false); // pode ser 9h ou 99h
    expect(isTimeFieldComplete('12', 'hours')).toBe(true);
  });

  it('minutos/segundos: 2 dígitos', () => {
    expect(isTimeFieldComplete('05', 'minutes')).toBe(true);
    expect(isTimeFieldComplete('59', 'minutes')).toBe(true);
  });

  it('minutos/segundos: 1 dígito de 0 a 5 ainda pode ganhar outro dígito', () => {
    expect(isTimeFieldComplete('0', 'minutes')).toBe(false);
    expect(isTimeFieldComplete('5', 'minutes')).toBe(false);
  });

  it('minutos/segundos: 1 dígito de 6 a 9 já está completo', () => {
    expect(isTimeFieldComplete('6', 'minutes')).toBe(true);
    expect(isTimeFieldComplete('9', 'minutes')).toBe(true);
  });

  it('campo vazio nunca está completo', () => {
    expect(isTimeFieldComplete('', 'minutes')).toBe(false);
  });
});

describe('formatSpeedInput', () => {
  it('aceita até 2 dígitos e 1 casa decimal, com vírgula', () => {
    expect(formatSpeedInput('12')).toBe('12');
    expect(formatSpeedInput('12,5')).toBe('12,5');
    expect(formatSpeedInput('9.5')).toBe('9,5');
    expect(formatSpeedInput('')).toBe('');
  });

  it('ignora o terceiro dígito inteiro e a segunda casa decimal', () => {
    expect(formatSpeedInput('123')).toBeNull();
    expect(formatSpeedInput('12,55')).toBeNull();
  });

  it('ignora letras', () => {
    expect(formatSpeedInput('1a')).toBeNull();
  });
});
