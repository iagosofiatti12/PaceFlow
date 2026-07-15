import React from 'react';
import { View, Text, TextInput, StyleSheet, KeyboardTypeOptions } from 'react-native';
import { COLORS, SPACING, RADIUS, FONT_SIZES, FONTS } from '../../constants/theme';

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
}) => (
  <View style={styles.inputGroup}>
    <Text style={styles.label}>{label}</Text>
    <View style={styles.inputWrapper}>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        placeholder={placeholder}
        placeholderTextColor={COLORS.text.light}
        maxLength={maxLength}
        accessibilityLabel={accessibilityLabel ?? label}
        accessibilityHint={accessibilityHint}
      />
      {unit && <Text style={styles.inputUnit}>{unit}</Text>}
    </View>
    {hint && <Text style={styles.hint}>{hint}</Text>}
  </View>
);

const styles = StyleSheet.create({
  hint: {
    color: COLORS.text.light,
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.xs,
    marginTop: SPACING.xs,
  },
  input: {
    color: COLORS.text.primary,
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
    color: COLORS.primary,
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.md,
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
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.md,
    letterSpacing: 0.3,
    marginBottom: SPACING.sm,
  },
});

export default InputField;
