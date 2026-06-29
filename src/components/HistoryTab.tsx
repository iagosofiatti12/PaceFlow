import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, FONT_SIZES } from '../constants/theme';
import { getHistory, deleteHistoryItem, clearHistory, type HistoryItem } from '../utils/storage';

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
    Alert.alert(
      'Excluir cálculo',
      'Tem certeza que deseja excluir este cálculo do histórico?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            await deleteHistoryItem(id);
            await loadHistory();
          },
        },
      ]
    );
  };

  const handleClearAll = (): void => {
    Alert.alert(
      'Limpar histórico',
      'Tem certeza que deseja limpar todo o histórico?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Limpar tudo',
          style: 'destructive',
          onPress: async () => {
            await clearHistory();
            await loadHistory();
          },
        },
      ]
    );
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
      year: '2-digit'
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
        <Ionicons name="trash-outline" size={20} color="#ff6b6b" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  if (history.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="time-outline" size={64} color={COLORS.text.light} />
        <Text style={styles.emptyTitle}>Nenhum cálculo salvo</Text>
        <Text style={styles.emptyDescription}>
          Seus cálculos de pace aparecerão aqui automaticamente
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
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
    </View>
  );
};

const styles = StyleSheet.create({
  clearButton: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
  },
  clearButtonText: {
    color: COLORS.danger,
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
  },
  container: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.xxl,
    elevation: 3,
    flex: 1,
    padding: SPACING.lg,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
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
    fontSize: FONT_SIZES.sm,
  },
  emptyContainer: {
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.xxl,
    elevation: 3,
    flex: 1,
    justifyContent: 'center',
    padding: SPACING.xxl,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
  },
  emptyDescription: {
    color: COLORS.text.secondary,
    fontSize: FONT_SIZES.md,
    marginTop: SPACING.sm,
    textAlign: 'center',
  },
  emptyTitle: {
    color: COLORS.text.primary,
    fontSize: FONT_SIZES.xl,
    fontWeight: '600',
    marginTop: SPACING.md,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  historyItem: {
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.xs,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs + 2,
  },
  itemContent: {
    flex: 1,
  },
  itemDate: {
    color: COLORS.text.light,
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
  itemPace: {
    color: COLORS.text.primary,
    fontSize: FONT_SIZES.md,
    fontWeight: '700',
  },
  list: {
    paddingBottom: 0,
  },
  title: {
    color: COLORS.text.primary,
    fontSize: FONT_SIZES.xxl,
    fontWeight: '700',
  },
});

export default HistoryTab;
