import React from 'react';
import { View, Text } from 'react-native';
import { RACE_DISTANCES } from '../../constants/raceDistances';
import { FONT_SCALE, FONT_SIZES, FONTS, RADIUS, SPACING } from '../../constants/theme';
import { formatKm, parseKm } from '../../format/distance';
import { createThemedStyles } from '../../hooks/useTheme';
import { notifySelection } from '../../utils/feedback';
import PressableScale from './PressableScale';

interface DistancePresetsProps {
  /** Texto atual do campo de distância (para destacar o atalho escolhido) */
  value: string;
  /** Recebe o texto da distância escolhida, no mesmo formato do campo ("21,0975") */
  onSelect: (text: string) => void;
}

/**
 * Atalhos das distâncias de prova mais comuns (5K, 10K, 21K, 42K).
 * Um toque preenche o campo de distância; o atalho da distância atual fica destacado.
 */
const DistancePresets: React.FC<DistancePresetsProps> = ({ value, onSelect }) => {
  const styles = useStyles();
  const currentKm = parseKm(value);

  return (
    <View style={styles.row}>
      {RACE_DISTANCES.map((race) => {
        const selected = currentKm === race.km;
        return (
          <PressableScale
            key={race.label}
            onPress={() => {
              if (!selected) notifySelection();
              onSelect(formatKm(race.km));
            }}
            style={[styles.chip, selected && styles.chipSelected]}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            accessibilityLabel={`${race.name}, ${formatKm(race.km)} km`}
            accessibilityHint="Preenche a distância"
            hitSlop={{ top: 6, bottom: 6 }}
          >
            <Text
              style={[styles.chipText, selected && styles.chipTextSelected]}
              maxFontSizeMultiplier={FONT_SCALE.control}
              numberOfLines={1}
            >
              {race.label}
            </Text>
          </PressableScale>
        );
      })}
    </View>
  );
};

const useStyles = createThemedStyles((colors) => ({
  chip: {
    alignItems: 'center',
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.border,
    borderRadius: RADIUS.pill,
    borderWidth: 1,
    flex: 1,
    paddingVertical: SPACING.sm + 2,
  },
  chipSelected: {
    backgroundColor: colors.accentSoft,
    borderColor: colors.accent,
  },
  chipText: {
    color: colors.text.secondary,
    fontFamily: FONTS.monoSemiBold,
    fontSize: FONT_SIZES.sm,
    fontVariant: ['tabular-nums'],
  },
  chipTextSelected: {
    color: colors.accentText,
  },
  // Fica colado embaixo do campo de distância (que já tem margem própria)
  row: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
    marginTop: -SPACING.sm,
  },
}));

export default DistancePresets;
