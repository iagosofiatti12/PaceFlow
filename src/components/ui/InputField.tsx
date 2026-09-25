import React from 'react';
import { View, Text, TextInput, KeyboardTypeOptions } from 'react-native';
import { SPACING, RADIUS, FONT_SIZES, FONTS, FONT_SCALE } from '../../constants/theme';
import { createThemedStyles, useColors } from '../../hooks/useTheme';

interface InputFieldProps {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  unit?: string;
  placeholder?: string;
  keyboardType?: KeyboardTypeOptions;
  maxLength?: number;
  hint?: string;
  accessibilityLabel?: string;
  accessibilityHint?: string;
}

/**
 * Campo de entrada padrão: rótulo em cima, input com unidade à direita
 * (ex: "km", "/km") e dica opcional embaixo.
 */
const InputField: React.FC<InputFieldProps> = ({
  label,
  value,
  onChangeText,
  unit,
  placeholder,
  keyboardType = 'decimal-pad',
  maxLength,
  hint,
  accessibilityLabel,
  accessibilityHint,
}) => {
  const styles = useStyles();
  const colors = useColors();
  return (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputWrapper}>
        <TextInput
          maxFontSizeMultiplier={FONT_SCALE.control}
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          placeholder={placeholder}
          placeholderTextColor={colors.text.placeholder}
          maxLength={maxLength}
          accessibilityLabel={accessibilityLabel ?? label}
          accessibilityHint={accessibilityHint}
        />
        {unit && (
          <Text style={styles.inputUnit} maxFontSizeMultiplier={FONT_SCALE.control}>
            {unit}
          </Text>
        )}
      </View>
      {hint && <Text style={styles.hint}>{hint}</Text>}
    </View>
  );
};

const useStyles = createThemedStyles((colors) => ({
  hint: {
    color: colors.text.tertiary,
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.xs,
    marginTop: SPACING.xs,
  },
  input: {
    color: colors.text.primary,
    flex: 1,
    fontFamily: FONTS.mono,
    fontSize: FONT_SIZES.xl,
    fontVariant: ['tabular-nums'],
    padding: SPACING.md,
  },
  inputGroup: {
    marginBottom: SPACING.lg,
  },
  inputUnit: {
    color: colors.accentText,
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.md,
  },
  inputWrapper: {
    alignItems: 'center',
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.border,
    borderRadius: RADIUS.md,
    borderWidth: 2,
    flexDirection: 'row',
    paddingRight: SPACING.md,
  },
  label: {
    color: colors.text.label,
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.md,
    letterSpacing: 0.3,
    marginBottom: SPACING.sm,
  },
}));

export default InputField;
