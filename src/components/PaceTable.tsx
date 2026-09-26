import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SPACING, RADIUS, FONT_SIZES, FONTS, FONT_SCALE } from '../constants/theme';
import { generateSplits, negativeSplitPaces, type SplitStrategy } from '../domain/splits';
import { formatDistanceInput, formatPaceInput } from '../format/masks';
import { formatPace, formatSecondsToTime } from '../format/time';
import { formatKm } from '../format/distance';
import { evaluateDistancePaceForm, shouldShowError } from '../validation/forms';
import { VALIDATION_MESSAGES } from '../constants/messages';
import { useMaskedField } from '../hooks/useMaskedField';
import Card from './ui/Card';
import ScreenHeader from './ui/ScreenHeader';
import InputField from './ui/InputField';
import DistancePresets from './ui/DistancePresets';
import SegmentedControl, { type SegmentOption } from './ui/SegmentedControl';
import Button from './ui/Button';
import ButtonRow from './ui/ButtonRow';
import { createThemedStyles, useColors } from '../hooks/useTheme';

const STRATEGIES: readonly SegmentOption<SplitStrategy>[] = [
  { value: 'even', label: 'Ritmo constante', accessibilityLabel: 'Plano com ritmo constante' },
  {
    value: 'negative',
    label: 'Negative split',
    accessibilityLabel: 'Plano com negative split: segunda metade mais rápida',
  },
];

const PaceTable: React.FC = () => {
  const styles = useStyles();
  const colors = useColors();
  const distance = useMaskedField(formatDistanceInput);
  const pace = useMaskedField(formatPaceInput);
  const [strategy, setStrategy] = useState<SplitStrategy>('even');

  // Tabela ao vivo: aparece e se atualiza assim que os dois campos são válidos
  const form = evaluateDistancePaceForm({ distance: distance.value, pace: pace.value });

  // useMemo: uma ultramaratona pode ter 500 linhas; só recalcula a tabela
  // quando a distância ou o pace mudam de fato, e não a cada renderização
  const distanceKm = form.value?.distanceKm;
  const paceSeconds = form.value?.paceSeconds;
  const splits = useMemo(
    () =>
      distanceKm !== undefined && paceSeconds !== undefined
        ? generateSplits(distanceKm, paceSeconds, strategy)
        : null,
    [distanceKm, paceSeconds, strategy],
  );
  // Paces das duas metades, arredondados ao segundo só para mostrar
  const halves =
    strategy === 'negative' && paceSeconds !== undefined ? negativeSplitPaces(paceSeconds) : null;

  const distanceError = shouldShowError(form.errors.distance, distance.touched)
    ? VALIDATION_MESSAGES[form.errors.distance]
    : null;
  const paceError = shouldShowError(form.errors.pace, pace.touched)
    ? VALIDATION_MESSAGES[form.errors.pace]
    : null;

  const handleClear = (): void => {
    distance.clear();
    pace.clear();
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Card style={styles.calculatorCard}>
        <ScreenHeader
          title="Tabela de ritmo"
          description="Informe a prova e o pace: a tabela km a km aparece na hora"
        />

        <InputField
          label="Distância da prova"
          value={distance.value}
          onChangeText={distance.onChangeText}
          onBlur={distance.onBlur}
          error={distanceError}
          unit="km"
          placeholder="10,0"
          accessibilityLabel="Campo de distância da prova"
          accessibilityHint="Digite a distância total da prova"
        />

        <DistancePresets value={distance.value} onSelect={distance.onChangeText} />

        <InputField
          label="Pace desejado"
          value={pace.value}
          onChangeText={pace.onChangeText}
          onBlur={pace.onBlur}
          error={paceError}
          unit="/km"
          placeholder="5:30"
          keyboardType="number-pad"
          maxLength={5}
          hint="Formato: min:seg (ex: 5:30)"
          accessibilityLabel="Campo de pace desejado"
          accessibilityHint="Digite o pace objetivo"
        />

        <SegmentedControl options={STRATEGIES} value={strategy} onChange={setStrategy} />

        {/* Negative split: larga contido e acelera na segunda metade, no mesmo tempo final */}
        {halves && (
          <View style={styles.plan}>
            <Ionicons name="trending-up-outline" size={18} color={colors.accent} />
            <Text style={styles.planText}>
              1ª metade a {formatPace(Math.round(halves.firstHalf))}/km e 2ª metade a{' '}
              {formatPace(Math.round(halves.secondHalf))}/km. Largar contido poupa energia para o
              final, e o tempo total é o mesmo.
            </Text>
          </View>
        )}

        <ButtonRow>
          <Button
            title="Limpar"
            icon="trash-outline"
            variant="secondary"
            onPress={handleClear}
            accessibilityLabel="Limpar"
            accessibilityHint="Toque para limpar a tabela"
          />
        </ButtonRow>
      </Card>

      {splits && splits.length > 0 && (
        <View style={styles.tableContainer}>
          <View style={styles.tableHeader}>
            <Text style={styles.tableHeaderText} maxFontSizeMultiplier={FONT_SCALE.control}>
              KM
            </Text>
            <Text style={styles.tableHeaderText} maxFontSizeMultiplier={FONT_SCALE.control}>
              Parcial
            </Text>
            <Text style={styles.tableHeaderText} maxFontSizeMultiplier={FONT_SCALE.control}>
              Total
            </Text>
          </View>

          {splits.map((row, index) => (
            <View
              // O km é único em cada linha: chave estável (o índice mudaria o sentido ao regerar)
              key={row.km}
              style={[
                styles.tableRow,
                index % 2 === 0 && styles.tableRowEven,
                index === splits.length - 1 && styles.tableRowLast,
              ]}
            >
              <Text style={styles.tableCell} maxFontSizeMultiplier={FONT_SCALE.control}>
                {formatKm(row.km, 1)}
              </Text>
              <Text style={styles.tableCellTime} maxFontSizeMultiplier={FONT_SCALE.control}>
                {formatSecondsToTime(row.splitSeconds)}
              </Text>
              <Text
                style={[styles.tableCellTime, styles.tableCellTotal]}
                maxFontSizeMultiplier={FONT_SCALE.control}
              >
                {formatSecondsToTime(row.cumulativeSeconds)}
              </Text>
            </View>
          ))}

          <View style={styles.tableSummary}>
            <Ionicons name="flag" size={18} color={colors.accent} />
            <Text style={styles.summaryText} maxFontSizeMultiplier={FONT_SCALE.control}>
              Tempo final: {formatSecondsToTime(splits[splits.length - 1].cumulativeSeconds)}
            </Text>
          </View>
        </View>
      )}
    </ScrollView>
  );
};

