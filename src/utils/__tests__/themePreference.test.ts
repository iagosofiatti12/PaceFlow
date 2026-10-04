import AsyncStorage from '@react-native-async-storage/async-storage';
import { Appearance } from 'react-native';
import { applyThemePreference, loadThemePreference, saveThemePreference } from '../themePreference';

jest.mock('@react-native-async-storage/async-storage', () =>
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

describe('preferência de tema', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    jest.restoreAllMocks();
  });

  it('sem nada salvo, segue o celular', async () => {
    expect(await loadThemePreference()).toBe('system');
  });

  it('salva e lê de volta', async () => {
    await saveThemePreference('dark');
    expect(await loadThemePreference()).toBe('dark');
  });

  it('valor corrompido no aparelho vira "seguir o celular"', async () => {
    await AsyncStorage.setItem('@paceflow:theme', 'roxo');
    expect(await loadThemePreference()).toBe('system');
  });

  it('erro ao ler o aparelho vira "seguir o celular"', async () => {
    jest.spyOn(AsyncStorage, 'getItem').mockRejectedValueOnce(new Error('falhou'));
    expect(await loadThemePreference()).toBe('system');
  });

  it('erro ao salvar não derruba o app', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(AsyncStorage, 'setItem').mockRejectedValueOnce(new Error('cheio'));
    await expect(saveThemePreference('light')).resolves.toBeUndefined();
  });

  it('aplica o tema escolhido, e null para voltar a seguir o celular', () => {
    const set = jest.spyOn(Appearance, 'setColorScheme').mockImplementation(() => {});
    applyThemePreference('light');
    expect(set).toHaveBeenLastCalledWith('light');
    applyThemePreference('system');
    expect(set).toHaveBeenLastCalledWith(null);
  });
});
