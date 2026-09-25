import { useState, useCallback } from 'react';

/** Máscara de digitação: devolve o texto limpo, ou null para ignorar a tecla */
export type InputMask = (value: string) => string | null;

export interface MaskedField {
  value: string;
  /** Passar direto para o onChangeText do TextInput */
  onChangeText: (value: string) => void;
  clear: () => void;
}

/**
 * Estado de um campo de texto com máscara. Substitui o par
 * useState + handleXChange que se repetia em todas as abas.
 *
 * Ex: const distance = useMaskedField(formatDistanceInput);
 *     <InputField value={distance.value} onChangeText={distance.onChangeText} />
 */
export const useMaskedField = (mask: InputMask, initialValue = ''): MaskedField => {
  const [value, setValue] = useState<string>(initialValue);

  const onChangeText = useCallback(
    (text: string): void => {
      const masked = mask(text);
      if (masked !== null) setValue(masked);
    },
    [mask],
  );

  const clear = useCallback((): void => setValue(''), []);

  return { value, onChangeText, clear };
};
