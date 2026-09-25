import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, Pressable, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import { SPACING, RADIUS, FONT_SIZES, FONTS } from '../constants/theme';
import { getHistory, deleteHistoryItem, clearHistory, type HistoryItem } from '../utils/storage';
import { formatRelativeDate } from '../format/dates';
import { formatPace, formatSecondsToTime } from '../format/time';
import { calculatePace } from '../domain/pace';
import Card from './ui/Card';
import { createThemedStyles, useColors } from '../hooks/useTheme';

interface HistoryTabProps {
  onSelectItem: (item: HistoryItem) => void;
}

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
  const renderItem = ({ item }: { item: HistoryItem }): React.ReactElement => {
    // O histórico guarda números; o texto é montado só na hora de mostrar
    const relativeDate = formatRelativeDate(item.createdAt);
    const pace = formatPace(calculatePace(item.durationSeconds, item.distanceKm));
    const distance = item.distanceKm.toString();
    const time = formatSecondsToTime(item.durationSeconds);

    return (
      <View style={styles.historyItem}>
        <Pressable
          style={({ pressed }) => [styles.itemContent, pressed && styles.pressed]}
          onPress={() => onSelectItem(item)}
          accessibilityRole="button"
          accessibilityLabel={`Pace ${pace} por km, ${distance} km em ${time}, ${relativeDate}`}
          accessibilityHint="Toque para abrir este cálculo na aba Pace"
        >
          <View style={styles.itemHeader}>
            <Ionicons name="speedometer" size={16} color={colors.accent} />
            <Text style={styles.itemPace}>{pace} /km</Text>
          </View>

          <View style={styles.itemDetails}>
            <View style={styles.detailRow}>
              <Ionicons name="navigate" size={12} color={colors.text.secondary} />
              <Text style={styles.detailText}>{distance} km</Text>
            </View>
            <View style={styles.detailRow}>
              <Ionicons name="time" size={12} color={colors.text.secondary} />
              <Text style={styles.detailText}>{time}</Text>
            </View>
          </View>

          <Text style={styles.itemDate}>{relativeDate}</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [styles.deleteButton, pressed && styles.pressed]}
          onPress={() => handleDelete(item.id)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          accessibilityRole="button"
          accessibilityLabel={`Excluir cálculo de ${distance} km`}
          accessibilityHint="Pede confirmação antes de excluir"
        >
          <Ionicons name="trash-outline" size={20} color={colors.danger} />
        </Pressable>
      </View>
    );
  };

  if (history.length === 0) {
    return (
      <Card style={styles.emptyContainer}>
        <Ionicons name="time-outline" size={64} color={colors.iconMuted} />
        <Text style={styles.emptyTitle}>Nenhum cálculo salvo</Text>
        <Text style={styles.emptyDescription}>
          Seus cálculos de pace aparecerão aqui automaticamente
        </Text>
      </Card>
    );
  }

  return (
    <Card style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Histórico</Text>
        <Pressable
          onPress={handleClearAll}
          style={({ pressed }) => [styles.clearButton, pressed && styles.pressed]}
          accessibilityRole="button"
          accessibilityLabel="Limpar todo o histórico"
          accessibilityHint="Pede confirmação antes de apagar todos os cálculos"
        >
          <Text style={styles.clearButtonText}>Limpar tudo</Text>
        </Pressable>
      </View>

      <FlatList
        data={history}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        onRefresh={handleRefresh}
        refreshing={refreshing}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </Card>
  );
};

const useStyles = createThemedStyles((colors) => ({
  clearButton: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
  },
  clearButtonText: {
    color: colors.danger,
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.sm,
  },
  container: {
    flex: 1,
  },
  deleteButton: {
    padding: SPACING.xs,
  },
  detailRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
  },
  detailText: {
    color: colors.text.secondary,
    fontFamily: FONTS.mono,
    fontSize: FONT_SIZES.sm,
    fontVariant: ['tabular-nums'],
  },
  emptyContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    padding: SPACING.xxl,
  },
  emptyDescription: {
    color: colors.text.secondary,
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.md,
    marginTop: SPACING.sm,
    textAlign: 'center',
  },
  emptyTitle: {
    color: colors.text.primary,
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZES.xl,
    marginTop: SPACING.md,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  // Mais respiro entre e dentro dos itens (ver DESIGN.md)
  historyItem: {
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: RADIUS.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm + 2,
  },
  itemContent: {
    flex: 1,
  },
  itemDate: {
    color: colors.text.tertiary,
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.xs,
    marginTop: 2,
  },
  itemDetails: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginTop: 2,
  },
  itemHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: SPACING.xs,
  },
  // O pace é a âncora visual do item (ver DESIGN.md)
  itemPace: {
    color: colors.text.primary,
    fontFamily: FONTS.monoSemiBold,
    fontSize: FONT_SIZES.lg,
    fontVariant: ['tabular-nums'],
  },
  list: {
    paddingBottom: 0,
  },
  // Mesmo retorno visual do TouchableOpacity (activeOpacity 0.7), agora com Pressable
  pressed: {
    opacity: 0.7,
  },
  title: {
    color: colors.text.primary,
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZES.xxl,
  },
}));

export default HistoryTab;
