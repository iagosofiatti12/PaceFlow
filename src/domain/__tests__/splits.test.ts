import { generateSplits, negativeSplitPaces, NEGATIVE_SPLIT_FACTOR } from '../splits';
import { calculateTotalTime } from '../pace';

describe('generateSplits', () => {
  it('deve gerar uma linha por km', () => {
    const splits = generateSplits(5, 330); // 5 km a 5:30/km
    expect(splits).toHaveLength(5);
    expect(splits[0]).toEqual({ km: 1, splitSeconds: 330, cumulativeSeconds: 330 });
    expect(splits[4]).toEqual({ km: 5, splitSeconds: 330, cumulativeSeconds: 1650 });
  });

  it('deve adicionar linha extra para distância com decimal', () => {
    const splits = generateSplits(5.5, 300); // 5,5 km a 5:00/km
    expect(splits).toHaveLength(6);
    expect(splits[5]).toEqual({ km: 5.5, splitSeconds: 150, cumulativeSeconds: 1650 });
  });

  it('acumulado da última linha deve bater com calculateTotalTime', () => {
    const splits = generateSplits(10, 330);
    expect(splits[splits.length - 1].cumulativeSeconds).toBe(calculateTotalTime(10, 330));
  });

  it('deve gerar só a linha fracionária para distâncias menores que 1 km', () => {
    expect(generateSplits(0.4, 300)).toEqual([
      { km: 0.4, splitSeconds: 120, cumulativeSeconds: 120 },
    ]);
  });
});

describe('negativeSplitPaces', () => {
  it('segunda metade 2% mais rápida que a primeira', () => {
    const { firstHalf, secondHalf } = negativeSplitPaces(330);
    expect(secondHalf).toBeCloseTo(firstHalf * (1 - NEGATIVE_SPLIT_FACTOR), 10);
    expect(Math.round(firstHalf)).toBe(333); // 5:33
    expect(Math.round(secondHalf)).toBe(327); // 5:27
  });

  it('a média das duas metades é o pace desejado', () => {
    const { firstHalf, secondHalf } = negativeSplitPaces(300);
    expect((firstHalf + secondHalf) / 2).toBeCloseTo(300, 10);
  });
});

describe('generateSplits com negative split', () => {
  it('termina no mesmo tempo final do ritmo constante', () => {
    [5, 10, 21.0975, 42.195].forEach((distance) => {
      const even = generateSplits(distance, 330);
      const negative = generateSplits(distance, 330, 'negative');
      expect(negative[negative.length - 1].cumulativeSeconds).toBe(
        even[even.length - 1].cumulativeSeconds,
      );
    });
  });

  it('primeira metade mais lenta que o pace, segunda mais rápida', () => {
    const splits = generateSplits(10, 300, 'negative');
    expect(splits[0].splitSeconds).toBeGreaterThan(300);
    expect(splits[9].splitSeconds).toBeLessThan(300);
    expect(splits[4].cumulativeSeconds).toBeGreaterThan(1500); // passa na metade atrás do ritmo constante
  });

  it('o km que cruza a metade mistura os dois paces', () => {
    // 5 km: a metade é no km 2,5, dentro do 3º km
    const { firstHalf, secondHalf } = negativeSplitPaces(300);
    const splits = generateSplits(5, 300, 'negative');
    expect(Math.abs(splits[1].splitSeconds - firstHalf)).toBeLessThanOrEqual(1);
    expect(splits[2].splitSeconds).toBeLessThan(firstHalf);
    expect(splits[2].splitSeconds).toBeGreaterThan(secondHalf);
  });

  it('a soma dos parciais é igual ao acumulado final', () => {
    const splits = generateSplits(21.0975, 317, 'negative');
    const sum = splits.reduce((total, row) => total + row.splitSeconds, 0);
    expect(sum).toBe(splits[splits.length - 1].cumulativeSeconds);
  });
});
