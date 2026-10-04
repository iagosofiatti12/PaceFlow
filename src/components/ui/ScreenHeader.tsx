import React from 'react';
import { Text, View } from 'react-native';
import { SPACING, FONT_SIZES, FONTS } from '../../constants/theme';
import { createThemedStyles } from '../../hooks/useTheme';

interface ScreenHeaderProps {
  title: string;
  description: string;
  /** Ação discreta à direita do título (ex: "Limpar") */
  action?: React.ReactNode;
}

/**
 * Título grande no topo de cada aba, fora do cartão (como nos apps atuais),
 * com uma ação opcional à direita e a descrição embaixo.
 */
const ScreenHeader: React.FC<ScreenHeaderProps> = ({ title, description, action }) => {
  const styles = useStyles();

  return (
    <View style={styles.container}>
      <View style={styles.titleRow}>
        <Text style={styles.title} accessibilityRole="header">
          {title}
        </Text>
        {action}
      </View>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
};

const useStyles = createThemedStyles((colors) => ({
  container: {
    marginBottom: SPACING.md,
  },
  description: {
    color: colors.text.secondary,
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.md,
    lineHeight: 22,
  },
  title: {
    color: colors.text.primary,
    flexShrink: 1,
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZES.title,
    letterSpacing: -0.6,
  },
  titleRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: SPACING.sm,
    justifyContent: 'space-between',
    marginBottom: SPACING.xs,
    minHeight: 40,
  },
}));

export default ScreenHeader;
