import React, { useState } from 'react';
import { Text, StyleSheet } from 'react-native';
import { COLORS, SPACING, FONT_SIZES, FONTS } from '../constants/theme';
import {
  formatDistanceInput,
  formatPaceInput,
  validateDistance,
  validatePaceFormat,
  paceToSeconds,
  calculateTime,
} from '../utils/paceHelpers';
import { showValidationError, notifySuccess } from '../utils/feedback';
import Card from './ui/Card';
import InputField from './ui/InputField';
import Button from './ui/Button';
import ButtonRow from './ui/ButtonRow';
import ResultCard from './ui/ResultCard';

const TimeCalculator: React.FC = () => {
  const [distance, setDistance] = useState<string>('');
  const [pace, setPace] = useState<string>('');
  const [result, setResult] = useState<string | null>(null);

  const handleDistanceChange = (value: string): void => {
    const formatted = formatDistanceInput(value);
    if (formatted !== null) {
      setDistance(formatted);
    }
  };

  const handleClear = (): void => {
    setDistance('');
    setPace('');
    setResult(null);
  };

  const calculateTimeTotal = (): void => {
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
    const { formatted } = calculateTime(dist, paceInSeconds);

    notifySuccess();
    setResult(formatted);
  };

  return (
    <Card>
      <Text style={styles.sectionTitle}>Calcular tempo</Text>
      <Text style={styles.sectionDescription}>
        Insira a distância e seu pace para descobrir quanto tempo levará
      </Text>

      <InputField
        label="Distância"
        value={distance}
        onChangeText={handleDistanceChange}
        unit="km"
        placeholder="5.0"
        accessibilityLabel="Campo de distância em quilômetros"
        accessibilityHint="Digite a distância da prova"
      />

      <InputField
        label="Pace desejado"
        value={pace}
        onChangeText={(value) => setPace(formatPaceInput(value))}
        unit="/km"
        placeholder="5:30"
        keyboardType="number-pad"
        maxLength={5}
        hint="Formato: min:seg (ex: 5:30)"
        accessibilityLabel="Campo de pace"
        accessibilityHint="Digite o pace em minutos e segundos"
      />

      <ButtonRow>
        <Button
          title="Calcular"
          icon="timer"
          onPress={calculateTimeTotal}
          accessibilityLabel="Calcular tempo"
          accessibilityHint="Toque para calcular o tempo total"
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
          label="Tempo estimado"
          value={result}
          subtext={result.split(':').length === 3 ? 'horas' : 'minutos'}
        />
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  sectionDescription: {
    color: COLORS.text.secondary,
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.md,
    lineHeight: 22,
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    color: COLORS.text.primary,
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZES.xxl,
    marginBottom: SPACING.sm,
  },
});

export default TimeCalculator;
