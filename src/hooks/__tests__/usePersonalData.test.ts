import AsyncStorage from '@react-native-async-storage/async-storage';
import { act, renderHook, waitFor } from '@testing-library/react-native';
import { usePersonalData } from '../usePersonalData';

jest.mock('@react-native-async-storage/async-storage', () =>
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

const run = { date: '2026-10-01', type: 'race' as const };

describe('usePersonalData', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  it('carrega vazio na primeira vez', async () => {
    const { result } = renderHook(() => usePersonalData());
    await waitFor(() => expect(result.current.loaded).toBe(true));
    expect(result.current.profile).toBeNull();
    expect(result.current.runs).toEqual([]);
    expect(result.current.goal).toBeNull();
  });

  it('registrar treino avisa os recordes batidos', async () => {
    const { result } = renderHook(() => usePersonalData());
    await waitFor(() => expect(result.current.loaded).toBe(true));

    let broken: number[] = [];
    await act(async () => {
      broken = await result.current.logRun({ ...run, distanceKm: 10, durationSeconds: 3000 });
    });
    expect(broken).toEqual([10]);

    await act(async () => {
      broken = await result.current.logRun({ ...run, distanceKm: 10, durationSeconds: 3100 });
    });
    expect(broken).toEqual([]); // mais lento: não é recorde
    expect(result.current.runs).toHaveLength(2);

    await act(async () => result.current.removeRun(result.current.runs[0].id));
    expect(result.current.runs).toHaveLength(1);
  });

  it('salva nome e meta, e remove a meta', async () => {
    const { result } = renderHook(() => usePersonalData());
    await waitFor(() => expect(result.current.loaded).toBe(true));

    await act(async () => result.current.setName('Iago'));
    expect(result.current.profile).toEqual({ name: 'Iago' });

    await act(async () => result.current.setGoal({ distanceKm: 10, targetSeconds: 2880 }));
    expect(result.current.goal).toEqual({ distanceKm: 10, targetSeconds: 2880 });

    await act(async () => result.current.setGoal(null));
    expect(result.current.goal).toBeNull();
    expect(await AsyncStorage.getItem('@paceflow:goal')).toBeNull();
  });
});
