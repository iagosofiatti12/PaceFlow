import React from 'react';
import { View, Text } from 'react-native';
import { RACE_DISTANCES } from '../constants/raceDistances';
import { FONT_SCALE, FONT_SIZES, FONTS, RADIUS, SPACING } from '../constants/theme';
import { predictRaces } from '../domain/prediction';
import { formatPace, formatSecondsToTime } from '../format/time';
import { createThemedStyles } from '../hooks/useTheme';

interface RacePredictionsProps {
  /** Distância do resultado que serve de base (km) */
  distanceKm: number;
  /** Tempo do resultado que serve de base (segundos) */
  durationSeconds: number;
}

/**
 * "Previsão de prova": com o resultado calculado, estima o tempo nas
 * distâncias de prova mais comuns (fórmula de Riegel, em domain/prediction.ts).
 * Não aparece quando a base é curta demais para uma previsão confiável.
 */
const RacePredictions: React.FC<RacePredictionsProps> = ({ distanceKm, durationSeconds }) => {
  const styles = useStyles();
  const predictions = predictRaces(
    distanceKm,
    durationSeconds,
    RACE_DISTANCES.map((race) => race.km),
  );

  if (predictions.length === 0) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title} accessibilityRole="header">
        Previsão de prova
      </Text>
      <Text style={styles.subtitle}>Mantendo esse nível, você faria:</Text>

      {predictions.map((prediction) => {
        const race = RACE_DISTANCES.find((r) => r.km === prediction.km);
        const time = formatSecondsToTime(prediction.seconds);
        const pace = formatPace(prediction.paceSeconds);
        return (
          <View
            key={prediction.km}
            style={styles.row}
            accessible
            accessibilityLabel={`${race?.name ?? ''}: ${time}, pace ${pace} por km`}
          >
            <View style={styles.raceInfo}>
              <Text style={styles.raceLabel} maxFontSizeMultiplier={FONT_SCALE.control}>
                {race?.label}
              </Text>
              <Text style={styles.raceName}>{race?.name}</Text>
            </View>
            <View style={styles.values}>
              <Text style={styles.time} maxFontSizeMultiplier={FONT_SCALE.control}>
                {time}
              </Text>
              <Text style={styles.pace} maxFontSizeMultiplier={FONT_SCALE.control}>
                {pace} /km
              </Text>
            </View>
          </View>
        );
      })}

      <Text style={styles.footnote}>
        Estimativa pela fórmula de Riegel. Considera treino adequado para cada distância; para a
        maratona, costuma ser otimista.
      </Text>
    </View>
  );
};

const useStyles = createThemedStyles((colors) => ({
  container: {
    borderTopColor: colors.border,
    borderTopWidth: 1,
    marginTop: SPACING.lg,
    paddingTop: SPACING.lg,
  },
  footnote: {
    color: colors.text.tertiary,
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.xs,
    lineHeight: 18,
    marginTop: SPACING.sm,
  },
  pace: {
    color: colors.text.secondary,
    fontFamily: FONTS.mono,
    fontSize: FONT_SIZES.xs,
    fontVariant: ['tabular-nums'],
  },
  raceInfo: {
    flex: 1,
  },
  raceLabel: {
    color: colors.accentText,
    fontFamily: FONTS.monoSemiBold,
    fontSize: FONT_SIZES.md,
    fontVariant: ['tabular-nums'],
  },
  raceName: {
    color: colors.text.secondary,
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.xs,
  },
  row: {
    alignItems: 'center',
    backgroundColor: colors.surfaceMuted,
    borderRadius: RADIUS.sm,
    flexDirection: 'row',
    marginBottom: SPACING.sm,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  subtitle: {
    color: colors.text.secondary,
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.sm,
    marginBottom: SPACING.md,
  },
  time: {
    color: colors.text.primary,
    fontFamily: FONTS.monoSemiBold,
    fontSize: FONT_SIZES.lg,
    fontVariant: ['tabular-nums'],
  },
  title: {
    color: colors.text.primary,
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZES.lg,
  },
  values: {
    alignItems: 'flex-end',
  },
}));

export default RacePredictions;
