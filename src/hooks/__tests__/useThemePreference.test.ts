import AsyncStorage from '@react-native-async-storage/async-storage';
import { act, renderHook, waitFor } from '@testing-library/react-native';
import { Appearance } from 'react-native';
import { useThemePreference } from '../useThemePreference';

jest.mock('@react-native-async-storage/async-storage', () =>
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

describe('useThemePreference', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  it('carrega o tema salvo', async () => {
    await AsyncStorage.setItem('@paceflow:theme', 'light');
    const { result } = renderHook(() => useThemePreference());
    await waitFor(() => expect(result.current[0]).toBe('light'));
  });

  it('trocar aplica na hora e salva', async () => {
    const set = jest.spyOn(Appearance, 'setColorScheme').mockImplementation(() => {});
    const { result } = renderHook(() => useThemePreference());
    await act(async () => result.current[1]('dark'));
    expect(result.current[0]).toBe('dark');
    expect(set).toHaveBeenLastCalledWith('dark');
    expect(await AsyncStorage.getItem('@paceflow:theme')).toBe('dark');
    set.mockRestore();
  });
});
