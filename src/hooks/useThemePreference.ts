import { useCallback, useEffect, useRef, useState } from 'react';
import {
  applyThemePreference,
  loadThemePreference,
  saveThemePreference,
  type ThemePreference,
} from '../utils/themePreference';

/**
 * Tema escolhido no app e a função para trocar. Trocar aplica na hora
 * (todas as telas mudam de cor) e salva para a próxima vez.
 */
export const useThemePreference = (): [ThemePreference, (value: ThemePreference) => void] => {
  const [preference, setPreference] = useState<ThemePreference>('system');
  // Se a pessoa trocar antes de a leitura do aparelho terminar, a escolha dela vale
  const changedByUser = useRef(false);

  useEffect(() => {
    let active = true;
    loadThemePreference().then((stored) => {
      if (active && !changedByUser.current) setPreference(stored);
    });
    return () => {
      active = false;
    };
  }, []);

  const change = useCallback((value: ThemePreference): void => {
    changedByUser.current = true;
    setPreference(value);
    applyThemePreference(value);
    saveThemePreference(value);
  }, []);

  return [preference, change];
};
