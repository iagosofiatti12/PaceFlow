import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { COLORS, SPACING, RADIUS, FONT_SIZES } from '../constants/theme';
import {
  formatDistanceInput,
  validateDistance,
  validatePaceFormat,
  paceToSeconds,
  calculateTime,
} from '../utils/paceHelpers';

interface TimeCalculatorProps {
  distance: string;
  setDistance: (value: string) => void;
  pace: string;
  setPace: (value: string) => void;
  result: string | null;
  onCalculate: (timeResult: string) => void;
  onClear: () => void;
}

const TimeCalculator: React.FC<TimeCalculatorProps> = ({
  distance,
  setDistance,
  pace,
  setPace,
  result,
  onCalculate,
  onClear,
}) => {
  const handleDistanceChange = (value: string): void => {
    const formatted = formatDistanceInput(value);
    if (formatted !== null) {
      setDistance(formatted);
    }
  };

  const handlePaceChange = (value: string): void => {
    // Remove tudo que não é número ou :
    let cleaned = value.replace(/[^\d:]/g, '');
    
    // Garante apenas um :
    const colonCount = (cleaned.match(/:/g) || []).length;
    if (colonCount > 1) {
      cleaned = cleaned.replace(/:.*:/, ':');
    }

    // Limita formato min:seg
    const parts = cleaned.split(':');
    if (parts.length === 2) {
      const minutes = parts[0].slice(0, 2);
      const seconds = parts[1].slice(0, 2);
      cleaned = `${minutes}:${seconds}`;
    } else if (cleaned.length > 2 && !cleaned.includes(':')) {
      // Auto-adiciona : após 2 dígitos
      cleaned = `${cleaned.slice(0, 2)}:${cleaned.slice(2, 4)}`;
    }

    setPace(cleaned);
  };

  const calculateTimeTotal = (): void => {
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

    // Calcular tempo
    const dist = parseFloat(distance);
    const paceInSeconds = paceToSeconds(pace);
    const { formatted } = calculateTime(dist, paceInSeconds);

    // Vibração de sucesso
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
    onCalculate(formatted);
  };

  return (
    <View style={styles.calculator}>
      <Text style={styles.sectionTitle}>Calcular Tempo</Text>
      <Text style={styles.sectionDescription}>
        Insira a distância e seu pace para descobrir quanto tempo levará
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
            accessibilityHint="Digite a distância da prova"
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
            accessibilityLabel="Campo de pace"
            accessibilityHint="Digite o pace em minutos e segundos"
          />
          <Text style={styles.inputUnit}>/km</Text>
        </View>
        <Text style={styles.hint}>Formato: min:seg (ex: 5:30)</Text>
      </View>

      <View style={styles.buttonGroup}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={calculateTimeTotal}
          accessibilityRole="button"
          accessibilityLabel="Calcular tempo"
          accessibilityHint="Toque para calcular o tempo total"
        >
          <Ionicons name="timer" size={20} color="white" style={styles.buttonIcon} />
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
          <Text style={styles.resultLabel}>Tempo estimado</Text>
          <View style={styles.resultValueContainer}>
            <Text style={styles.resultValue}>{result}</Text>
          </View>
          <Text style={styles.resultSubtext}>
            {result.includes(':') && result.split(':').length === 3 ? 'horas' : 'minutos'}
          </Text>
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
  buttonIcon: {
    marginRight: SPACING.xs,
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
});

export default TimeCalculator;
