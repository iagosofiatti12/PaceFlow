import React, { useState, useCallback } from 'react';
import { View, Text, Alert } from 'react-native';
import Animated, { FadeOutLeft } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import { SPACING, RADIUS, FONT_SIZES, FONTS, FONT_SCALE, MOTION } from '../constants/theme';
import { getHistory, deleteHistoryItem, clearHistory, type HistoryItem } from '../utils/storage';
import { formatRelativeDate } from '../format/dates';
import { formatPace, formatSecondsToTime } from '../format/time';
import { formatKm } from '../format/distance';
import { calculatePace } from '../domain/pace';
import Card from './ui/Card';
import ScreenHeader from './ui/ScreenHeader';
import ClearButton from './ui/ClearButton';
import PressableScale from './ui/PressableScale';
import { enterItem, layoutSpring } from './ui/motion';
import { createThemedStyles, useColors } from '../hooks/useTheme';

interface HistoryTabProps {
  onSelectItem: (item: HistoryItem) => void;
}

// Item excluído sai deslizando para a esquerda; os de baixo sobem com uma mola
const exitItem = FadeOutLeft.duration(MOTION.duration.slow);

const HistoryTab: React.FC<HistoryTabProps> = ({ onSelectItem }) => {
  const styles = useStyles();
  const colors = useColors();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const loadHistory = useCallback(async (): Promise<void> => {
    const data = await getHistory();
    setHistory(data);
  }, []);

  // Recarrega sempre que a aba ganha foco. Com o Expo Router as abas ficam
  // montadas ao trocar, então um useEffect de "montou" rodaria só uma vez
  // e cálculos novos não apareceriam
  useFocusEffect(
    useCallback(() => {
      loadHistory();
    }, [loadHistory]),
  );

  const handleRefresh = async (): Promise<void> => {
    setRefreshing(true);
    await loadHistory();
    setRefreshing(false);
  };

  const handleDelete = (id: string): void => {
    Alert.alert('Excluir cálculo', 'Tem certeza que deseja excluir este cálculo do histórico?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          await deleteHistoryItem(id);
          await loadHistory();
        },
      },
    ]);
  };

  const handleClearAll = (): void => {
    Alert.alert('Limpar histórico', 'Tem certeza que deseja limpar todo o histórico?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Limpar tudo',
        style: 'destructive',
        onPress: async () => {
          await clearHistory();
          await loadHistory();
        },
      },
    ]);
  };

  // A linha é um container comum com dois botões irmãos (restaurar e excluir).
  // Botão dentro de botão confunde o leitor de tela, que não sabe qual ação anunciar.
  const renderItem = ({
    item,
    index,
  }: {
    item: HistoryItem;
    index: number;
  }): React.ReactElement => {
    // O histórico guarda números; o texto é montado só na hora de mostrar
    const relativeDate = formatRelativeDate(item.createdAt);
    const pace = formatPace(calculatePace(item.durationSeconds, item.distanceKm));
    const distance = formatKm(item.distanceKm);
    const time = formatSecondsToTime(item.durationSeconds);

    return (
      <Animated.View style={styles.historyItem} entering={enterItem(index)} exiting={exitItem}>
        <PressableScale
          style={styles.itemContent}
          scaleTo={0.98}
          onPress={() => onSelectItem(item)}
          accessibilityRole="button"
          accessibilityLabel={`Pace ${pace} por km, ${distance} km em ${time}, ${relativeDate}`}
          accessibilityHint="Toque para abrir este cálculo na aba Pace"
        >
          <View style={styles.itemIcon}>
            <Ionicons name="speedometer" size={20} color={colors.accent} />
          </View>
          <View style={styles.itemText}>
            <Text style={styles.itemPace} maxFontSizeMultiplier={FONT_SCALE.control}>
              {pace} <Text style={styles.itemPaceUnit}>/km</Text>
            </Text>
            <Text style={styles.itemDetails} maxFontSizeMultiplier={FONT_SCALE.control}>
              {distance} km · {time}
            </Text>
            <Text style={styles.itemDate}>{relativeDate}</Text>
          </View>
        </PressableScale>

        <PressableScale
          style={styles.deleteButton}
          onPress={() => handleDelete(item.id)}
          hitSlop={10}
          accessibilityRole="button"
          accessibilityLabel={`Excluir cálculo de ${distance} km`}
          accessibilityHint="Pede confirmação antes de excluir"
        >
          <Ionicons name="trash-outline" size={20} color={colors.danger} />
        </PressableScale>
      </Animated.View>
    );
  };

  const header = (
    <ScreenHeader
      title="Histórico"
      description="Toque num cálculo para abrir de novo na aba Pace"
      action={
        <ClearButton
          visible={history.length > 0}
          destructive
          title="Limpar tudo"
          onPress={handleClearAll}
          accessibilityLabel="Limpar todo o histórico"
          accessibilityHint="Pede confirmação antes de apagar todos os cálculos"
        />
      }
    />
  );

  return (
    <Animated.FlatList
      data={history}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      itemLayoutAnimation={layoutSpring}
      ListHeaderComponent={header}
      ListEmptyComponent={
        <Card appear style={styles.emptyContainer}>
          <View style={styles.emptyIcon}>
            <Ionicons name="bookmark-outline" size={36} color={colors.accent} />
          </View>
          <Text style={styles.emptyTitle}>Nenhum cálculo salvo</Text>
          <Text style={styles.emptyDescription}>
            Na aba Pace, toque em “Salvar no histórico” e o cálculo aparece aqui.
          </Text>
        </Card>
      }
      onRefresh={handleRefresh}
      refreshing={refreshing}
      contentContainerStyle={styles.list}
      showsVerticalScrollIndicator={false}
    />
  );
};

