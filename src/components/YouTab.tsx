import React, { useCallback, useState } from 'react';
import { Alert, Text, TextInput, View } from 'react-native';
import Animated, { ZoomIn } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import { RACE_DISTANCES } from '../constants/raceDistances';
import { RUN_TYPES } from '../constants/runTypes';
import { FONT_SCALE, FONT_SIZES, FONTS, MOTION, RADIUS, SPACING } from '../constants/theme';
import { bestFitnessRun, goalProgress, personalRecords } from '../domain/records';
import { calculatePace } from '../domain/pace';
import { formatKm } from '../format/distance';
import { formatRunDay } from '../format/dates';
import { formatPace, formatSecondsToTime } from '../format/time';
import { usePersonalData } from '../hooks/usePersonalData';
import { createThemedStyles, useColors } from '../hooks/useTheme';
import { notifySuccess } from '../utils/feedback';
import { MAX_NAME_LENGTH } from '../utils/personalSchema';
import type { NewRun } from '../utils/personalStorage';
import GoalSheet from './GoalSheet';
import RunSheet from './RunSheet';
import TrainingPaces from './TrainingPaces';
import Button from './ui/Button';
import Card from './ui/Card';
import ClearButton from './ui/ClearButton';
import PressableScale from './ui/PressableScale';
import ScreenHeader from './ui/ScreenHeader';
import { enterItem } from './ui/motion';

const RACE_KMS = RACE_DISTANCES.map((race) => race.km);

/** Quantos treinos mostrar antes do "Ver mais" */
const RUNS_PAGE = 20;

const enterCelebration = ZoomIn.springify()
  .damping(MOTION.spring.snappy.damping)
  .stiffness(MOTION.spring.snappy.stiffness);

/** Nome curto da prova para o aviso de recorde ("10K", "meia maratona") */
const raceName = (km: number): string => {
  const race = RACE_DISTANCES.find((r) => r.km === km);
  return race ? race.label : `${formatKm(km)} km`;
};

/**
 * Aba "Você": o lado pessoal do app, sem login. Perfil, recordes pessoais,
 * meta, ritmos de treino fixos e o diário de treinos, tudo salvo no aparelho.
 */
