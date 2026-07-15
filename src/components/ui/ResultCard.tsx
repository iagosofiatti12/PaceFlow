import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SPACING, RADIUS, FONT_SIZES } from '../../constants/theme';
import type { PaceFeedback } from '../../types';

interface ResultCardProps {
  label: string;
  value: string;
  unit?: string;
  subtext?: string;
  feedback?: PaceFeedback | null;
}

/**
 * Cartão laranja de resultado: rótulo em cima, número grande no centro,
 * unidade opcional ao lado, texto de apoio e selo de feedback opcionais.
 */
const ResultCard: React.FC<ResultCardProps> = ({ label, value, unit, subtext, feedback }) => (
  <View style={styles.resultCard}>
    <Text style={styles.resultLabel}>{label}</Text>
    <View style={styles.resultValueContainer}>
      <Text style={styles.resultValue}>{value}</Text>
      {unit && <Text style={styles.resultUnit}>{unit}</Text>}
    </View>
    {subtext && <Text style={styles.resultSubtext}>{subtext}</Text>}

    {feedback && (
      <View style={[styles.feedbackBadge, { backgroundColor: feedback.color }]}>
        <Text style={styles.feedbackText}>{feedback.text}</Text>
      </View>
    )}
  </View>
);

const styles = StyleSheet.create({
  feedbackBadge: {
    borderRadius: RADIUS.xl,
    marginTop: SPACING.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  feedbackText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.md,
    fontWeight: '700',
  },
  resultCard: {
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.xl,
    elevation: 6,
    marginTop: SPACING.xl,
    padding: SPACING.xl,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
  },
  resultLabel: {
    color: COLORS.white,
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    letterSpacing: 1,
    marginBottom: SPACING.sm,
    opacity: 0.95,
    textTransform: 'uppercase',
  },
  resultSubtext: {
    color: COLORS.white,
    fontSize: FONT_SIZES.sm,
    marginTop: SPACING.xs,
    opacity: 0.85,
  },
  resultUnit: {
    color: COLORS.white,
    fontSize: FONT_SIZES.xl + 4,
    fontWeight: '700',
    marginLeft: SPACING.xs,
    opacity: 0.9,
  },
  resultValue: {
    color: COLORS.white,
    fontSize: FONT_SIZES.xxxl,
    fontWeight: '800',
    letterSpacing: -1,
  },
  resultValueContainer: {
    alignItems: 'baseline',
    flexDirection: 'row',
    marginBottom: SPACING.sm,
  },
});

export default ResultCard;
