import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import HistoryTab from '../src/components/HistoryTab';
import { SPACING } from '../src/constants/theme';
import type { HistoryItem } from '../src/utils/storage';

/** Aba Histórico. Rota "/history". */
export default function HistoryScreen(): React.ReactElement {
  const router = useRouter();

  // Tocar num item abre a aba Pace com o cálculo restaurado. O `t` (horário do toque)
  // faz a aba Pace recarregar o item mesmo que ele seja o mesmo da última vez.
  const handleSelectItem = (item: HistoryItem): void => {
    router.navigate({ pathname: '/', params: { restore: item.id, t: String(Date.now()) } });
  };

  return (
    <View style={styles.container}>
      <HistoryTab onSelectItem={handleSelectItem} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: SPACING.xl + 20,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
  },
});
