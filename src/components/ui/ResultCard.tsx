import React from 'react';
import { View, Text } from 'react-native';
import { SPACING, RADIUS, FONT_SIZES, FONTS, FONT_SCALE } from '../../constants/theme';
import type { PaceLevel } from '../../domain/levels';
import { PACE_LEVELS } from '../../constants/paceLevels';
import { createThemedStyles } from '../../hooks/useTheme';

interface ResultCardProps {
  label: string;
  value: string;
  unit?: string;
  subtext?: string;
  /** Nível do pace: mostra o selo colorido embaixo do número */
  level?: PaceLevel | null;
}

/**
 * Cartão laranja de resultado: rótulo em cima, número grande no centro,
 * unidade opcional ao lado, texto de apoio e selo de nível opcionais.
 */
const ResultCard: React.FC<ResultCardProps> = ({ label, value, unit, subtext, level }) => {
  const styles = useStyles();
  const levelStyle = level ? PACE_LEVELS[level] : null;

  return (
    <View style={styles.resultCard}>
      <Text style={styles.resultLabel}>{label}</Text>
      <View style={styles.resultValueContainer}>
        {/* Número grande: teto de ampliação e, se ainda assim não couber
            (ex: "12:34:56" com fonte no máximo), encolhe para caber numa linha */}
        <Text
          style={styles.resultValue}
          maxFontSizeMultiplier={FONT_SCALE.display}
          numberOfLines={1}
          adjustsFontSizeToFit
        >
          {value}
        </Text>
        {unit && (
          <Text style={styles.resultUnit} maxFontSizeMultiplier={FONT_SCALE.display}>
            {unit}
          </Text>
        )}
      </View>
      {subtext && <Text style={styles.resultSubtext}>{subtext}</Text>}

      {levelStyle && (
        <View
          style={[styles.feedbackBadge, { backgroundColor: levelStyle.color }]}
          accessible
          accessibilityLabel={levelStyle.label}
        >
          <Text style={[styles.feedbackText, { color: levelStyle.textColor }]}>
            {`${levelStyle.label} ${levelStyle.emoji}`}
          </Text>
        </View>
      )}
    </View>
  );
};

const useStyles = createThemedStyles((colors) => ({
  feedbackBadge: {
    borderRadius: RADIUS.xl,
    marginTop: SPACING.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  feedbackText: {
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZES.md,
  },
  resultCard: {
    alignItems: 'center',
    backgroundColor: colors.accentStrong,
    borderRadius: RADIUS.xl,
    elevation: 6,
    // Fica entre os campos (que já têm margem embaixo) e os botões
    marginBottom: SPACING.md,
    padding: SPACING.xl,
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
  },
  resultLabel: {
    color: colors.onAccent,
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.sm,
    letterSpacing: 0.5,
    marginBottom: SPACING.sm,
    opacity: 0.95,
  },
  resultSubtext: {
    color: colors.onAccent,
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.sm,
    marginTop: SPACING.xs,
    opacity: 0.85,
  },
  resultUnit: {
    color: colors.onAccent,
    fontFamily: FONTS.mono,
    fontSize: FONT_SIZES.xl + 4,
    marginLeft: SPACING.xs,
    opacity: 0.9,
  },
  resultValue: {
    color: colors.onAccent,
    fontFamily: FONTS.mono,
    fontSize: FONT_SIZES.xxxl,
    fontVariant: ['tabular-nums'],
  },
  resultValueContainer: {
    alignItems: 'baseline',
    flexDirection: 'row',
    marginBottom: SPACING.sm,
  },
}));

export default ResultCard;
