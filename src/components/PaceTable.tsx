import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, FONT_SIZES } from '../constants/theme';
import {
  formatDistanceInput,
  formatPaceInput,
  validateDistance,
  validatePaceFormat,
  paceToSeconds,
  generatePaceTable,
  PaceTableRow,
} from '../utils/paceHelpers';
import { showValidationError, notifySuccess } from '../utils/feedback';
import Card from './ui/Card';
import InputField from './ui/InputField';
import Button from './ui/Button';
import ButtonRow from './ui/ButtonRow';

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

  const generateTable = (): void => {
    const distanceValidation = validateDistance(distance);
    if (!distanceValidation.valid) {
      showValidationError(distanceValidation.message);
      return;
    }

    const paceValidation = validatePaceFormat(pace);
    if (!paceValidation.valid) {
      showValidationError(paceValidation.message);
      return;
    }

    const dist = parseFloat(distance);
    const paceInSeconds = paceToSeconds(pace);
    const tableData = generatePaceTable(dist, paceInSeconds);

    notifySuccess();
    onGenerate(tableData);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Card style={styles.calculatorCard}>
        <Text style={styles.sectionTitle}>Tabela de Ritmo</Text>
        <Text style={styles.sectionDescription}>
          Gere uma tabela km a km para acompanhar sua prova
        </Text>

        <InputField
          label="Distância da Prova"
          value={distance}
          onChangeText={handleDistanceChange}
          unit="km"
          placeholder="10.0"
          accessibilityLabel="Campo de distância da prova"
          accessibilityHint="Digite a distância total da prova"
        />

        <InputField
          label="Pace Desejado"
          value={pace}
          onChangeText={(value) => setPace(formatPaceInput(value))}
          unit="/km"
          placeholder="5:30"
          keyboardType="number-pad"
          maxLength={5}
          hint="Formato: min:seg (ex: 5:30)"
          accessibilityLabel="Campo de pace desejado"
          accessibilityHint="Digite o pace objetivo"
        />

        <ButtonRow>
          <Button
            title="Gerar Tabela"
            icon="list"
            onPress={generateTable}
            accessibilityLabel="Gerar tabela"
            accessibilityHint="Toque para gerar a tabela de ritmo"
          />
          <Button
            title="Limpar"
            icon="trash-outline"
            variant="secondary"
            onPress={onClear}
            accessibilityLabel="Limpar"
            accessibilityHint="Toque para limpar a tabela"
          />
        </ButtonRow>
      </Card>

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
  calculatorCard: {
    marginBottom: SPACING.lg,
  },
  container: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
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