const useStyles = createThemedStyles((colors) => ({
  deleteButton: {
    alignItems: 'center',
    borderRadius: RADIUS.pill,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: SPACING.xxl,
  },
  emptyDescription: {
    color: colors.text.secondary,
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.md,
    lineHeight: 22,
    marginTop: SPACING.sm,
    textAlign: 'center',
  },
  emptyIcon: {
    alignItems: 'center',
    backgroundColor: colors.accentSoft,
    borderRadius: RADIUS.pill,
    height: 72,
    justifyContent: 'center',
    width: 72,
  },
  emptyTitle: {
    color: colors.text.primary,
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZES.xl,
    marginTop: SPACING.md,
  },
  // Cada cálculo é um cartão próprio
  historyItem: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    flexDirection: 'row',
    marginBottom: SPACING.sm,
    paddingLeft: SPACING.md,
    paddingRight: SPACING.xs,
    paddingVertical: SPACING.md - 4,
  },
  itemContent: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    gap: SPACING.md - 4,
  },
  itemDate: {
    color: colors.text.tertiary,
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.xs,
    marginTop: 2,
  },
  itemDetails: {
    color: colors.text.secondary,
    fontFamily: FONTS.mono,
    fontSize: FONT_SIZES.sm,
    fontVariant: ['tabular-nums'],
  },
  itemIcon: {
    alignItems: 'center',
    backgroundColor: colors.accentSoft,
    borderRadius: RADIUS.lg,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  // O pace é a âncora visual do item (ver DESIGN.md)
  itemPace: {
    color: colors.text.primary,
    fontFamily: FONTS.monoSemiBold,
    fontSize: FONT_SIZES.xl,
    fontVariant: ['tabular-nums'],
  },
  itemPaceUnit: {
    color: colors.text.tertiary,
    fontFamily: FONTS.mono,
    fontSize: FONT_SIZES.sm,
  },
  itemText: {
    flex: 1,
  },
  list: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xl,
  },
}));

export default HistoryTab;
