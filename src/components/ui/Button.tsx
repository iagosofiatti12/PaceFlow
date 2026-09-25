import React from 'react';
import { Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SPACING, RADIUS, FONT_SIZES, FONTS } from '../../constants/theme';
import { createThemedStyles, useColors } from '../../hooks/useTheme';

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
  const styles = useStyles();
  const colors = useColors();
  const isPrimary = variant === 'primary';

  return (
    <Pressable
      style={({ pressed }) => [
        isPrimary ? styles.primaryButton : styles.secondaryButton,
        pressed && styles.pressed,
      ]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? title}
      accessibilityHint={accessibilityHint}
    >
      {icon && (
        <Ionicons
          name={icon}
          size={20}
          color={isPrimary ? colors.onAccent : colors.accentText}
          style={styles.buttonIcon}
        />
      )}
      <Text style={isPrimary ? styles.primaryButtonText : styles.secondaryButtonText}>{title}</Text>
    </Pressable>
  );
};

const useStyles = createThemedStyles((colors) => ({
  buttonIcon: {
    marginRight: SPACING.xs,
  },
  // Retorno visual ao tocar (o TouchableOpacity fazia isso sozinho com opacidade 0.2)
  pressed: {
    opacity: 0.8,
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: colors.accentStrong,
    borderRadius: RADIUS.md,
    elevation: 4,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md + 2,
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
  },
  primaryButtonText: {
    color: colors.onAccent,
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZES.lg,
    letterSpacing: 0.3,
  },
  secondaryButton: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: RADIUS.md,
    borderWidth: 2,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: SPACING.md + 2,
  },
  secondaryButtonText: {
    color: colors.text.secondary,
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.lg,
  },
}));

export default Button;
