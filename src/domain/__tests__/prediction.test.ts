import { predictTime, predictRaces, MIN_PREDICTION_KM } from '../prediction';

const RACES = [5, 10, 21.0975, 42.195];

describe('predictTime (fórmula de Riegel)', () => {
  it('bate com os valores de referência', () => {
    // 10K em 50:00
    expect(predictTime(10, 3000, 21.0975)).toBe(6619); // meia em 1:50:19
    expect(predictTime(10, 3000, 42.195)).toBe(13801); // maratona em 3:50:01
    // 5K em 25:00 → 10K em 52:07
    expect(predictTime(5, 1500, 10)).toBe(3127);
  });

  it('a mesma distância devolve o mesmo tempo', () => {
    expect(predictTime(10, 3000, 10)).toBe(3000);
  });

  it('prever uma distância menor dá um pace mais rápido', () => {
    const fiveK = predictTime(10, 3000, 5);
    expect(fiveK).toBeLessThan(1500); // mais rápido que 5:00/km
  });
});

describe('predictRaces', () => {
  it('prevê as outras distâncias, sem repetir a do resultado', () => {
    const predictions = predictRaces(10, 3000, RACES);
    expect(predictions.map((p) => p.km)).toEqual([5, 21.0975, 42.195]);
    expect(predictions[1]).toEqual({ km: 21.0975, seconds: 6619, paceSeconds: 314 });
  });

  it('considera 21,1 km como meia maratona (margem de 1%)', () => {
    expect(predictRaces(21.1, 6300, RACES).map((p) => p.km)).toEqual([5, 10, 42.195]);
  });

  it('não prevê a partir de distâncias curtas demais', () => {
    expect(predictRaces(MIN_PREDICTION_KM - 0.1, 600, RACES)).toEqual([]);
    expect(predictRaces(MIN_PREDICTION_KM, 900, RACES)).toHaveLength(4);
  });
});
