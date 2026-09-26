import React from 'react';
import { View, Text } from 'react-native';
import { TRAINING_ZONE_INFO } from '../constants/trainingZones';
import { FONT_SCALE, FONT_SIZES, FONTS, RADIUS, SPACING } from '../constants/theme';
import { trainingPaces } from '../domain/trainingZones';
import { formatPace } from '../format/time';
import { createThemedStyles } from '../hooks/useTheme';

interface TrainingPacesProps {
  /** Distância do resultado que serve de base (km) */
  distanceKm: number;
  /** Tempo do resultado que serve de base (segundos) */
  durationSeconds: number;
}

/**
 * "Ritmos de treino": com o resultado calculado, mostra o pace de cada tipo
 * de treino pelo método de Daniels (conta em domain/trainingZones.ts).
 * Não aparece quando a base é curta demais ou fora da faixa confiável.
 */
const TrainingPaces: React.FC<TrainingPacesProps> = ({ distanceKm, durationSeconds }) => {
  const styles = useStyles();
  const paces = trainingPaces(distanceKm, durationSeconds);

  if (!paces) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title} accessibilityRole="header">
        Ritmos de treino
      </Text>
      <Text style={styles.subtitle}>Para treinar no seu nível atual:</Text>

      {paces.map(({ zone, fastSeconds, slowSeconds }) => {
        const info = TRAINING_ZONE_INFO[zone];
        // Zona com faixa (leve) mostra "do mais rápido ao mais lento"
        const pace =
          fastSeconds === slowSeconds
            ? formatPace(fastSeconds)
            : `${formatPace(fastSeconds)} – ${formatPace(slowSeconds)}`;
        const spokenPace =
          fastSeconds === slowSeconds
            ? formatPace(fastSeconds)
            : `de ${formatPace(fastSeconds)} a ${formatPace(slowSeconds)}`;
        return (
          <View
            key={zone}
            style={styles.row}
            accessible
            accessibilityLabel={`${info.label}, ${info.description}: pace ${spokenPace} por km`}
          >
            <View style={styles.zoneInfo}>
              <Text style={styles.zoneLabel} maxFontSizeMultiplier={FONT_SCALE.control}>
                {info.label}
              </Text>
              <Text style={styles.zoneDescription}>{info.description}</Text>
            </View>
            <Text style={styles.pace} maxFontSizeMultiplier={FONT_SCALE.control}>
              {pace} /km
            </Text>
          </View>
        );
      })}

      <Text style={styles.footnote}>
        Método de Jack Daniels (VDOT). Use um resultado recente de prova ou teste feito no seu
        máximo; com treino leve, os ritmos ficam lentos demais.
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
    color: colors.text.primary,
    fontFamily: FONTS.monoSemiBold,
    fontSize: FONT_SIZES.md,
    fontVariant: ['tabular-nums'],
  },
  row: {
    alignItems: 'center',
    backgroundColor: colors.surfaceMuted,
    borderRadius: RADIUS.sm,
    flexDirection: 'row',
    gap: SPACING.sm,
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
  title: {
    color: colors.text.primary,
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZES.lg,
  },
  zoneDescription: {
    color: colors.text.secondary,
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.xs,
  },
  zoneInfo: {
    flex: 1,
  },
  zoneLabel: {
    color: colors.accentText,
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZES.md,
  },
}));

export default TrainingPaces;
