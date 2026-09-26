import { useState, useCallback } from 'react';

/** Máscara de digitação: devolve o texto limpo, ou null para ignorar a tecla */
export type InputMask = (value: string) => string | null;

export interface MaskedField {
  value: string;
  /** Passar direto para o onChangeText do TextInput */
  onChangeText: (value: string) => void;
  /** Passar direto para o onBlur do TextInput: marca o campo como visitado */
  onBlur: () => void;
  /**
   * true depois que a pessoa sai do campo pela primeira vez. Erros só aparecem
   * em campos visitados: ninguém quer ver "formato inválido" no meio da
   * digitação de "5:30", logo depois do "5:".
   */
  touched: boolean;
  clear: () => void;
}

/**
 * Estado de um campo de texto com máscara. Substitui o par
 * useState + handleXChange que se repetia em todas as abas.
 *
 * Ex: const distance = useMaskedField(formatDistanceInput);
 *     <InputField value={distance.value} onChangeText={distance.onChangeText} onBlur={distance.onBlur} />
 */
export const useMaskedField = (mask: InputMask, initialValue = ''): MaskedField => {
  const [value, setValue] = useState<string>(initialValue);
  const [touched, setTouched] = useState<boolean>(false);

  const onChangeText = useCallback(
    (text: string): void => {
      const masked = mask(text);
      if (masked !== null) setValue(masked);
    },
    [mask],
  );

  const onBlur = useCallback((): void => setTouched(true), []);

  // Limpar também "esquece" a visita: o campo volta ao estado inicial
  const clear = useCallback((): void => {
    setValue('');
    setTouched(false);
  }, []);

  return { value, onChangeText, onBlur, touched, clear };
};
