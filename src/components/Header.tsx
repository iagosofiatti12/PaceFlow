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
  header: {
    backgroundColor: COLORS.background,
    paddingBottom: 0,
    paddingHorizontal: SPACING.xs,
    paddingVertical: SPACING.xs,
  },
  logo: {
    height: 120,
    maxWidth: 140,
    width: SCREEN_WIDTH * 0.35,
  },
});

export default Header;
