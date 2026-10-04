import React, { useState } from 'react';
import { View, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RADIUS, SPACING } from '../constants/theme';
import { createThemedStyles, useColors } from '../hooks/useTheme';
import { useThemePreference } from '../hooks/useThemePreference';
import PressableScale from './ui/PressableScale';
import ThemeSheet, { THEME_OPTIONS } from './ThemeSheet';

// O logo.png (o mesmo da splash) tem muita margem transparente: no cabeçalho, o
// desenho ficava com ~16 px de altura. O logo-header.png é o mesmo logo recortado.
const LOGO = require('../../assets/logo-header.png');
const LOGO_HEIGHT = 40;
const LOGO_ASPECT = 247 / 144;

const Header: React.FC = () => {
  const styles = useStyles();
  const colors = useColors();
  const [theme, setTheme] = useThemePreference();
  const [sheetOpen, setSheetOpen] = useState(false);
  const current = THEME_OPTIONS.find((option) => option.value === theme) ?? THEME_OPTIONS[0];

  return (
    <View style={styles.header}>
      <Image
        source={LOGO}
        style={styles.logo}
        resizeMode="contain"
        accessibilityRole="image"
        accessibilityLabel="PaceFlow"
      />

      {/* Botão de aparência: o ícone mostra o tema escolhido (celular, sol ou lua) */}
      <PressableScale
        style={styles.themeButton}
        onPress={() => setSheetOpen(true)}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel={`Aparência: ${current.label}`}
        accessibilityHint="Escolher tema claro, escuro ou automático"
      >
        <Ionicons name={current.icon} size={20} color={colors.text.secondary} />
      </PressableScale>

      <ThemeSheet
        visible={sheetOpen}
        value={theme}
        onChange={setTheme}
        onClose={() => setSheetOpen(false)}
      />
    </View>
  );
};

const useStyles = createThemedStyles((colors) => ({
  // Cabeçalho enxuto: logo à esquerda e aparência à direita.
  // O título de cada tela vem logo abaixo
  header: {
    alignItems: 'center',
    backgroundColor: colors.background,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: SPACING.xs,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.sm,
  },
  logo: {
    height: LOGO_HEIGHT,
    width: LOGO_HEIGHT * LOGO_ASPECT,
  },
  themeButton: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: RADIUS.pill,
    borderWidth: 1,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
}));

export default Header;
