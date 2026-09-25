import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { COLORS, SPACING, FONT_SIZES, FONTS } from '../../constants/theme';

interface ScreenHeaderProps {
  title: string;
  description: string;
}

/** Título e descrição no topo de cada aba (antes, os mesmos estilos em três arquivos). */
const ScreenHeader: React.FC<ScreenHeaderProps> = ({ title, description }) => (
  <>
    <Text style={styles.title} accessibilityRole="header">
      {title}
    </Text>
    <Text style={styles.description}>{description}</Text>
  </>
);

const styles = StyleSheet.create({
  description: {
    color: COLORS.text.secondary,
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.md,
    lineHeight: 22,
    marginBottom: SPACING.lg,
  },
  title: {
    color: COLORS.text.primary,
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZES.xxl,
    marginBottom: SPACING.sm,
  },
});

export default ScreenHeader;
