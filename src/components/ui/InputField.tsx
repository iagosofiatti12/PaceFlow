import React from 'react';
import { View, Text, TextInput, KeyboardTypeOptions } from 'react-native';
import { SPACING, RADIUS, FONT_SIZES, FONTS, FONT_SCALE } from '../../constants/theme';
import { createThemedStyles, useColors } from '../../hooks/useTheme';
import FieldError from './FieldError';

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
  /** Chamado quando a pessoa sai do campo (ver `touched` no useMaskedField) */
  onBlur?: () => void;
  /** Mensagem de erro do campo; quando existe, a borda fica vermelha */
  error?: string | null;
}

/**
 * Campo de entrada padrão: rótulo em cima, input com unidade à direita
 * (ex: "km", "/km") e dica ou mensagem de erro embaixo.
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
  onBlur,
  error,
}) => {
  const styles = useStyles();
  const colors = useColors();
  return (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputWrapper, error ? styles.inputWrapperError : null]}>
        <TextInput
          maxFontSizeMultiplier={FONT_SCALE.control}
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          onBlur={onBlur}
          keyboardType={keyboardType}
          placeholder={placeholder}
          placeholderTextColor={colors.text.placeholder}
          maxLength={maxLength}
          accessibilityLabel={accessibilityLabel ?? label}
          accessibilityHint={accessibilityHint}
          // Com erro, o leitor de tela lê a mensagem junto com o campo
          accessibilityValue={error ? { text: error } : undefined}
        />
        {unit && (
          <Text style={styles.inputUnit} maxFontSizeMultiplier={FONT_SCALE.control}>
            {unit}
          </Text>
        )}
      </View>
      {/* Com erro, a mensagem ocupa o lugar da dica */}
      {error ? <FieldError message={error} /> : hint && <Text style={styles.hint}>{hint}</Text>}
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
  inputWrapperError: {
    borderColor: colors.danger,
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
