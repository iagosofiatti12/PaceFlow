import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { COLORS, SPACING, RADIUS, FONT_SIZES } from '../constants/theme';
import type { PaceFeedback } from '../types';
import {
  formatTimeInput,
  formatDistanceInput,
  validateDistance,
  validateTime,
  calculatePaceValue,
  getPaceFeedback,
  paceToSeconds,
} from '../utils/paceHelpers';
import { showValidationError, notifySuccess } from '../utils/feedback';
import { saveCalculation, type HistoryItem } from '../utils/storage';
import Card from './ui/Card';
import InputField from './ui/InputField';
import Button from './ui/Button';
import ButtonRow from './ui/ButtonRow';
import ResultCard from './ui/ResultCard';

interface PaceCalculatorProps {
  /** Item do histórico para preencher os campos ao restaurar um cálculo salvo */
  initialItem?: HistoryItem | null;
}

const PaceCalculator: React.FC<PaceCalculatorProps> = ({ initialItem }) => {
  // Se veio um item do histórico, os campos já nascem preenchidos
  const [h, m, s] = initialItem ? initialItem.time.split(':') : ['', '', ''];

  const [distance, setDistance] = useState<string>(initialItem?.distance ?? '');
  const [hours, setHours] = useState<string>(h === '0' ? '' : h);
  const [minutes, setMinutes] = useState<string>(m);
  const [seconds, setSeconds] = useState<string>(s);
  const [result, setResult] = useState<string | null>(initialItem?.pace ?? null);
  const [feedback, setFeedback] = useState<PaceFeedback | null>(
    initialItem ? getPaceFeedback(paceToSeconds(initialItem.pace)) : null,
  );

  const handleDistanceChange = (value: string): void => {
    const formatted = formatDistanceInput(value);
    if (formatted !== null) {
      setDistance(formatted);
    }
  };

  const handleClear = (): void => {
    setDistance('');
    setHours('');
    setMinutes('');
    setSeconds('');
    setResult(null);
    setFeedback(null);
  };

  const calculatePace = async (): Promise<void> => {
    const distanceValidation = validateDistance(distance);
    if (!distanceValidation.valid) {
      showValidationError(distanceValidation.message);
      return;
    }

    const timeValidation = validateTime(hours, minutes, seconds);
    if (!timeValidation.valid) {
      showValidationError(timeValidation.message);
      return;
    }

    const dist = parseFloat(distance);
    const { formatted, paceInSeconds } = calculatePaceValue(timeValidation.totalSeconds, dist);

    notifySuccess();
    setResult(formatted);
    setFeedback(getPaceFeedback(paceInSeconds));

    // Salvar no histórico
    await saveCalculation(distance, hours, minutes, seconds, formatted);
  };

  return (
    <Card>
      <Text style={styles.sectionTitle}>Calcular Pace</Text>
      <Text style={styles.sectionDescription}>
        Insira a distância e o tempo para descobrir seu ritmo médio
      </Text>

      <InputField
        label="Distância"
        value={distance}
        onChangeText={handleDistanceChange}
        unit="km"
        placeholder="5.0"
        accessibilityLabel="Campo de distância em quilômetros"
        accessibilityHint="Digite a distância percorrida"
      />

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Tempo Total</Text>
        <View style={styles.timeRow}>
          <View style={styles.timeBlock}>
            <TextInput
              style={styles.timeInput}
              value={hours}
              onChangeText={(val) => setHours(formatTimeInput(val, 23))}
              keyboardType="number-pad"
              placeholder="0"
              placeholderTextColor={COLORS.text.light}
              maxLength={2}
              accessibilityLabel="Horas"
              accessibilityHint="Digite as horas"
            />
            <Text style={styles.timeUnit}>h</Text>
          </View>

          <Text style={styles.timeSeparator}>:</Text>

          <View style={styles.timeBlock}>
            <TextInput
              style={styles.timeInput}
              value={minutes}
              onChangeText={(val) => setMinutes(formatTimeInput(val, 59))}
              keyboardType="number-pad"
              placeholder="00"
              placeholderTextColor={COLORS.text.light}
              maxLength={2}
              accessibilityLabel="Minutos"
              accessibilityHint="Digite os minutos"
            />
            <Text style={styles.timeUnit}>min</Text>
          </View>

          <Text style={styles.timeSeparator}>:</Text>

          <View style={styles.timeBlock}>
            <TextInput
              style={styles.timeInput}
              value={seconds}
              onChangeText={(val) => setSeconds(formatTimeInput(val, 59))}
              keyboardType="number-pad"
              placeholder="00"
              placeholderTextColor={COLORS.text.light}
              maxLength={2}
              accessibilityLabel="Segundos"
              accessibilityHint="Digite os segundos"
            />
            <Text style={styles.timeUnit}>seg</Text>
          </View>
        </View>
      </View>

      <ButtonRow>
        <Button
          title="Calcular"
          icon="calculator"
          onPress={calculatePace}
          accessibilityLabel="Calcular pace"
          accessibilityHint="Toque para calcular o pace médio"
        />
        <Button
          title="Limpar"
          icon="trash-outline"
          variant="secondary"
          onPress={handleClear}
          accessibilityLabel="Limpar campos"
          accessibilityHint="Toque para limpar todos os campos"
        />
      </ButtonRow>

      {result && (
        <ResultCard
          label="Seu pace médio"
          value={result}
          unit="/km"
          subtext="min por quilômetro"
          feedback={feedback}
        />
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  inputGroup: {
    marginBottom: SPACING.lg,
  },
  label: {
    color: COLORS.text.label,
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    letterSpacing: 0.3,
    marginBottom: SPACING.sm,
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
  timeBlock: {
    alignItems: 'center',
    flex: 1,
  },
  timeInput: {
    backgroundColor: COLORS.input,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    borderWidth: 2,
    color: COLORS.text.primary,
    fontSize: 24,
    fontWeight: '700',
    padding: SPACING.md,
    textAlign: 'center',
    width: '100%',
  },
  timeRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeSeparator: {
    color: COLORS.borderLight,
    fontSize: 24,
    fontWeight: '700',
    marginHorizontal: SPACING.sm,
  },
  timeUnit: {
    color: COLORS.text.tertiary,
    fontSize: FONT_SIZES.xs,
    fontWeight: '600',
    marginTop: 6,
  },
});

export default PaceCalculator;
