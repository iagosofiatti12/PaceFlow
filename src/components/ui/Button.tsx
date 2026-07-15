import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, FONT_SIZES } from '../../constants/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
  variant?: 'primary' | 'secondary';
  accessibilityLabel?: string;
  accessibilityHint?: string;
}

/**
 * Botão padrão do app em duas variantes:
 * - primary: fundo laranja (ação principal, ex: "Calcular")
 * - secondary: fundo branco com borda (ação de apoio, ex: "Limpar")
 */
const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  icon,
  variant = 'primary',
  accessibilityLabel,
  accessibilityHint,
}) => {
  const isPrimary = variant === 'primary';

  return (
    <TouchableOpacity
      style={isPrimary ? styles.primaryButton : styles.secondaryButton}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? title}
      accessibilityHint={accessibilityHint}
    >
      {icon && (
        <Ionicons
          name={icon}
          size={20}
          color={isPrimary ? COLORS.white : COLORS.primary}
          style={styles.buttonIcon}
        />
      )}
      <Text style={isPrimary ? styles.primaryButtonText : styles.secondaryButtonText}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonIcon: {
    marginRight: SPACING.xs,
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    elevation: 4,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: SPACING.md,
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
});

export default Button;
