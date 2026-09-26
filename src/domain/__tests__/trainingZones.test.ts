import {
  calculateVdot,
  MAX_VDOT,
  MIN_VDOT,
  paceAtIntensity,
  TRAINING_ZONES,
  trainingPaces,
} from '../trainingZones';

describe('calculateVdot', () => {
  it('confere com as tabelas de Daniels', () => {
    expect(calculateVdot(10, 50 * 60)).toBeCloseTo(40, 0); // 10K em 50:00 → VDOT 40
    expect(calculateVdot(5, 19 * 60 + 57)).toBeCloseTo(50, 0); // 5K em 19:57 → VDOT 50
  });

  it('quanto mais rápido, maior o VDOT', () => {
    expect(calculateVdot(10, 45 * 60)).toBeGreaterThan(calculateVdot(10, 50 * 60));
  });
});

describe('paceAtIntensity', () => {
  it('ritmos do VDOT 40 batem com a tabela de Daniels (±3 s)', () => {
    // Tabela: maratona 5:29, limiar 5:06, intervalado 4:42, repetição 4:25
    expect(Math.abs(paceAtIntensity(40, 0.8) - 329)).toBeLessThanOrEqual(3);
    expect(Math.abs(paceAtIntensity(40, 0.88) - 306)).toBeLessThanOrEqual(3);
    expect(Math.abs(paceAtIntensity(40, 0.975) - 282)).toBeLessThanOrEqual(3);
    expect(Math.abs(paceAtIntensity(40, 1.05) - 265)).toBeLessThanOrEqual(3);
  });

  it('intensidade maior dá pace mais rápido', () => {
    expect(paceAtIntensity(45, 0.9)).toBeLessThan(paceAtIntensity(45, 0.7));
  });
});

describe('trainingPaces', () => {
  it('10K em 50:00: as cinco zonas, da mais leve à mais forte', () => {
    const paces = trainingPaces(10, 3000);
    expect(paces?.map((p) => p.zone)).toEqual(TRAINING_ZONES);
    expect(paces?.[0]).toEqual({ zone: 'easy', fastSeconds: 367, slowSeconds: 403 }); // 6:07–6:43
    expect(paces?.[2]).toEqual({ zone: 'threshold', fastSeconds: 305, slowSeconds: 305 });
  });

  it('cada zona é mais rápida que a anterior', () => {
    const paces = trainingPaces(21.0975, 6300) ?? [];
    for (let i = 1; i < paces.length; i++) {
      expect(paces[i].fastSeconds).toBeLessThan(paces[i - 1].fastSeconds);
    }
  });

  it('não calcula com base curta demais (menos de 3 km)', () => {
    expect(trainingPaces(1, 240)).toBeNull();
  });

  it('não calcula fora da faixa confiável de VDOT', () => {
    expect(calculateVdot(5, 80 * 60)).toBeLessThan(MIN_VDOT);
    expect(trainingPaces(5, 80 * 60)).toBeNull(); // caminhada
    expect(calculateVdot(10, 20 * 60)).toBeGreaterThan(MAX_VDOT);
    expect(trainingPaces(10, 20 * 60)).toBeNull(); // mais rápido que o recorde mundial
  });
});
