import React, { useEffect } from 'react';
import { AccessibilityInfo, Text } from 'react-native';
import { FONT_SIZES, FONTS, SPACING } from '../../constants/theme';
import { createThemedStyles } from '../../hooks/useTheme';

interface FieldErrorProps {
  /** Mensagem de erro; null ou undefined = campo sem erro (não mostra nada) */
  message?: string | null;
}

/**
 * Mensagem de erro embaixo de um campo (substitui o Alert que travava a tela).
 * Quando o erro aparece ou muda, o leitor de tela anuncia a mensagem, para
 * quem não enxerga a tela também saber que algo está errado.
 */
const FieldError: React.FC<FieldErrorProps> = ({ message }) => {
  const styles = useStyles();

  useEffect(() => {
    if (message) {
      AccessibilityInfo.announceForAccessibility(message);
    }
  }, [message]);

  if (!message) return null;

  return (
    <Text style={styles.error} accessibilityRole="alert" accessibilityLiveRegion="polite">
      {message}
    </Text>
  );
};

const useStyles = createThemedStyles((colors) => ({
  error: {
    color: colors.danger,
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.sm,
    marginTop: SPACING.xs,
  },
}));

export default FieldError;
