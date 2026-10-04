import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  addRun,
  clearGoal,
  deleteRun,
  getGoal,
  getProfile,
  getRuns,
  saveGoal,
  saveProfile,
} from '../personalStorage';
import { parseStoredRuns } from '../personalSchema';

jest.mock('@react-native-async-storage/async-storage', () =>
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

const base = { distanceKm: 10, durationSeconds: 3000, type: 'easy' as const };

describe('diário de treinos', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  it('começa vazio', async () => {
    expect(await getRuns()).toEqual([]);
  });

  it('registra treinos e devolve do mais recente para o mais antigo (pelo dia)', async () => {
    const antigo = await addRun({ ...base, date: '2026-09-01' });
    const novo = await addRun({ ...base, date: '2026-10-01', note: 'Longão no parque' });
    const runs = await getRuns();
    expect(runs.map((r) => r.id)).toEqual([novo.id, antigo.id]);
    expect(runs[0].note).toBe('Longão no parque');
  });

  it('exclui um treino', async () => {
    const run = await addRun({ ...base, date: '2026-10-01' });
    await deleteRun(run.id);
    expect(await getRuns()).toEqual([]);
  });

  it('descarta só os treinos estragados', () => {
    const valid = {
      id: 'a',
      date: '2026-10-01',
      distanceKm: 5,
      durationSeconds: 1500,
      type: 'race',
      createdAt: '2026-10-01T10:00:00.000Z',
    };
    expect(
      parseStoredRuns({ version: 1, items: [valid, { ...valid, id: 'b', type: 'voando' }] }),
    ).toHaveLength(1);
    expect(parseStoredRuns('lixo')).toEqual([]);
  });

  it('JSON corrompido no aparelho vira diário vazio', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    await AsyncStorage.setItem('@paceflow:runs', '{quebrado');
    expect(await getRuns()).toEqual([]);
  });
});

describe('perfil e meta', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  it('salva o nome sem espaços nas pontas', async () => {
    expect(await getProfile()).toBeNull();
    await saveProfile({ name: '  Iago ' });
    expect(await getProfile()).toEqual({ name: 'Iago' });
  });

  it('salva, lê e apaga a meta', async () => {
    expect(await getGoal()).toBeNull();
    await saveGoal({ distanceKm: 10, targetSeconds: 2880 });
    expect(await getGoal()).toEqual({ distanceKm: 10, targetSeconds: 2880 });
    await clearGoal();
    expect(await getGoal()).toBeNull();
  });
});
