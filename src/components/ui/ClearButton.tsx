import React from 'react';
import { Text } from 'react-native';
import Animated from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { FONT_SCALE, FONT_SIZES, FONTS, RADIUS, SPACING } from '../../constants/theme';
import { createThemedStyles, useColors } from '../../hooks/useTheme';
import PressableScale from './PressableScale';
import { enterQuick, exitQuick } from './motion';

interface ClearButtonProps {
  /** Só aparece quando há algo para limpar */
  visible: boolean;
  onPress: () => void;
  /** Texto do botão (padrão: "Limpar") */
  title?: string;
  accessibilityLabel: string;
  accessibilityHint?: string;
  /** Ação destrutiva de verdade (ex: apagar o histórico): texto vermelho */
  destructive?: boolean;
}

/**
 * Botão pequeno de "Limpar", ao lado do título da aba. Aparece com um fade
 * quando há algo digitado, em vez de ocupar uma linha inteira o tempo todo.
 */
const ClearButton: React.FC<ClearButtonProps> = ({
  visible,
  onPress,
  title = 'Limpar',
  accessibilityLabel,
  accessibilityHint,
  destructive = false,
}) => {
  const styles = useStyles();
  const colors = useColors();
  if (!visible) return null;

  const color = destructive ? colors.danger : colors.text.secondary;
  return (
    <Animated.View entering={enterQuick} exiting={exitQuick}>
      <PressableScale
        style={styles.button}
        onPress={onPress}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={accessibilityHint}
      >
        <Ionicons name={destructive ? 'trash-outline' : 'refresh'} size={16} color={color} />
        <Text
          style={[styles.text, { color }]}
          maxFontSizeMultiplier={FONT_SCALE.control}
          numberOfLines={1}
        >
          {title}
        </Text>
      </PressableScale>
    </Animated.View>
  );
};

const useStyles = createThemedStyles((colors) => ({
  button: {
    alignItems: 'center',
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.border,
    borderRadius: RADIUS.pill,
    borderWidth: 1,
    flexDirection: 'row',
    gap: SPACING.xs,
    paddingHorizontal: SPACING.md - 4,
    paddingVertical: SPACING.sm - 2,
  },
  text: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.sm,
  },
}));

export default ClearButton;
