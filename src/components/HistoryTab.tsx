import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, FONT_SIZES, FONTS } from '../constants/theme';
import { getHistory, deleteHistoryItem, clearHistory, type HistoryItem } from '../utils/storage';
import Card from './ui/Card';

interface HistoryTabProps {
  onSelectItem: (item: HistoryItem) => void;
}

const HistoryTab: React.FC<HistoryTabProps> = ({ onSelectItem }) => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const loadHistory = async (): Promise<void> => {
    const data = await getHistory();
    setHistory(data);
  };

  useEffect(() => {
    loadHistory();
  }, []);

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

  const formatDate = (isoDate: string): string => {
    const date = new Date(isoDate);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Hoje';
    if (diffDays === 1) return 'Ontem';
    if (diffDays < 7) return `${diffDays} dias atrás`;

    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
    });
  };

  const renderItem = ({ item }: { item: HistoryItem }): React.ReactElement => (
    <TouchableOpacity
      style={styles.historyItem}
      onPress={() => onSelectItem(item)}
      activeOpacity={0.7}
    >
      <View style={styles.itemContent}>
        <View style={styles.itemHeader}>
          <Ionicons name="speedometer" size={16} color={COLORS.primary} />
          <Text style={styles.itemPace}>{item.pace} /km</Text>
        </View>

        <View style={styles.itemDetails}>
          <View style={styles.detailRow}>
            <Ionicons name="navigate" size={12} color={COLORS.text.secondary} />
            <Text style={styles.detailText}>{item.distance} km</Text>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="time" size={12} color={COLORS.text.secondary} />
            <Text style={styles.detailText}>{item.time}</Text>
          </View>
        </View>

        <Text style={styles.itemDate}>{formatDate(item.date)}</Text>
      </View>

      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDelete(item.id)}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Ionicons name="trash-outline" size={20} color={COLORS.danger} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  if (history.length === 0) {
    return (
      <Card style={styles.emptyContainer}>
        <Ionicons name="time-outline" size={64} color={COLORS.text.light} />
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
        <TouchableOpacity onPress={handleClearAll} style={styles.clearButton}>
          <Text style={styles.clearButtonText}>Limpar tudo</Text>
        </TouchableOpacity>
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

const styles = StyleSheet.create({
  clearButton: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
  },
  clearButtonText: {
    color: COLORS.danger,
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
    color: COLORS.text.secondary,
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
    color: COLORS.text.secondary,
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.md,
    marginTop: SPACING.sm,
    textAlign: 'center',
  },
  emptyTitle: {
    color: COLORS.text.primary,
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
    backgroundColor: COLORS.background,
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
    color: COLORS.text.light,
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
    color: COLORS.text.primary,
    fontFamily: FONTS.monoSemiBold,
    fontSize: FONT_SIZES.lg,
    fontVariant: ['tabular-nums'],
  },
  list: {
    paddingBottom: 0,
  },
  title: {
    color: COLORS.text.primary,
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZES.xxl,
  },
});

export default HistoryTab;