const useStyles = createThemedStyles((colors) => ({
  calculatorCard: {
    marginBottom: SPACING.lg,
  },
  container: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
  },
  plan: {
    alignItems: 'flex-start',
    backgroundColor: colors.surfaceMuted,
    borderRadius: RADIUS.sm,
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
    padding: SPACING.md,
  },
  planText: {
    color: colors.text.secondary,
    flex: 1,
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.sm,
    lineHeight: 20,
  },
  summaryText: {
    color: colors.accentText,
    fontFamily: FONTS.monoSemiBold,
    fontSize: FONT_SIZES.md,
    fontVariant: ['tabular-nums'],
    marginLeft: SPACING.xs,
  },
  tableCell: {
    color: colors.text.primary,
    flex: 1,
    fontFamily: FONTS.monoSemiBold,
    fontSize: FONT_SIZES.lg,
    fontVariant: ['tabular-nums'],
    textAlign: 'center',
  },
  tableCellTime: {
    color: colors.text.secondary,
    flex: 1,
    fontFamily: FONTS.mono,
    fontSize: FONT_SIZES.md,
    fontVariant: ['tabular-nums'],
    textAlign: 'center',
  },
  tableCellTotal: {
    color: colors.accentText,
    fontFamily: FONTS.monoSemiBold,
  },
  tableContainer: {
    backgroundColor: colors.surface,
    borderRadius: RADIUS.xxl,
    elevation: 3,
    marginBottom: SPACING.xl,
    overflow: 'hidden',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
  },
  // Header neutro/escuro (ver DESIGN.md): o laranja fica reservado
  // para os números que importam (coluna Total e resumo)
  tableHeader: {
    backgroundColor: colors.inverseSurface,
    flexDirection: 'row',
    padding: SPACING.md,
  },
  tableHeaderText: {
    color: colors.onInverse,
    flex: 1,
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.sm,
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  tableRow: {
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
    flexDirection: 'row',
    padding: SPACING.md,
  },
  tableRowEven: {
    backgroundColor: colors.background,
  },
  tableRowLast: {
    backgroundColor: colors.accentSoft,
    borderBottomWidth: 0,
  },
  tableSummary: {
    alignItems: 'center',
    backgroundColor: colors.accentSoft,
    borderTopColor: colors.accent,
    borderTopWidth: 2,
    flexDirection: 'row',
    justifyContent: 'center',
    padding: SPACING.md,
  },
}));

export default PaceTable;
