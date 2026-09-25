import React, { useEffect, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import PaceCalculator from '../src/components/PaceCalculator';
import KeyboardScreen from '../src/components/ui/KeyboardScreen';
import { findHistoryItem, type HistoryItem } from '../src/utils/storage';

// Parâmetros que a aba Histórico manda ao restaurar um cálculo:
// `restore` é o id do item e `t` muda a cada toque (ver abaixo)
type PaceParams = { restore?: string; t?: string };

/** Aba Pace. Rota "/" (é a primeira aba, aberta ao iniciar o app). */
export default function PaceScreen(): React.ReactElement {
  const { restore, t } = useLocalSearchParams<PaceParams>();
  const [restoredItem, setRestoredItem] = useState<HistoryItem | null>(null);

  useEffect(() => {
    if (!restore) return;
    findHistoryItem(restore).then(setRestoredItem);
  }, [restore, t]);

  return (
    <KeyboardScreen>
      {/* A `key` muda a cada restauração, forçando o React a recriar a calculadora
          já preenchida. O `t` garante isso mesmo ao tocar duas vezes no mesmo item. */}
      <PaceCalculator
        key={restoredItem ? `${restoredItem.id}-${t}` : 'blank'}
        initialItem={restoredItem}
      />
    </KeyboardScreen>
  );
}
