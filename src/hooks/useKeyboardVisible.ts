import { useEffect, useState } from 'react';
import { Keyboard } from 'react-native';

/**
 * true enquanto o teclado está aberto. A barra de abas some nesse momento:
 * no Android a tela encolhe com o teclado, e a barra ocuparia o pouco espaço
 * que sobra para o campo que a pessoa está digitando.
 */
export const useKeyboardVisible = (): boolean => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const show = Keyboard.addListener('keyboardDidShow', () => setVisible(true));
    const hide = Keyboard.addListener('keyboardDidHide', () => setVisible(false));
    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  return visible;
};
