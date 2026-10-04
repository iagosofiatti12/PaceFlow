import AsyncStorage from '@react-native-async-storage/async-storage';
import { Appearance } from 'react-native';
import { z } from 'zod';

/**
 * Tema escolhido no app: seguir o celular, sempre claro ou sempre escuro.
 * Fica salvo no aparelho e vale a partir da próxima abertura também.
 */
export type ThemePreference = 'system' | 'light' | 'dark';

const STORAGE_KEY = '@paceflow:theme';

// O que vem do aparelho pode estar corrompido: valor estranho vira "seguir o celular"
const preferenceSchema = z.enum(['system', 'light', 'dark']);

/** Lê a preferência salva (padrão: seguir o celular) */
export const loadThemePreference = async (): Promise<ThemePreference> => {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    const parsed = preferenceSchema.safeParse(stored);
    return parsed.success ? parsed.data : 'system';
  } catch {
    return 'system';
  }
};

/** Salva a preferência no aparelho */
export const saveThemePreference = async (preference: ThemePreference): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, preference);
  } catch (error) {
    console.error('Erro ao salvar o tema:', error);
  }
};

/**
 * Aplica o tema no app inteiro. O React Native passa a responder o tema escolhido
 * para o `useColorScheme`, então todas as telas (e o useColors/createThemedStyles)
 * trocam sozinhas. `null` = voltar a seguir o celular.
 */
export const applyThemePreference = (preference: ThemePreference): void => {
  Appearance.setColorScheme(preference === 'system' ? null : preference);
};
