import {
  bestFitnessRun,
  goalProgress,
  personalRecords,
  recordsBrokenBy,
  type RunResult,
} from '../records';

const RACES = [5, 10, 21.0975, 42.195];

const run = (id: string, km: number, seconds: number, date = '2026-10-01'): RunResult => ({
  id,
  distanceKm: km,
  durationSeconds: seconds,
  date,
});

describe('personalRecords', () => {
  it('pega o melhor tempo de cada distância de prova', () => {
    const records = personalRecords(
      [run('a', 10, 3000), run('b', 10, 2900), run('c', 5, 1500), run('d', 7, 2100)],
      RACES,
    );
    expect(records.map((r) => [r.km, r.seconds, r.runId])).toEqual([
      [5, 1500, 'c'],
      [10, 2900, 'b'],
    ]);
    expect(records[1].paceSeconds).toBe(290);
  });

  it('aceita 1% de diferença na distância e ajusta o tempo para a distância exata', () => {
    const [half] = personalRecords([run('m', 21.1, 6330)], [21.0975]);
    expect(half.km).toBe(21.0975);
    expect(half.seconds).toBe(Math.round(6330 * (21.0975 / 21.1)));
    expect(personalRecords([run('x', 10.2, 3000)], [10])).toEqual([]); // 2%: não vale
  });

  it('em empate, fica o treino mais antigo', () => {
    const [record] = personalRecords(
      [run('novo', 5, 1500, '2026-10-02'), run('antigo', 5, 1500, '2026-09-01')],
      [5],
    );
    expect(record.runId).toBe('antigo');
  });
});

describe('recordsBrokenBy', () => {
  const previous = [run('a', 10, 3000), run('b', 5, 1400)];

  it('primeira marca numa distância já é recorde', () => {
    expect(recordsBrokenBy(run('n', 21.0975, 7000), previous, RACES)).toEqual([21.0975]);
  });

  it('só é recorde se for mais rápido', () => {
    expect(recordsBrokenBy(run('n', 10, 2950), previous, RACES)).toEqual([10]);
    expect(recordsBrokenBy(run('n', 10, 3100), previous, RACES)).toEqual([]);
    expect(recordsBrokenBy(run('n', 10, 3000), previous, RACES)).toEqual([]); // empate não conta
  });

  it('treino fora das distâncias de prova não bate recorde', () => {
    expect(recordsBrokenBy(run('n', 8, 2000), previous, RACES)).toEqual([]);
  });
});

describe('bestFitnessRun', () => {
  it('escolhe o treino de maior VDOT com pelo menos 3 km', () => {
    const best = bestFitnessRun([
      run('lento', 10, 3600),
      run('rapido', 5, 1350),
      run('tiro', 1, 200),
    ]);
    expect(best?.id).toBe('rapido');
  });

  it('sem treino de 3 km ou mais, não há base', () => {
    expect(bestFitnessRun([run('tiro', 1, 200)])).toBeNull();
    expect(bestFitnessRun([])).toBeNull();
  });
});

describe('goalProgress', () => {
  const goal = { distanceKm: 10, targetSeconds: 2880 }; // 10K em 48:00

  it('compara com o recorde na distância da meta', () => {
    const progress = goalProgress(goal, [run('a', 10, 2952)]);
    expect(progress).toEqual({
      targetPaceSeconds: 288,
      currentSeconds: 2952,
      source: 'record',
      gapSeconds: 72,
      achieved: false,
    });
  });

  it('meta alcançada quando o recorde é igual ou melhor', () => {
    expect(goalProgress(goal, [run('a', 10, 2870)]).achieved).toBe(true);
  });

  it('sem recorde na distância, estima pelo melhor treino (Riegel)', () => {
    const progress = goalProgress(goal, [run('a', 5, 1400)]);
    expect(progress.source).toBe('prediction');
    expect(progress.currentSeconds).toBe(Math.round(1400 * 2 ** 1.06));
    expect(progress.achieved).toBe(false); // estimativa nunca conta como alcançada
  });

  it('sem nenhum treino, só mostra o pace necessário', () => {
    expect(goalProgress(goal, [])).toEqual({
      targetPaceSeconds: 288,
      currentSeconds: null,
      source: null,
      gapSeconds: null,
      achieved: false,
    });
  });
});
