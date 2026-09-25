import { generateSplits } from '../splits';
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