const YouTab: React.FC = () => {
  const styles = useStyles();
  const colors = useColors();
  const data = usePersonalData();
  const { reload } = data;
  const [nameDraft, setNameDraft] = useState('');
  const [editingName, setEditingName] = useState(false);
  const [runSheetOpen, setRunSheetOpen] = useState(false);
  const [goalSheetOpen, setGoalSheetOpen] = useState(false);
  const [celebration, setCelebration] = useState<string | null>(null);
  const [visibleRuns, setVisibleRuns] = useState(RUNS_PAGE);

  // Treinos podem ser registrados pela aba Pace: recarrega ao voltar para cá
  useFocusEffect(
    useCallback(() => {
      reload();
    }, [reload]),
  );

  const records = personalRecords(data.runs, RACE_KMS);
  const progress = data.goal ? goalProgress(data.goal, data.runs) : null;
  const fitness = bestFitnessRun(data.runs);
  const name = data.profile?.name;
  const askName = data.loaded && (!name || editingName);

  const handleSaveName = async (): Promise<void> => {
    const trimmed = nameDraft.trim();
    if (!trimmed) return;
    await data.setName(trimmed);
    setEditingName(false);
  };

  const handleLogRun = async (run: NewRun): Promise<void> => {
    const broken = await data.logRun(run);
    if (broken.length > 0) {
      notifySuccess();
      setCelebration(`Novo recorde: ${broken.map(raceName).join(', ')}! 🎉`);
    } else {
      setCelebration(null);
    }
  };

  const handleDeleteRun = (id: string, label: string): void => {
    Alert.alert('Excluir treino', `Excluir o treino de ${label}?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Excluir', style: 'destructive', onPress: () => data.removeRun(id) },
    ]);
  };

  return (
    <>
      <ScreenHeader
        title={name ? `Olá, ${name}` : 'Você'}
        description="Seus recordes, sua meta e seus treinos. Tudo fica só no seu celular."
        action={
          <ClearButton
            visible={Boolean(name) && !editingName}
            title="Editar nome"
            icon="pencil"
            onPress={() => {
              setNameDraft(name ?? '');
              setEditingName(true);
            }}
            accessibilityLabel="Editar nome"
          />
        }
      />

      {askName && (
        <Card appear style={styles.section}>
          <Text style={styles.sectionTitle}>Como você se chama?</Text>
          <View style={styles.nameRow}>
            <TextInput
              style={styles.nameInput}
              value={nameDraft}
              onChangeText={setNameDraft}
              placeholder="Seu nome"
              placeholderTextColor={colors.text.placeholder}
              maxLength={MAX_NAME_LENGTH}
              autoCapitalize="words"
              returnKeyType="done"
              onSubmitEditing={handleSaveName}
              accessibilityLabel="Seu nome"
            />
            <PressableScale
              style={styles.nameSave}
              onPress={handleSaveName}
              accessibilityRole="button"
              accessibilityLabel="Salvar nome"
            >
              <Ionicons name="checkmark" size={22} color={colors.onAccent} />
            </PressableScale>
          </View>
        </Card>
      )}

      {celebration && (
        <Animated.View
          key={celebration}
          entering={enterCelebration}
          style={styles.celebration}
          accessibilityLiveRegion="polite"
        >
          <Ionicons name="trophy" size={22} color={colors.onAccent} />
          <Text style={styles.celebrationText}>{celebration}</Text>
        </Animated.View>
      )}

      {/* Recordes pessoais: um quadrinho por distância de prova */}
      <Card style={styles.section}>
        <Text style={styles.sectionTitle} accessibilityRole="header">
          Recordes pessoais
        </Text>
        <View style={styles.recordsGrid}>
          {RACE_DISTANCES.map((race) => {
            const record = records.find((r) => r.km === race.km);
            const time = record ? formatSecondsToTime(record.seconds) : '—';
            return (
              <View
                key={race.label}
                style={styles.recordBox}
                accessible
                accessibilityLabel={
                  record
                    ? `Recorde ${race.name}: ${time}, pace ${formatPace(record.paceSeconds)} por km`
                    : `${race.name}: sem recorde ainda`
                }
              >
                <Text style={styles.recordLabel} maxFontSizeMultiplier={FONT_SCALE.control}>
                  {race.label}
                </Text>
                <Text style={styles.recordTime} maxFontSizeMultiplier={FONT_SCALE.control}>
                  {time}
                </Text>
                <Text style={styles.recordMeta} maxFontSizeMultiplier={FONT_SCALE.control}>
                  {record
                    ? `${formatPace(record.paceSeconds)}/km · ${formatRunDay(record.date)}`
                    : 'sem marca'}
                </Text>
              </View>
            );
          })}
        </View>
        <Text style={styles.footnote}>
          Vale o treino registrado na distância da prova (até 1% de diferença, por causa do GPS).
        </Text>
      </Card>

      {/* Meta */}
      <Card style={styles.section}>
        <View style={styles.rowBetween}>
          <Text style={styles.sectionTitle} accessibilityRole="header">
            Meta
          </Text>
          {data.goal && (
            <ClearButton
              visible
              title="Editar"
              icon="pencil"
              onPress={() => setGoalSheetOpen(true)}
              accessibilityLabel="Editar meta"
            />
          )}
        </View>
        {data.goal && progress ? (
          <View accessible>
            <Text style={styles.goalMain} maxFontSizeMultiplier={FONT_SCALE.control}>
              {raceName(data.goal.distanceKm)} em {formatSecondsToTime(data.goal.targetSeconds)}
            </Text>
            <Text style={styles.goalLine}>
              Pace necessário: {formatPace(progress.targetPaceSeconds)} /km
            </Text>
            {progress.achieved ? (
              <Text style={styles.goalDone}>Meta alcançada! Hora de uma nova? 🎉</Text>
            ) : progress.currentSeconds !== null && progress.gapSeconds !== null ? (
              <Text style={styles.goalLine}>
                {progress.source === 'record' ? 'Seu recorde' : 'Estimativa pelos seus treinos'}:{' '}
                {formatSecondsToTime(progress.currentSeconds)} · faltam{' '}
                {formatSecondsToTime(progress.gapSeconds)}
              </Text>
            ) : (
              <Text style={styles.goalLine}>Registre treinos para acompanhar a evolução.</Text>
            )}
          </View>
        ) : (
          <>
            <Text style={styles.empty}>
              Ex: 10K em 50:00. O app mostra o pace necessário e quanto falta.
            </Text>
            <View style={styles.buttonRow}>
              <Button
                title="Definir meta"
                icon="flag-outline"
                variant="secondary"
                onPress={() => setGoalSheetOpen(true)}
              />
            </View>
          </>
        )}
      </Card>

      {/* Ritmos de treino fixos, a partir do melhor treino */}
      {fitness && (
        <TrainingPaces distanceKm={fitness.distanceKm} durationSeconds={fitness.durationSeconds} />
      )}

      {/* Diário de treinos */}
      <Card style={styles.section}>
        <Text style={styles.sectionTitle} accessibilityRole="header">
          Diário de treinos
        </Text>
        <View style={styles.buttonRow}>
          <Button
            title="Registrar treino"
            icon="add"
            onPress={() => setRunSheetOpen(true)}
            accessibilityHint="Abre o formulário para registrar um treino"
          />
        </View>

        {data.loaded && data.runs.length === 0 && (
          <Text style={styles.empty}>
            Nenhum treino ainda. Registre o primeiro para ver seus recordes aparecerem.
          </Text>
        )}

        {data.runs.slice(0, visibleRuns).map((run, index) => {
          const type = RUN_TYPES[run.type];
          const distance = formatKm(run.distanceKm);
          const time = formatSecondsToTime(run.durationSeconds);
          const pace = formatPace(calculatePace(run.durationSeconds, run.distanceKm));
          const day = formatRunDay(run.date);
          return (
            <Animated.View key={run.id} entering={enterItem(index)} style={styles.run}>
              <View style={styles.runIcon}>
                <Ionicons name={type.icon} size={18} color={colors.accent} />
              </View>
              <View
                style={styles.runText}
                accessible
                accessibilityLabel={`${type.label}, ${day}: ${distance} km em ${time}, pace ${pace} por km${run.note ? `. ${run.note}` : ''}`}
              >
                <Text style={styles.runMain} maxFontSizeMultiplier={FONT_SCALE.control}>
                  {distance} km · {time}
                </Text>
                <Text style={styles.runMeta}>
                  {type.label} · {day} · {pace}/km
                </Text>
                {run.note && <Text style={styles.runNote}>{run.note}</Text>}
              </View>
              <PressableScale
                style={styles.runDelete}
                onPress={() => handleDeleteRun(run.id, `${distance} km (${day})`)}
                hitSlop={8}
                accessibilityRole="button"
                accessibilityLabel={`Excluir treino de ${distance} km, ${day}`}
              >
                <Ionicons name="trash-outline" size={18} color={colors.danger} />
              </PressableScale>
            </Animated.View>
          );
        })}

        {data.runs.length > visibleRuns && (
          <View style={styles.buttonRow}>
            <Button
              title="Ver mais treinos"
              variant="secondary"
              onPress={() => setVisibleRuns((n) => n + RUNS_PAGE)}
            />
          </View>
        )}
      </Card>

      <RunSheet
        visible={runSheetOpen}
        onClose={() => setRunSheetOpen(false)}
        onSave={handleLogRun}
      />
      <GoalSheet
        visible={goalSheetOpen}
        goal={data.goal}
        onClose={() => setGoalSheetOpen(false)}
        onSave={data.setGoal}
      />
    </>
  );
};

const useStyles = createThemedStyles((colors) => ({
  buttonRow: {
    flexDirection: 'row',
    marginBottom: SPACING.sm,
    marginTop: SPACING.xs,
  },
  celebration: {
    alignItems: 'center',
    backgroundColor: colors.accentStrong,
    borderRadius: RADIUS.lg,
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
    padding: SPACING.md,
  },
  celebrationText: {
    color: colors.onAccent,
    flex: 1,
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZES.md,
  },
  empty: {
    color: colors.text.secondary,
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.sm,
    lineHeight: 20,
    marginVertical: SPACING.sm,
  },
  footnote: {
    color: colors.text.tertiary,
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.xs,
    lineHeight: 18,
    marginTop: SPACING.sm,
  },
  goalDone: {
    color: colors.accentText,
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZES.md,
    marginTop: SPACING.xs,
  },
  goalLine: {
    color: colors.text.secondary,
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.sm,
    lineHeight: 20,
    marginTop: SPACING.xs,
  },
  goalMain: {
    color: colors.text.primary,
    fontFamily: FONTS.monoSemiBold,
    fontSize: FONT_SIZES.xl,
    fontVariant: ['tabular-nums'],
  },
  nameInput: {
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.border,
    borderRadius: RADIUS.lg,
    borderWidth: 1.5,
    color: colors.text.primary,
    flex: 1,
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.lg,
    padding: SPACING.md,
  },
  nameRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  nameSave: {
    alignItems: 'center',
    backgroundColor: colors.accentStrong,
    borderRadius: RADIUS.lg,
    justifyContent: 'center',
    width: 56,
  },
  recordBox: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: RADIUS.md,
    flexBasis: '47%',
    flexGrow: 1,
    padding: SPACING.md - 4,
  },
  recordLabel: {
    color: colors.accentText,
    fontFamily: FONTS.monoSemiBold,
    fontSize: FONT_SIZES.sm,
  },
  recordMeta: {
    color: colors.text.tertiary,
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.xs,
    marginTop: 2,
  },
  recordTime: {
    color: colors.text.primary,
    fontFamily: FONTS.monoSemiBold,
    fontSize: FONT_SIZES.xl,
    fontVariant: ['tabular-nums'],
    marginTop: SPACING.xs,
  },
  recordsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  rowBetween: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  run: {
    alignItems: 'center',
    borderTopColor: colors.border,
    borderTopWidth: 1,
    flexDirection: 'row',
    gap: SPACING.md - 4,
    paddingVertical: SPACING.md - 4,
  },
  runDelete: {
    alignItems: 'center',
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  runIcon: {
    alignItems: 'center',
    backgroundColor: colors.accentSoft,
    borderRadius: RADIUS.md,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  runMain: {
    color: colors.text.primary,
    fontFamily: FONTS.monoSemiBold,
    fontSize: FONT_SIZES.md,
    fontVariant: ['tabular-nums'],
  },
  runMeta: {
    color: colors.text.secondary,
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.xs,
    marginTop: 2,
  },
  runNote: {
    color: colors.text.tertiary,
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.xs,
    fontStyle: 'italic',
    marginTop: 2,
  },
  runText: {
    flex: 1,
  },
  section: {
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    color: colors.text.primary,
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZES.lg,
    marginBottom: SPACING.sm,
  },
}));

export default YouTab;
