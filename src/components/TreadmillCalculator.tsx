import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FONT_SCALE, FONT_SIZES, FONTS, RADIUS, SPACING } from '../constants/theme';
import { VALIDATION_MESSAGES } from '../constants/messages';
import { paceToSpeed, speedToPace, TREADMILL_REFERENCE_SPEEDS } from '../domain/treadmill';
import { formatPaceInput, formatSpeedInput } from '../format/masks';
import { formatPace } from '../format/time';
import { formatSpeed } from '../format/speed';
import { validatePace, validateSpeed } from '../validation/rules';
import { shouldShowError } from '../validation/forms';
import { useMaskedField } from '../hooks/useMaskedField';
import { createThemedStyles, useColors } from '../hooks/useTheme';
import Card from './ui/Card';
import ScreenHeader from './ui/ScreenHeader';
import SegmentedControl, { type SegmentOption } from './ui/SegmentedControl';
import InputField from './ui/InputField';
import ResultCard from './ui/ResultCard';
import Button from './ui/Button';
import ButtonRow from './ui/ButtonRow';

type Mode = 'speed' | 'pace';

const MODES: readonly SegmentOption<Mode>[] = [
  {
    value: 'speed',
    label: 'Sei a velocidade',
    accessibilityLabel: 'Converter velocidade da esteira em pace',
  },
  { value: 'pace', label: 'Sei o pace', accessibilityLabel: 'Converter pace em velocidade' },
];

const isBlank = (text: string): boolean => text.trim() === '';

/**
 * Aba Esteira: converte a velocidade do painel (km/h) em pace e vice-versa,
 * com uma tabela de consulta rápida para quem está em cima da esteira.
 */
const TreadmillCalculator: React.FC = () => {
  const styles = useStyles();
  const colors = useColors();
  const [mode, setMode] = useState<Mode>('speed');
  const speed = useMaskedField(formatSpeedInput);
  const pace = useMaskedField(formatPaceInput);

  // Cálculo ao vivo, como nas outras abas: campo vazio não é erro
  const speedResult = validateSpeed(speed.value);
  const paceResult = validatePace(pace.value);
  const speedError =
    !speedResult.valid && !isBlank(speed.value) && shouldShowError(speedResult.error, speed.touched)
      ? VALIDATION_MESSAGES[speedResult.error]
      : null;
  const paceError =
    !paceResult.valid && !isBlank(pace.value) && shouldShowError(paceResult.error, pace.touched)
      ? VALIDATION_MESSAGES[paceResult.error]
      : null;

  // Velocidade "atual" nos dois modos, para destacar a linha da tabela
  const currentSpeed =
    mode === 'speed'
      ? speedResult.valid
        ? speedResult.value
        : null
      : paceResult.valid
        ? paceToSpeed(paceResult.value)
        : null;

  const handleClear = (): void => {
    speed.clear();
    pace.clear();
  };

  return (
    <Card>
      <ScreenHeader
        title="Esteira"
        description="Converta a velocidade do painel da esteira no seu pace, e vice-versa"
      />

      <SegmentedControl options={MODES} value={mode} onChange={setMode} />

      {mode === 'speed' ? (
        <InputField
          label="Velocidade da esteira"
          value={speed.value}
          onChangeText={speed.onChangeText}
          onBlur={speed.onBlur}
          error={speedError}
          unit="km/h"
          placeholder="10,0"
          accessibilityLabel="Campo de velocidade da esteira em km/h"
          accessibilityHint="Digite a velocidade que aparece no painel"
        />
      ) : (
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
          accessibilityLabel="Campo de pace para a esteira"
          accessibilityHint="Digite o pace que o treino pede"
        />
      )}

      {mode === 'speed' && speedResult.valid && (
        <ResultCard
          label="Seu pace"
          value={formatPace(speedToPace(speedResult.value))}
          unit="/km"
          subtext="min por quilômetro"
        />
      )}
      {mode === 'pace' && paceResult.valid && (
        <ResultCard
          label="Regule a esteira em"
          value={formatSpeed(paceToSpeed(paceResult.value))}
          unit="km/h"
          subtext="velocidade no painel"
        />
      )}

      <ButtonRow>
        <Button
          title="Limpar"
          icon="trash-outline"
          variant="secondary"
          onPress={handleClear}
          accessibilityLabel="Limpar campos"
          accessibilityHint="Toque para limpar a velocidade e o pace"
        />
      </ButtonRow>

      {/* Dica: sem vento, a esteira "ajuda". 1% de inclinação compensa (Jones & Doust, 1996) */}
      <View style={styles.tip}>
        <Ionicons name="bulb-outline" size={18} color={colors.accent} />
        <Text style={styles.tipText}>
          Na esteira não tem vento contra, então o mesmo pace cansa um pouco menos. Para simular a
          rua, use 1% de inclinação.
        </Text>
      </View>

      <Text style={styles.tableTitle} accessibilityRole="header">
        Consulta rápida
      </Text>
      <View style={styles.table}>
        {TREADMILL_REFERENCE_SPEEDS.map((kmh, index) => {
          const selected = currentSpeed === kmh;
          const speedText = formatSpeed(kmh);
          const paceText = formatPace(speedToPace(kmh));
          return (
            <View
              key={kmh}
              style={[
                styles.tableRow,
                index % 2 === 1 && styles.tableRowAlt,
                selected && styles.tableRowSelected,
              ]}
              accessible
              accessibilityLabel={`${speedText} quilômetros por hora: pace ${paceText} por km`}
              accessibilityState={{ selected }}
            >
              <Text
                style={[styles.tableSpeed, selected && styles.tableTextSelected]}
                maxFontSizeMultiplier={FONT_SCALE.control}
              >
                {speedText} km/h
              </Text>
              <Text
                style={[styles.tablePace, selected && styles.tableTextSelected]}
                maxFontSizeMultiplier={FONT_SCALE.control}
              >
                {paceText} /km
              </Text>
            </View>
          );
        })}
      </View>
    </Card>
  );
};

const useStyles = createThemedStyles((colors) => ({
  table: {
    borderColor: colors.border,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    overflow: 'hidden',
  },
  tablePace: {
    color: colors.text.primary,
    fontFamily: FONTS.monoSemiBold,
    fontSize: FONT_SIZES.md,
    fontVariant: ['tabular-nums'],
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  tableRowAlt: {
    backgroundColor: colors.surfaceMuted,
  },
  tableRowSelected: {
    backgroundColor: colors.accentSoft,
  },
  tableSpeed: {
    color: colors.text.secondary,
    fontFamily: FONTS.mono,
    fontSize: FONT_SIZES.md,
    fontVariant: ['tabular-nums'],
  },
  tableTextSelected: {
    color: colors.accentText,
  },
  tableTitle: {
    color: colors.text.primary,
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZES.lg,
    marginBottom: SPACING.sm,
  },
  tip: {
    alignItems: 'flex-start',
    backgroundColor: colors.surfaceMuted,
    borderRadius: RADIUS.sm,
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
    marginTop: SPACING.lg,
    padding: SPACING.md,
  },
  tipText: {
    color: colors.text.secondary,
    flex: 1,
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.sm,
    lineHeight: 20,
  },
}));

export default TreadmillCalculator;
