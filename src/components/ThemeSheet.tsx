import React from 'react';
import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FONT_SCALE, FONT_SIZES, FONTS, RADIUS, SPACING } from '../constants/theme';
import { createThemedStyles, useColors } from '../hooks/useTheme';
import { notifySelection } from '../utils/feedback';
import type { ThemePreference } from '../utils/themePreference';
import PressableScale from './ui/PressableScale';
import Sheet from './ui/Sheet';

interface ThemeSheetProps {
  visible: boolean;
  value: ThemePreference;
  onChange: (value: ThemePreference) => void;
  onClose: () => void;
}

type IconName = keyof typeof Ionicons.glyphMap;

export const THEME_OPTIONS: readonly {
  value: ThemePreference;
  label: string;
  description: string;
  icon: IconName;
}[] = [
  {
    value: 'system',
    label: 'Automático',
    description: 'Segue o tema do celular',
    icon: 'phone-portrait-outline',
  },
  { value: 'light', label: 'Claro', description: 'Sempre claro', icon: 'sunny-outline' },
  { value: 'dark', label: 'Escuro', description: 'Sempre escuro', icon: 'moon-outline' },
];

/**
 * Painel "Aparência", que sobe de baixo: escolher entre seguir o celular,
 * claro ou escuro. A troca vale na hora e fica salva.
 */
const ThemeSheet: React.FC<ThemeSheetProps> = ({ visible, value, onChange, onClose }) => {
  const styles = useStyles();
  const colors = useColors();

  return (
    <Sheet visible={visible} title="Aparência" onClose={onClose}>
      <View accessibilityRole="radiogroup">
        {THEME_OPTIONS.map((option) => {
          const selected = option.value === value;
          return (
            <PressableScale
              key={option.value}
              style={[styles.option, selected && styles.optionSelected]}
              scaleTo={0.98}
              onPress={() => {
                if (!selected) notifySelection();
                onChange(option.value);
                onClose();
              }}
              accessibilityRole="radio"
              accessibilityState={{ checked: selected }}
              accessibilityLabel={`${option.label}: ${option.description}`}
            >
              <View style={[styles.optionIcon, selected && styles.optionIconSelected]}>
                <Ionicons
                  name={option.icon}
                  size={20}
                  color={selected ? colors.accent : colors.iconMuted}
                />
              </View>
              <View style={styles.optionText}>
                <Text style={styles.optionLabel} maxFontSizeMultiplier={FONT_SCALE.control}>
                  {option.label}
                </Text>
                <Text style={styles.optionDescription}>{option.description}</Text>
              </View>
              {selected && <Ionicons name="checkmark-circle" size={22} color={colors.accent} />}
            </PressableScale>
          );
        })}
      </View>
    </Sheet>
  );
};

const useStyles = createThemedStyles((colors) => ({
  option: {
    alignItems: 'center',
    borderColor: colors.border,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    flexDirection: 'row',
    gap: SPACING.md - 4,
    marginBottom: SPACING.sm,
    padding: SPACING.md - 4,
  },
  optionDescription: {
    color: colors.text.secondary,
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.sm,
  },
  optionIcon: {
    alignItems: 'center',
    backgroundColor: colors.surfaceMuted,
    borderRadius: RADIUS.md,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  optionIconSelected: {
    backgroundColor: colors.accentSoft,
  },
  optionLabel: {
    color: colors.text.primary,
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZES.md,
  },
  optionSelected: {
    borderColor: colors.accent,
  },
  optionText: {
    flex: 1,
  },
}));

export default ThemeSheet;
