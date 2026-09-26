import React, { useRef } from 'react';
import { View, Text, TextInput } from 'react-native';
import { SPACING, RADIUS, FONT_SIZES, FONTS, FONT_SCALE } from '../../constants/theme';
import type { MaskedField } from '../../hooks/useMaskedField';
import { useAutoAdvance } from '../../hooks/useAutoAdvance';
import { createThemedStyles, useColors } from '../../hooks/useTheme';
import FieldError from './FieldError';

interface TimeInputProps {
  label: string;
  hours: MaskedField;
  minutes: MaskedField;
  seconds: MaskedField;
  /** Mensagem de erro do tempo (vale para os três campos juntos) */
  error?: string | null;
}

interface TimeBlockProps {
  field: MaskedField;
  placeholder: string;
  unit: string;
  accessibilityLabel: string;
  accessibilityHint: string;
  hasError: boolean;
  /** Referência ao campo, para o cursor poder pular até ele */
  inputRef: React.RefObject<TextInput | null>;
  /** Campo seguinte (ao tocar em "próximo" no teclado); ausente no último */
  nextRef?: React.RefObject<TextInput | null>;
}

/** Um dos três campos (h, min ou seg), com a unidade embaixo */
const TimeBlock: React.FC<TimeBlockProps> = ({
  field,
  placeholder,
  unit,
  accessibilityLabel,
  accessibilityHint,
  hasError,
  inputRef,
  nextRef,
}) => {
  const styles = useStyles();
  const colors = useColors();
  return (
    <View style={styles.timeBlock}>
      <TextInput
        ref={inputRef}
        maxFontSizeMultiplier={FONT_SCALE.control}
        style={[styles.timeInput, hasError ? styles.timeInputError : null]}
        value={field.value}
        onChangeText={field.onChangeText}
        onBlur={field.onBlur}
        keyboardType="number-pad"
        placeholder={placeholder}
        placeholderTextColor={colors.text.placeholder}
        maxLength={2}
        // Teclados com tecla "próximo" (ex: Android) levam ao campo seguinte
        returnKeyType={nextRef ? 'next' : 'done'}
        submitBehavior={nextRef ? 'submit' : 'blurAndSubmit'}
        onSubmitEditing={() => nextRef?.current?.focus()}
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={accessibilityHint}
      />
      <Text style={styles.timeUnit} maxFontSizeMultiplier={FONT_SCALE.control}>
        {unit}
      </Text>
    </View>
  );
};

/** Campo de tempo total no formato h : min : seg (extraído do PaceCalculator). */
const TimeInput: React.FC<TimeInputProps> = ({ label, hours, minutes, seconds, error }) => {
  const styles = useStyles();
  const hoursRef = useRef<TextInput>(null);
  const minutesRef = useRef<TextInput>(null);
  const secondsRef = useRef<TextInput>(null);

  // Cursor anda sozinho: horas completas → minutos; minutos completos → segundos
  useAutoAdvance(hours.value, 'hours', hoursRef, minutesRef);
  useAutoAdvance(minutes.value, 'minutes', minutesRef, secondsRef);

  return (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.timeRow}>
        <TimeBlock
          field={hours}
          inputRef={hoursRef}
          nextRef={minutesRef}
          placeholder="0"
          unit="h"
          hasError={Boolean(error)}
          accessibilityLabel="Horas"
          accessibilityHint="Digite as horas"
        />
        <Text style={styles.timeSeparator} maxFontSizeMultiplier={FONT_SCALE.control}>
          :
        </Text>
        <TimeBlock
          field={minutes}
          inputRef={minutesRef}
          nextRef={secondsRef}
          placeholder="00"
          unit="min"
          hasError={Boolean(error)}
          accessibilityLabel="Minutos"
          accessibilityHint="Digite os minutos"
        />
        <Text style={styles.timeSeparator} maxFontSizeMultiplier={FONT_SCALE.control}>
          :
        </Text>
        <TimeBlock
          field={seconds}
          inputRef={secondsRef}
          placeholder="00"
          unit="seg"
          hasError={Boolean(error)}
          accessibilityLabel="Segundos"
          accessibilityHint="Digite os segundos"
        />
      </View>
      <FieldError message={error} />
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
  timeInputError: {
    borderColor: colors.danger,
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
