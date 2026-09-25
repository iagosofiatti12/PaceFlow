import { validateDistance, validateTime, validatePace } from '../rules';
import { MAX_TIME_SECONDS } from '../../domain/limits';

describe('validateDistance', () => {
  it('deve validar distância válida e devolver o número', () => {
    expect(validateDistance('10')).toEqual({ valid: true, value: 10 });
    expect(validateDistance('21.0975')).toEqual({ valid: true, value: 21.0975 });
  });

  it('deve rejeitar distância vazia', () => {
    expect(validateDistance('')).toEqual({ valid: false, error: 'distance.empty' });
  });

  it('deve rejeitar distância maior que 500km', () => {
    expect(validateDistance('501')).toEqual({ valid: false, error: 'distance.range' });
  });

  it('deve rejeitar distância zero', () => {
    expect(validateDistance('0')).toEqual({ valid: false, error: 'distance.range' });
  });

  it('deve rejeitar distância menor que 0.1 km', () => {
    expect(validateDistance('0.05')).toEqual({ valid: false, error: 'distance.range' });
  });

  it('deve aceitar exatamente os limites 0.1 e 500', () => {
    expect(validateDistance('0.1').valid).toBe(true);
    expect(validateDistance('500').valid).toBe(true);
  });
});

describe('validateTime', () => {
  it('deve validar tempo válido e devolver o total em segundos', () => {
    expect(validateTime('0', '30', '0')).toEqual({ valid: true, value: 1800 });
  });

  it('deve rejeitar tempo zero', () => {
    expect(validateTime('0', '0', '0')).toEqual({ valid: false, error: 'time.empty' });
  });

  it('deve aceitar tempos acima de 24 horas (ultramaratonas)', () => {
    expect(validateTime('25', '0', '0')).toEqual({ valid: true, value: 90000 });
  });

  it('deve aceitar exatamente o limite de 99:59:59', () => {
    expect(validateTime('99', '59', '59')).toEqual({ valid: true, value: MAX_TIME_SECONDS });
  });

  it('deve rejeitar tempo maior que 99:59:59', () => {
    // formatTimeInput já impede isso na digitação; a validação é a segunda barreira
    expect(validateTime('100', '0', '0')).toEqual({ valid: false, error: 'time.max' });
  });

  it('deve tratar campos vazios como zero', () => {
    expect(validateTime('', '45', '')).toEqual({ valid: true, value: 2700 });
  });
});

describe('validatePace', () => {
  it('deve aceitar pace válido e devolver os segundos', () => {
    expect(validatePace('5:30')).toEqual({ valid: true, value: 330 });
    expect(validatePace('20:00')).toEqual({ valid: true, value: 1200 });
  });

  it('deve rejeitar pace vazio', () => {
    expect(validatePace('')).toEqual({ valid: false, error: 'pace.empty' });
    expect(validatePace('   ')).toEqual({ valid: false, error: 'pace.empty' });
  });

  it('deve rejeitar formato inválido', () => {
    expect(validatePace('530')).toEqual({ valid: false, error: 'pace.format' });
    expect(validatePace('5:7')).toEqual({ valid: false, error: 'pace.format' });
    expect(validatePace('5:70')).toEqual({ valid: false, error: 'pace.format' });
  });

  it('deve rejeitar pace acima de 20:00', () => {
    expect(validatePace('21:00')).toEqual({ valid: false, error: 'pace.range' });
    expect(validatePace('20:01')).toEqual({ valid: false, error: 'pace.range' });
    expect(validatePace('20:59')).toEqual({ valid: false, error: 'pace.range' });
  });

  it('deve rejeitar pace zero', () => {
    expect(validatePace('0:00')).toEqual({ valid: false, error: 'pace.zero' });
  });
});
