import { useEffect, useRef, type RefObject } from 'react';
import { isTimeFieldComplete } from '../format/masks';

/** O mínimo que o hook precisa de um campo de texto (o TextInput tem isso) */
export interface FocusableInput {
  isFocused: () => boolean;
  focus: () => void;
}

/**
 * Pula o cursor para o próximo campo quando o atual fica completo
 * (ex: digitou "12" nas horas → vai para os minutos).
 *
 * Só pula quando a pessoa DIGITOU (o texto cresceu) e o campo está com foco.
 * Assim, apagar um dígito ou abrir um cálculo restaurado do histórico
 * não tira o cursor do lugar.
 */
export const useAutoAdvance = (
  value: string,
  field: 'hours' | 'minutes',
  currentRef: RefObject<FocusableInput | null>,
  nextRef: RefObject<FocusableInput | null>,
): void => {
  const previous = useRef(value);

  useEffect(() => {
    const grew = value.length > previous.current.length;
    previous.current = value;

    if (grew && currentRef.current?.isFocused() && isTimeFieldComplete(value, field)) {
      nextRef.current?.focus();
    }
  }, [value, field, currentRef, nextRef]);
};
