import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { SPACING, RADIUS, FONT_SIZES, FONTS } from '../../constants/theme';
import type { MaskedField } from '../../hooks/useMaskedField';
import { createThemedStyles, useColors } from '../../hooks/useTheme';

interface TimeInputProps {
  label: string;
  hours: MaskedField;
  minutes: MaskedField;
  seconds: MaskedField;
}

interface TimeBlockProps {
  field: MaskedField;
  placeholder: string;
  unit: string;
  accessibilityLabel: string;
  accessibilityHint: string;
}

/** Um dos três campos (h, min ou seg), com a unidade embaixo */
const TimeBlock: React.FC<TimeBlockProps> = ({
  field,
  placeholder,
  unit,
  accessibilityLabel,
  accessibilityHint,
}) => {
  const styles = useStyles();
  const colors = useColors();
  return (
    <View style={styles.timeBlock}>
      <TextInput
        style={styles.timeInput}
        value={field.value}
        onChangeText={field.onChangeText}
        keyboardType="number-pad"
        placeholder={placeholder}
        placeholderTextColor={colors.text.placeholder}
        maxLength={2}
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={accessibilityHint}
      />
      <Text style={styles.timeUnit}>{unit}</Text>
    </View>
  );
};

/** Campo de tempo total no formato h : min : seg (extraído do PaceCalculator). */
const TimeInput: React.FC<TimeInputProps> = ({ label, hours, minutes, seconds }) => {
  const styles = useStyles();

  return (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.timeRow}>
        <TimeBlock
          field={hours}
          placeholder="0"
          unit="h"
          accessibilityLabel="Horas"
          accessibilityHint="Digite as horas"
        />
        <Text style={styles.timeSeparator}>:</Text>
        <TimeBlock
          field={minutes}
          placeholder="00"
          unit="min"
          accessibilityLabel="Minutos"
          accessibilityHint="Digite os minutos"
        />
        <Text style={styles.timeSeparator}>:</Text>
        <TimeBlock
          field={seconds}
          placeholder="00"
          unit="seg"
          accessibilityLabel="Segundos"
          accessibilityHint="Digite os segundos"
        />
      </View>
    </View>
  );
};

const useStyles = createThemedStyles((colors) => ({
  inputGroup: {
    marginBottom: SPACING.lg,
  },
  label: {
    color: colors.text.label,
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.md,
    letterSpacing: 0.3,
    marginBottom: SPACING.sm,
  },
  timeBlock: {
    alignItems: 'center',
    flex: 1,
  },
  timeInput: {
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.border,
    borderRadius: RADIUS.md,
    borderWidth: 2,
    color: colors.text.primary,
    fontFamily: FONTS.mono,
    fontSize: 24,
    fontVariant: ['tabular-nums'],
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
    color: colors.borderStrong,
    fontFamily: FONTS.mono,
    fontSize: 24,
    marginHorizontal: SPACING.sm,
  },
  timeUnit: {
    color: colors.text.tertiary,
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.xs,
    marginTop: 6,
  },
}));

export default TimeInput;
