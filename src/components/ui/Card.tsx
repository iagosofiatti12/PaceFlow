import React from 'react';
import { ViewStyle, StyleProp } from 'react-native';
import Animated from 'react-native-reanimated';
import { SPACING, RADIUS } from '../../constants/theme';
import { createThemedStyles } from '../../hooks/useTheme';
import { enterSection } from './motion';

interface CardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  /** Entra com animação ao aparecer (ex: seções que surgem com o resultado) */
  appear?: boolean;
  /**
   * Cartão de formulário: os campos já têm margem embaixo, então o cartão
   * tira o próprio respiro inferior para não sobrar espaço em branco
   */
  form?: boolean;
}

/**
 * Cartão padrão do app (fundo, borda arredondada, contorno fino e sombra leve).
 */
const Card: React.FC<CardProps> = ({ children, style, appear = false, form = false }) => {
  const styles = useStyles();

  return (
    <Animated.View
      style={[styles.card, form && styles.form, style]}
      entering={appear ? enterSection : undefined}
    >
      {children}
    </Animated.View>
  );
};

const useStyles = createThemedStyles((colors) => ({
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: RADIUS.xxl,
    borderWidth: 1,
    elevation: 2,
    padding: SPACING.lg - 4,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 18,
  },
  form: {
    paddingBottom: SPACING.xs,
  },
}));

export default Card;
