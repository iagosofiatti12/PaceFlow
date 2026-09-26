import { evaluatePaceForm, evaluateDistancePaceForm, shouldShowError } from '../forms';

const blankPace = { distance: '', hours: '', minutes: '', seconds: '' };

describe('evaluatePaceForm', () => {
  it('formulário vazio: sem resultado e sem erros', () => {
    expect(evaluatePaceForm(blankPace)).toEqual({ value: null, errors: {} });
  });

  it('só a distância preenchida: sem resultado, mas sem erro no tempo vazio', () => {
    expect(evaluatePaceForm({ ...blankPace, distance: '10' })).toEqual({
      value: null,
      errors: {},
    });
  });

  it('tudo válido: calcula distância, duração e pace', () => {
    expect(evaluatePaceForm({ distance: '10', hours: '', minutes: '50', seconds: '' })).toEqual({
      value: { distanceKm: 10, durationSeconds: 3000, paceSeconds: 300 },
      errors: {},
    });
  });

  it('aceita vírgula decimal na distância', () => {
    const { value } = evaluatePaceForm({
      distance: '21,1',
      hours: '2',
      minutes: '6',
      seconds: '36',
    });
    expect(value?.paceSeconds).toBe(360);
  });

  it('distância fora do limite: erro na distância e sem resultado', () => {
    expect(evaluatePaceForm({ ...blankPace, distance: '600', minutes: '50' })).toEqual({
      value: null,
      errors: { distance: 'distance.max' },
    });
  });

  it('distância só com vírgula: erro de distância inválida', () => {
    expect(evaluatePaceForm({ ...blankPace, distance: ',' }).errors).toEqual({
      distance: 'distance.empty',
    });
  });

  it('tempo zerado digitado: erro no tempo', () => {
    expect(evaluatePaceForm({ distance: '10', hours: '0', minutes: '00', seconds: '' })).toEqual({
      value: null,
      errors: { time: 'time.empty' },
    });
  });

  it('pode ter erro nos dois campos ao mesmo tempo', () => {
    expect(
      evaluatePaceForm({ distance: '0', hours: '0', minutes: '', seconds: '' }).errors,
    ).toEqual({ distance: 'distance.min', time: 'time.empty' });
  });
});

describe('evaluateDistancePaceForm', () => {
  it('formulário vazio: sem resultado e sem erros', () => {
    expect(evaluateDistancePaceForm({ distance: '', pace: '' })).toEqual({
      value: null,
      errors: {},
    });
  });

  it('tudo válido: calcula o tempo total', () => {
    expect(evaluateDistancePaceForm({ distance: '21,1', pace: '6:00' })).toEqual({
      value: { distanceKm: 21.1, paceSeconds: 360, totalSeconds: 7596 },
      errors: {},
    });
  });

  it('pace pela metade ("5:"): erro de formato e sem resultado', () => {
    expect(evaluateDistancePaceForm({ distance: '10', pace: '5:' })).toEqual({
      value: null,
      errors: { pace: 'pace.format' },
    });
  });

  it('pace vazio com distância preenchida: sem erro', () => {
    expect(evaluateDistancePaceForm({ distance: '10', pace: '' }).errors).toEqual({});
  });

  it('distância inválida e pace válido: só o erro da distância', () => {
    expect(evaluateDistancePaceForm({ distance: '0,05', pace: '5:00' })).toEqual({
      value: null,
      errors: { distance: 'distance.min' },
    });
  });
});

describe('shouldShowError', () => {
  it('sem erro: não mostra nada', () => {
    expect(shouldShowError(undefined, true)).toBe(false);
  });

  it('erro de limite: aparece na hora, mesmo sem sair do campo', () => {
    expect(shouldShowError('distance.max', false)).toBe(true);
    expect(shouldShowError('time.max', false)).toBe(true);
    expect(shouldShowError('pace.range', false)).toBe(true);
  });

  it('erro de digitação incompleta: espera a pessoa sair do campo', () => {
    expect(shouldShowError('pace.format', false)).toBe(false);
    expect(shouldShowError('pace.format', true)).toBe(true);
    expect(shouldShowError('time.empty', false)).toBe(false);
    expect(shouldShowError('pace.zero', false)).toBe(false);
    // "0" é o começo de "0,5": abaixo do mínimo também espera sair do campo
    expect(shouldShowError('distance.min', false)).toBe(false);
    expect(shouldShowError('distance.min', true)).toBe(true);
    expect(shouldShowError('distance.empty', true)).toBe(true);
  });
});
