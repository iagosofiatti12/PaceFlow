import React from 'react';
import { useRouter } from 'expo-router';
import HistoryTab from '../src/components/HistoryTab';
import type { HistoryItem } from '../src/utils/storage';

/** Aba Histórico. Rota "/history". */
export default function HistoryScreen(): React.ReactElement {
  const router = useRouter();

  // Tocar num item abre a aba Pace com o cálculo restaurado. O `t` (horário do toque)
  // faz a aba Pace recarregar o item mesmo que ele seja o mesmo da última vez.
  const handleSelectItem = (item: HistoryItem): void => {
    router.navigate({ pathname: '/', params: { restore: item.id, t: String(Date.now()) } });
  };

  return <HistoryTab onSelectItem={handleSelectItem} />;
}
