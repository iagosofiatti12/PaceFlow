import React from 'react';
import { Text } from 'react-native';
import { SPACING, FONT_SIZES, FONTS } from '../../constants/theme';
import { createThemedStyles } from '../../hooks/useTheme';

interface ScreenHeaderProps {
  title: string;
  description: string;
}

/** Título e descrição no topo de cada aba (antes, os mesmos estilos em três arquivos). */
const ScreenHeader: React.FC<ScreenHeaderProps> = ({ title, description }) => {
  const styles = useStyles();

  return (
    <>
      <Text style={styles.title} accessibilityRole="header">
        {title}
      </Text>
      <Text style={styles.description}>{description}</Text>
    </>
  );
};

const useStyles = createThemedStyles((colors) => ({
  description: {
    color: colors.text.secondary,
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.md,
    lineHeight: 22,
    marginBottom: SPACING.lg,
  },
  title: {
    color: colors.text.primary,
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZES.xxl,
    marginBottom: SPACING.sm,
  },
}));

export default ScreenHeader;
