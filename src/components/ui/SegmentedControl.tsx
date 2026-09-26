import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { FONT_SCALE, FONT_SIZES, FONTS, RADIUS, SPACING } from '../../constants/theme';
import { createThemedStyles } from '../../hooks/useTheme';

export interface SegmentOption<T extends string> {
  value: T;
  label: string;
  /** Descrição lida pelo leitor de tela (quando o rótulo curto não basta) */
  accessibilityLabel?: string;
}

interface SegmentedControlProps<T extends string> {
  options: readonly SegmentOption<T>[];
  value: T;
  onChange: (value: T) => void;
}

/**
 * Botões lado a lado para escolher um modo (ex: "Sei a velocidade" / "Sei o pace").
 * Visual igual ao da aba ativa: pílula laranja-clara na opção escolhida.
 */
const SegmentedControl = <T extends string>({
  options,
  value,
  onChange,
}: SegmentedControlProps<T>): React.ReactElement => {
  const styles = useStyles();

  return (
    <View style={styles.container} accessibilityRole="radiogroup">
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <Pressable
            key={option.value}
            onPress={() => onChange(option.value)}
            style={({ pressed }) => [
              styles.segment,
              selected && styles.segmentSelected,
              pressed && styles.pressed,
            ]}
            accessibilityRole="radio"
            accessibilityState={{ checked: selected }}
            accessibilityLabel={option.accessibilityLabel ?? option.label}
          >
            <Text
              style={[styles.label, selected && styles.labelSelected]}
              maxFontSizeMultiplier={FONT_SCALE.control}
              numberOfLines={1}
              adjustsFontSizeToFit
            >
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};

const useStyles = createThemedStyles((colors) => ({
  container: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: RADIUS.md,
    flexDirection: 'row',
    marginBottom: SPACING.lg,
    padding: SPACING.xs,
  },
  label: {
    color: colors.text.tertiary,
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.sm,
  },
  labelSelected: {
    color: colors.accentText,
    fontFamily: FONTS.semiBold,
  },
  pressed: {
    opacity: 0.7,
  },
  segment: {
    alignItems: 'center',
    borderRadius: RADIUS.sm,
    flex: 1,
    paddingVertical: SPACING.sm,
  },
  segmentSelected: {
    backgroundColor: colors.accentSoft,
  },
}));

export default SegmentedControl;
