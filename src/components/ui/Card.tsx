import React from 'react';
import { View, ViewStyle, StyleProp } from 'react-native';
import { SPACING, RADIUS } from '../../constants/theme';
import { createThemedStyles } from '../../hooks/useTheme';

interface CardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

/**
 * Cartão branco padrão do app (fundo, borda arredondada e sombra).
 * Usado como container das calculadoras, tabela e histórico.
 */
const Card: React.FC<CardProps> = ({ children, style }) => {
  const styles = useStyles();

  return <View style={[styles.card, style]}>{children}</View>;
};

const useStyles = createThemedStyles((colors) => ({
  card: {
    backgroundColor: colors.surface,
    borderRadius: RADIUS.xxl,
    elevation: 3,
    padding: SPACING.lg,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
  },
}));

export default Card;
