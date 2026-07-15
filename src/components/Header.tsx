import React from 'react';
import { View, Image, StyleSheet, Dimensions } from 'react-native';
import { COLORS, SPACING } from '../constants/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const Header: React.FC = () => {
  return (
    <View style={styles.header}>
      <Image
        source={require('../../assets/logo.png')}
        style={styles.logo}
        resizeMode="contain"
        accessibilityLabel="Logo do aplicativo Pace Calculator"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  // Header compacto (ver design_audit): logo ~44px alinhada à esquerda,
  // devolvendo espaço vertical para o conteúdo
  header: {
    backgroundColor: COLORS.background,
    paddingBottom: SPACING.xs,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.sm,
  },
  logo: {
    height: 44,
    maxWidth: 110,
    width: SCREEN_WIDTH * 0.28,
  },
});

export default Header;
