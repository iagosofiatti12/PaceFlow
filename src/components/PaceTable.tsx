import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { COLORS, SPACING, RADIUS, FONT_SIZES } from '../constants/theme';
import {
  formatDistanceInput,
  validateDistance,
  validatePaceFormat,
  paceToSeconds,
  generatePaceTable,
  PaceTableRow,
} from '../utils/paceHelpers';

interface PaceTableProps {
  distance: string;
  setDistance: (value: string) => void;
  pace: string;
  setPace: (value: string) => void;
  table: PaceTableRow[] | null;
  onGenerate: (tableData: PaceTableRow[]) => void;
  onClear: () => void;
}

const PaceTable: React.FC<PaceTableProps> = ({
  distance,
  setDistance,
  pace,
  setPace,
  table,
  onGenerate,
  onClear,
}) => {
  const handleDistanceChange = (value: string): void => {
    const formatted = formatDistanceInput(value);
    if (formatted !== null) {
      setDistance(formatted);
    }
  };

  const handlePaceChange = (value: string): void => {
    let cleaned = value.replace(/[^\d:]/g, '');
    
    const colonCount = (cleaned.match(/:/g) || []).length;
    if (colonCount > 1) {
      cleaned = cleaned.replace(/:.*:/, ':');
    }

    const parts = cleaned.split(':');
    if (parts.length === 2) {
      const minutes = parts[0].slice(0, 2);
      const seconds = parts[1].slice(0, 2);
      cleaned = `${minutes}:${seconds}`;
    } else if (cleaned.length > 2 && !cleaned.includes(':')) {
      cleaned = `${cleaned.slice(0, 2)}:${cleaned.slice(2, 4)}`;
    }

    setPace(cleaned);
  };

  const generateTable = (): void => {
    // Validar distância
    const distanceValidation = validateDistance(distance);
    if (!distanceValidation.valid) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Atenção', distanceValidation.message);
      return;
    }

    // Validar pace
    const paceValidation = validatePaceFormat(pace);
    if (!paceValidation.valid) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Atenção', paceValidation.message);
      return;
    }

    // Gerar tabela
    const dist = parseFloat(distance);
    const paceInSeconds = paceToSeconds(pace);
    const tableData = generatePaceTable(dist, paceInSeconds);

    // Vibração de sucesso
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
    onGenerate(tableData);
  };

  return (
    <ScrollView 
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.calculator}>
        <Text style={styles.sectionTitle}>Tabela de Ritmo</Text>
        <Text style={styles.sectionDescription}>
          Gere uma tabela km a km para acompanhar sua prova
        </Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Distância da Prova</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              value={distance}
              onChangeText={handleDistanceChange}
              keyboardType="decimal-pad"
              placeholder="10.0"
              placeholderTextColor={COLORS.text.light}
              accessibilityLabel="Campo de distância da prova"
              accessibilityHint="Digite a distância total da prova"
            />
            <Text style={styles.inputUnit}>km</Text>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Pace Desejado</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              value={pace}
              onChangeText={handlePaceChange}
              keyboardType="number-pad"
              placeholder="5:30"
              placeholderTextColor={COLORS.text.light}
              maxLength={5}
              accessibilityLabel="Campo de pace desejado"
              accessibilityHint="Digite o pace objetivo"
            />
            <Text style={styles.inputUnit}>/km</Text>
          </View>
          <Text style={styles.hint}>Formato: min:seg (ex: 5:30)</Text>
        </View>

        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={generateTable}
            accessibilityRole="button"
            accessibilityLabel="Gerar tabela"
            accessibilityHint="Toque para gerar a tabela de ritmo"
          >
            <Ionicons name="list" size={20} color="white" style={styles.buttonIcon} />
            <Text style={styles.primaryButtonText}>Gerar Tabela</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={onClear}
            accessibilityRole="button"
            accessibilityLabel="Limpar"
            accessibilityHint="Toque para limpar a tabela"
          >
            <Ionicons name="trash-outline" size={20} color={COLORS.primary} style={styles.buttonIcon} />
            <Text style={styles.secondaryButtonText}>Limpar</Text>
          </TouchableOpacity>
        </View>
      </View>

      {table && table.length > 0 && (
        <View style={styles.tableContainer}>
          <View style={styles.tableHeader}>
            <Text style={styles.tableHeaderText}>KM</Text>
            <Text style={styles.tableHeaderText}>Parcial</Text>
            <Text style={styles.tableHeaderText}>Total</Text>
          </View>

          {table.map((row, index) => (
            <View 
              key={index} 
              style={[
                styles.tableRow,
                index % 2 === 0 && styles.tableRowEven,
                index === table.length - 1 && styles.tableRowLast,
              ]}
            >
              <Text style={styles.tableCell}>
                {Number.isInteger(row.km) ? row.km : row.km.toFixed(1)}
              </Text>
              <Text style={styles.tableCellTime}>{row.time}</Text>
              <Text style={[styles.tableCellTime, styles.tableCellTotal]}>
                {row.cumulativeTime}
              </Text>
            </View>
          ))}

          <View style={styles.tableSummary}>
            <Ionicons name="flag" size={18} color={COLORS.primary} />
            <Text style={styles.summaryText}>
              Tempo final: {table[table.length - 1].cumulativeTime}
            </Text>
          </View>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  buttonGroup: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginTop: SPACING.sm,
  },
  buttonIcon: {
    marginRight: SPACING.xs,
  },
  calculator: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.xxl,
    elevation: 3,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
  },
  container: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.xl + 20,
  },
  hint: {
    color: COLORS.text.light,
    fontSize: FONT_SIZES.xs,
    fontStyle: 'italic',
    marginTop: SPACING.xs,
  },
  input: {
    color: COLORS.text.primary,
    flex: 1,
    fontSize: FONT_SIZES.xl,
    fontWeight: '600',
    padding: SPACING.md,
  },
  inputGroup: {
    marginBottom: SPACING.lg,
  },
  inputUnit: {
    color: COLORS.primary,
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
  },
  inputWrapper: {
    alignItems: 'center',
    backgroundColor: COLORS.input,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    borderWidth: 2,
    flexDirection: 'row',
    paddingRight: SPACING.md,
  },
  label: {
    color: COLORS.text.label,
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    letterSpacing: 0.3,
    marginBottom: SPACING.sm,
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    elevation: 4,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md + 2,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
  },
  primaryButtonText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  secondaryButton: {
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    borderWidth: 2,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: SPACING.md + 2,
  },
  secondaryButtonText: {
    color: COLORS.text.muted,
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
  },
  sectionDescription: {
    color: COLORS.text.secondary,
    fontSize: FONT_SIZES.md,
    lineHeight: 22,
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    color: COLORS.text.primary,
    fontSize: FONT_SIZES.xxl,
    fontWeight: '700',
    marginBottom: SPACING.sm,
  },
  summaryText: {
    color: COLORS.primary,
    fontSize: FONT_SIZES.md,
    fontWeight: '700',
    marginLeft: SPACING.xs,
  },
  tableCell: {
    color: COLORS.text.primary,
    flex: 1,
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    textAlign: 'center',
  },
  tableCellTime: {
    color: COLORS.text.secondary,
    flex: 1,
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    textAlign: 'center',
  },
  tableCellTotal: {
    color: COLORS.primary,
    fontWeight: '700',
  },
  tableContainer: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.xxl,
    elevation: 3,
    marginBottom: SPACING.xl,
    overflow: 'hidden',
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
  },
  tableHeader: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    padding: SPACING.md,
  },
  tableHeaderText: {
    color: COLORS.white,
    flex: 1,
    fontSize: FONT_SIZES.md,
    fontWeight: '700',
    letterSpacing: 0.5,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  tableRow: {
    borderBottomColor: COLORS.border,
    borderBottomWidth: 1,
    flexDirection: 'row',
    padding: SPACING.md,
  },
  tableRowEven: {
    backgroundColor: COLORS.background,
  },
  tableRowLast: {
    backgroundColor: COLORS.primaryLight,
    borderBottomWidth: 0,
  },
  tableSummary: {
    alignItems: 'center',
    backgroundColor: COLORS.primaryLight,
    borderTopColor: COLORS.primary,
    borderTopWidth: 2,
    flexDirection: 'row',
    justifyContent: 'center',
    padding: SPACING.md,
  },
});

export default PaceTable;
