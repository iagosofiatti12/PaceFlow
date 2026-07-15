import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { COLORS, SPACING, RADIUS } from '../../constants/theme';

interface CardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

/**
 * Cartão branco padrão do app (fundo, borda arredondada e sombra).
 * Usado como container das calculadoras, tabela e histórico.
 */
const Card: React.FC<CardProps> = ({ children, style }) => (
  <View style={[styles.card, style]}>{children}</View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.xxl,
    elevation: 3,
    padding: SPACING.lg,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
  },
});

export default Card;
