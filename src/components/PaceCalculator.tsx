import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { COLORS, SPACING, RADIUS, FONT_SIZES } from '../constants/theme';
import {
  formatTimeInput,
  formatDistanceInput,
  validateDistance,
  validateTime,
  calculatePaceValue,
} from '../utils/paceHelpers';

interface PaceFeedback {
  text: string;
  color: string;
}

interface PaceCalculatorProps {
  distance: string;
  setDistance: (value: string) => void;
  hours: string;
  setHours: (value: string) => void;
  minutes: string;
  setMinutes: (value: string) => void;
  seconds: string;
  setSeconds: (value: string) => void;
  result: string | null;
  feedback: PaceFeedback | null;
  onCalculate: (paceInSeconds: number, formattedResult: string) => void;
  onClear: () => void;
}

const PaceCalculator: React.FC<PaceCalculatorProps> = ({
  distance,
  setDistance,
  hours,
  setHours,
  minutes,
  setMinutes,
  seconds,
  setSeconds,
  result,
  feedback,
  onCalculate,
  onClear,
}) => {
  const handleDistanceChange = (value: string): void => {
    const formatted = formatDistanceInput(value);
    if (formatted !== null) {
      setDistance(formatted);
    }
  };

  const calculatePace = (): void => {
    // Validar distância
    const distanceValidation = validateDistance(distance);
    if (!distanceValidation.valid) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Atenção', distanceValidation.message);
      return;
    }

    // Validar tempo
    const timeValidation = validateTime(hours, minutes, seconds);
    if (!timeValidation.valid) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Atenção', timeValidation.message);
      return;
    }

    // Calcular pace
    const dist = parseFloat(distance);
    const { formatted, paceInSeconds } = calculatePaceValue(timeValidation.totalSeconds, dist);

    // Vibração de sucesso
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
    onCalculate(paceInSeconds, formatted);
  };

  return (
    <View style={styles.calculator}>
      <Text style={styles.sectionTitle}>Calcular Pace</Text>
      <Text style={styles.sectionDescription}>
        Insira a distância e o tempo para descobrir seu ritmo médio
      </Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Distância</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            value={distance}
            onChangeText={handleDistanceChange}
            keyboardType="decimal-pad"
            placeholder="5.0"
            placeholderTextColor={COLORS.text.light}
            accessibilityLabel="Campo de distância em quilômetros"
            accessibilityHint="Digite a distância percorrida"
          />
          <Text style={styles.inputUnit}>km</Text>
        </View>
      </View>

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

      <View style={styles.buttonGroup}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={calculatePace}
          accessibilityRole="button"
          accessibilityLabel="Calcular pace"
          accessibilityHint="Toque para calcular o pace médio"
        >
          <Ionicons name="calculator" size={20} color="white" style={styles.buttonIcon} />
          <Text style={styles.primaryButtonText}>Calcular</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={onClear}
          accessibilityRole="button"
          accessibilityLabel="Limpar campos"
          accessibilityHint="Toque para limpar todos os campos"
        >
          <Ionicons name="trash-outline" size={20} color={COLORS.primary} style={styles.buttonIcon} />
          <Text style={styles.secondaryButtonText}>Limpar</Text>
        </TouchableOpacity>
      </View>

      {result && (
        <View style={styles.resultCard}>
          <Text style={styles.resultLabel}>Seu pace médio</Text>
          <View style={styles.resultValueContainer}>
            <Text style={styles.resultValue}>{result}</Text>
            <Text style={styles.resultUnit}>/km</Text>
          </View>
          <Text style={styles.resultSubtext}>min por quilômetro</Text>

          {feedback && (
            <View style={[styles.feedbackBadge, { backgroundColor: feedback.color }]}>
              <Text style={styles.feedbackText}>{feedback.text}</Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  buttonGroup: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginTop: SPACING.sm,
  },
  calculator: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.xxl,
    elevation: 3,
    padding: SPACING.lg,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
  },
  feedbackBadge: {
    borderRadius: 20,
    marginTop: SPACING.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  feedbackText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.md,
    fontWeight: '700',
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
    paddingVertical: SPACING.md + 2,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
  },
  buttonIcon: {
    marginRight: SPACING.xs,
  },
  primaryButtonText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  resultCard: {
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.xl,
    elevation: 6,
    marginTop: SPACING.xl,
    padding: SPACING.xl,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
  },
  resultLabel: {
    color: COLORS.white,
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    letterSpacing: 1,
    marginBottom: SPACING.sm,
    opacity: 0.95,
    textTransform: 'uppercase',
  },
  resultSubtext: {
    color: COLORS.white,
    fontSize: FONT_SIZES.sm,
    marginTop: SPACING.xs,
    opacity: 0.85,
  },
  resultUnit: {
    color: COLORS.white,
    fontSize: FONT_SIZES.lg + 7,
    fontWeight: '700',
    marginLeft: SPACING.xs,
    opacity: 0.9,
  },
  resultValue: {
    color: COLORS.white,
    fontSize: FONT_SIZES.xxxl,
    fontWeight: '800',
    letterSpacing: -1,
  },
  resultValueContainer: {
    alignItems: 'baseline',
    flexDirection: 'row',
    marginBottom: SPACING.sm,
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
