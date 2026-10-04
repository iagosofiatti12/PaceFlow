import React from 'react';
import { View, Text } from 'react-native';
import Animated, { ZoomIn } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { SPACING, RADIUS, FONT_SIZES, FONTS, FONT_SCALE, MOTION } from '../../constants/theme';
import type { PaceLevel } from '../../domain/levels';
import { PACE_LEVELS } from '../../constants/paceLevels';
import { createThemedStyles, useColors } from '../../hooks/useTheme';
import { enterQuick, enterSection, exitQuick } from './motion';

interface ResultCardProps {
  label: string;
  value: string;
  unit?: string;
  subtext?: string;
  /** Nível do pace: mostra o selo colorido embaixo do número */
  level?: PaceLevel | null;
}

// O selo de nível "pula" ao aparecer ou mudar de nível
const enterBadge = ZoomIn.springify()
  .damping(MOTION.spring.snappy.damping)
  .stiffness(MOTION.spring.snappy.stiffness);

/**
 * Cartão de resultado: degradê laranja, rótulo em cima, número grande no centro,
 * unidade opcional ao lado, texto de apoio e selo de nível opcionais.
 * Entra com uma mola ao aparecer, e o número faz um fade a cada mudança.
 */
const ResultCard: React.FC<ResultCardProps> = ({ label, value, unit, subtext, level }) => {
  const styles = useStyles();
  const colors = useColors();
  const levelStyle = level ? PACE_LEVELS[level] : null;

  return (
    <Animated.View style={styles.shadow} entering={enterSection} exiting={exitQuick}>
      <LinearGradient
        colors={[colors.accentStrong, colors.accentDeep]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.resultCard}
      >
        <Text style={styles.resultLabel}>{label}</Text>
        <View style={styles.resultValueContainer}>
          {/* A `key` muda com o valor: o número novo entra com um fade curto.
              Teto de ampliação e, se ainda assim não couber (ex: "12:34:56"
              com fonte no máximo), encolhe para caber numa linha */}
          <Animated.View key={value} entering={enterQuick} style={styles.resultValueBox}>
            <Text
              style={styles.resultValue}
              maxFontSizeMultiplier={FONT_SCALE.display}
              numberOfLines={1}
              adjustsFontSizeToFit
            >
              {value}
            </Text>
          </Animated.View>
          {unit && (
            <Text style={styles.resultUnit} maxFontSizeMultiplier={FONT_SCALE.display}>
              {unit}
            </Text>
          )}
        </View>
        {subtext && <Text style={styles.resultSubtext}>{subtext}</Text>}

        {levelStyle && (
          <Animated.View
            key={level}
            entering={enterBadge}
            style={[styles.feedbackBadge, { backgroundColor: levelStyle.color }]}
            accessible
            accessibilityLabel={levelStyle.label}
          >
            <Text style={[styles.feedbackText, { color: levelStyle.textColor }]}>
              {`${levelStyle.label} ${levelStyle.emoji}`}
            </Text>
          </Animated.View>
        )}
      </LinearGradient>
    </Animated.View>
  );
};

const useStyles = createThemedStyles((colors) => ({
  feedbackBadge: {
    borderRadius: RADIUS.pill,
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
    borderRadius: RADIUS.xxl,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.xl,
  },
  resultLabel: {
    color: colors.onAccent,
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.sm,
    letterSpacing: 1,
    marginBottom: SPACING.xs,
    opacity: 0.95,
    textTransform: 'uppercase',
  },
  resultSubtext: {
    color: colors.onAccent,
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.sm,
    opacity: 0.9,
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
    fontFamily: FONTS.monoSemiBold,
    fontSize: FONT_SIZES.xxxl + 6,
    fontVariant: ['tabular-nums'],
    letterSpacing: -1,
  },
  resultValueBox: {
    flexShrink: 1,
  },
  resultValueContainer: {
    alignItems: 'baseline',
    flexDirection: 'row',
    marginBottom: SPACING.xs,
  },
  // A sombra fica no invólucro: o degradê tem cantos arredondados próprios
  shadow: {
    borderRadius: RADIUS.xxl,
    elevation: 8,
    marginTop: SPACING.md,
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 18,
  },
}));

export default ResultCard;
