import React from 'react';
import { View, Image, StyleSheet, useWindowDimensions } from 'react-native';
import { COLORS, SPACING } from '../constants/theme';

const Header: React.FC = () => {
  // useWindowDimensions (e não Dimensions.get fora do componente) acompanha
  // rotação, tablets e celulares dobráveis: a largura se atualiza sozinha
  const { width } = useWindowDimensions();

  return (
    <View style={styles.header}>
      <Image
        source={require('../../assets/logo.png')}
        style={[styles.logo, { width: width * 0.28 }]}
        resizeMode="contain"
        accessibilityRole="image"
        accessibilityLabel="PaceFlow"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  // Header compacto (ver DESIGN.md): logo ~44px alinhada à esquerda,
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
  },
});

export default Header;
