import React from 'react';
import { View, Image } from 'react-native';
import { SPACING } from '../constants/theme';
import { createThemedStyles } from '../hooks/useTheme';

// O logo.png (o mesmo da splash) tem muita margem transparente: no cabeçalho, o
// desenho ficava com ~16 px de altura. O logo-header.png é o mesmo logo recortado.
const LOGO = require('../../assets/logo-header.png');
const LOGO_HEIGHT = 40;
const LOGO_ASPECT = 247 / 144;

const Header: React.FC = () => {
  const styles = useStyles();

  return (
    <View style={styles.header}>
      <Image
        source={LOGO}
        style={styles.logo}
        resizeMode="contain"
        accessibilityRole="image"
        accessibilityLabel="PaceFlow"
      />
    </View>
  );
};

const useStyles = createThemedStyles((colors) => ({
  // Cabeçalho enxuto: só o logo, à esquerda. O título de cada tela vem logo abaixo
  header: {
    backgroundColor: colors.background,
    paddingBottom: SPACING.xs,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.sm,
  },
  logo: {
    height: LOGO_HEIGHT,
    width: LOGO_HEIGHT * LOGO_ASPECT,
  },
}));

export default Header;
