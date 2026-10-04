import React from 'react';
import { Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SPACING, RADIUS, FONT_SIZES, FONTS, FONT_SCALE } from '../../constants/theme';
import { createThemedStyles, useColors } from '../../hooks/useTheme';
import PressableScale from './PressableScale';

interface ButtonProps {
  title: string;
  onPress: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
  variant?: 'primary' | 'secondary';
  accessibilityLabel?: string;
  accessibilityHint?: string;
  /** Desabilitado: não responde ao toque e fica esmaecido */
  disabled?: boolean;
}

/**
 * Botão padrão do app em duas variantes:
 * - primary: pílula laranja (ação principal, ex: "Salvar no histórico")
 * - secondary: pílula com borda (ação de apoio)
 */
const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  icon,
  variant = 'primary',
  accessibilityLabel,
  accessibilityHint,
  disabled = false,
}) => {
  const styles = useStyles();
  const colors = useColors();
  const isPrimary = variant === 'primary';

  return (
    <PressableScale
      style={[
        isPrimary ? styles.primaryButton : styles.secondaryButton,
        disabled && styles.disabled,
      ]}
      onPress={onPress}
      disabled={disabled}
      accessibilityState={{ disabled }}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? title}
      accessibilityHint={accessibilityHint}
    >
      {icon && (
        <Ionicons name={icon} size={20} color={isPrimary ? colors.onAccent : colors.accentText} />
      )}
      {/* Numa linha só: se não couber (fonte ampliada), encolhe em vez de cortar */}
      <Text
        style={isPrimary ? styles.primaryButtonText : styles.secondaryButtonText}
        maxFontSizeMultiplier={FONT_SCALE.control}
        numberOfLines={1}
        adjustsFontSizeToFit
      >
        {title}
      </Text>
    </PressableScale>
  );
};

const useStyles = createThemedStyles((colors) => ({
  // Esmaecido quando desabilitado (a WCAG dispensa contraste em controles inativos)
  disabled: {
    opacity: 0.45,
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: colors.accentStrong,
    borderRadius: RADIUS.pill,
    elevation: 4,
    flex: 1,
    flexDirection: 'row',
    gap: SPACING.sm,
    justifyContent: 'center',
    minHeight: 56,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 14,
  },
  primaryButtonText: {
    color: colors.onAccent,
    flexShrink: 1,
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZES.lg,
    letterSpacing: 0.2,
  },
  secondaryButton: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: RADIUS.pill,
    borderWidth: 1.5,
    flex: 1,
    flexDirection: 'row',
    gap: SPACING.sm,
    justifyContent: 'center',
    minHeight: 56,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  secondaryButtonText: {
    color: colors.text.secondary,
    flexShrink: 1,
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.lg,
  },
}));

export default Button;
