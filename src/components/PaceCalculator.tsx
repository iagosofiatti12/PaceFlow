import React, { useState } from 'react';
import { Text } from 'react-native';
import Animated from 'react-native-reanimated';
import { getPaceLevel } from '../domain/levels';
import { formatDistanceInput, formatHoursInput, formatMinutesInput } from '../format/masks';
import { formatPace, splitDuration } from '../format/time';
import { formatKm } from '../format/distance';
import { evaluatePaceForm, shouldShowError } from '../validation/forms';
import { VALIDATION_MESSAGES } from '../constants/messages';
import { useMaskedField } from '../hooks/useMaskedField';
import { notifySuccess } from '../utils/feedback';
import { saveCalculation, type HistoryItem } from '../utils/storage';
import { addRun, getRuns, type NewRun } from '../utils/personalStorage';
import { recordsBrokenBy } from '../domain/records';
import { RACE_DISTANCES } from '../constants/raceDistances';
import { FONT_SIZES, FONTS, SPACING } from '../constants/theme';
import { createThemedStyles } from '../hooks/useTheme';
import Card from './ui/Card';
import ScreenHeader from './ui/ScreenHeader';
import InputField from './ui/InputField';
import DistancePresets from './ui/DistancePresets';
import TimeInput from './ui/TimeInput';
import Button from './ui/Button';
import ButtonRow from './ui/ButtonRow';
import ClearButton from './ui/ClearButton';
import ResultCard from './ui/ResultCard';
import RacePredictions from './RacePredictions';
import TrainingPaces from './TrainingPaces';
import RunSheet from './RunSheet';
import { enterQuick } from './ui/motion';

interface PaceCalculatorProps {
  /** Item do histórico para preencher os campos ao restaurar um cálculo salvo */
  initialItem?: HistoryItem | null;
}

/** Identifica um cálculo pelos dados brutos, para saber se ele já foi salvo */
const calculationKey = (distanceKm: number, durationSeconds: number): string =>
  `${distanceKm}|${durationSeconds}`;

const RACE_KMS = RACE_DISTANCES.map((race) => race.km);

const PaceCalculator: React.FC<PaceCalculatorProps> = ({ initialItem }) => {
  const styles = useStyles();
  const [runSheetOpen, setRunSheetOpen] = useState(false);
  // Aviso depois de registrar o cálculo como treino ("registrado" ou "novo recorde")
  const [runNotice, setRunNotice] = useState<string | null>(null);
  // Se veio um item do histórico, os campos já nascem preenchidos
  const initialTime = initialItem ? splitDuration(initialItem.durationSeconds) : null;

  const distance = useMaskedField(
    formatDistanceInput,
    initialItem ? formatKm(initialItem.distanceKm) : '',
  );
  const hours = useMaskedField(formatHoursInput, initialTime?.hours ?? '');
  const minutes = useMaskedField(formatMinutesInput, initialTime?.minutes ?? '');
  const seconds = useMaskedField(formatMinutesInput, initialTime?.seconds ?? '');

  // Cálculo ao vivo: a cada tecla o formulário é reavaliado. Não precisa de
  // estado para o resultado; ele é sempre "o que os campos dizem agora".
  const form = evaluatePaceForm({
    distance: distance.value,
    hours: hours.value,
    minutes: minutes.value,
    seconds: seconds.value,
  });
  const currentKey = form.value
    ? calculationKey(form.value.distanceKm, form.value.durationSeconds)
    : null;

  // Último cálculo salvo: evita salvar o mesmo resultado duas vezes seguidas.
  // Um item restaurado do histórico já nasce "salvo".
  const [savedKey, setSavedKey] = useState<string | null>(
    initialItem ? calculationKey(initialItem.distanceKm, initialItem.durationSeconds) : null,
  );
  const isSaved = currentKey !== null && currentKey === savedKey;

  const timeTouched = hours.touched || minutes.touched || seconds.touched;
  const distanceError = shouldShowError(form.errors.distance, distance.touched)
    ? VALIDATION_MESSAGES[form.errors.distance]
    : null;
  const timeError = shouldShowError(form.errors.time, timeTouched)
    ? VALIDATION_MESSAGES[form.errors.time]
    : null;

  const handleSave = async (): Promise<void> => {
    if (!form.value || isSaved) return;
    const { distanceKm, durationSeconds } = form.value;
    await saveCalculation(distanceKm, durationSeconds);
    notifySuccess();
    setSavedKey(calculationKey(distanceKm, durationSeconds));
  };

  // Registrar o cálculo como treino no diário (aba "Você"), avisando se for recorde
  const handleLogRun = async (run: NewRun): Promise<void> => {
    const previous = await getRuns();
    const saved = await addRun(run);
    const broken = recordsBrokenBy(saved, previous, RACE_KMS);
    notifySuccess();
    const labels = broken.map((km) => RACE_DISTANCES.find((r) => r.km === km)?.label ?? '');
    setRunNotice(
      broken.length > 0
        ? `Novo recorde: ${labels.join(', ')}! 🎉 Veja em "Você".`
        : 'Treino registrado no seu diário ✓',
    );
  };

  const handleClear = (): void => {
    setRunNotice(null);
    distance.clear();
    hours.clear();
    minutes.clear();
    seconds.clear();
  };

  const hasInput = [distance, hours, minutes, seconds].some((field) => field.value !== '');

  return (
    <>
      <ScreenHeader
        title="Pace"
        description="Distância e tempo: o ritmo médio aparece na hora"
        action={
          <ClearButton
            visible={hasInput}
            onPress={handleClear}
            accessibilityLabel="Limpar campos"
            accessibilityHint="Toque para limpar todos os campos"
          />
        }
      />

      <Card form>
        <InputField
          label="Distância"
          value={distance.value}
          onChangeText={distance.onChangeText}
          onBlur={distance.onBlur}
          error={distanceError}
          unit="km"
          placeholder="5,0"
          accessibilityLabel="Campo de distância em quilômetros"
          accessibilityHint="Digite a distância percorrida"
        />

        <DistancePresets value={distance.value} onSelect={distance.onChangeText} />

        <TimeInput
          label="Tempo total"
          hours={hours}
          minutes={minutes}
          seconds={seconds}
          error={timeError}
        />
      </Card>

      {form.value && (
        <ResultCard
          label="Seu pace médio"
          value={formatPace(form.value.paceSeconds)}
          unit="/km"
          subtext="min por quilômetro"
          level={getPaceLevel(form.value.paceSeconds)}
        />
      )}

      <ButtonRow>
        <Button
          title={isSaved ? 'Salvo' : 'Salvar no histórico'}
          icon={isSaved ? 'checkmark-circle' : 'bookmark-outline'}
          onPress={handleSave}
          disabled={!form.value || isSaved}
          accessibilityLabel={isSaved ? 'Cálculo salvo no histórico' : 'Salvar no histórico'}
          accessibilityHint="Guarda este cálculo na aba Histórico"
        />
      </ButtonRow>

      {/* Correu isso de verdade? Vira um treino no diário e conta para os recordes */}
      {form.value && (
        <ButtonRow>
          <Button
            title="Registrar como treino"
            icon="add-circle-outline"
            variant="secondary"
            onPress={() => setRunSheetOpen(true)}
            accessibilityHint="Abre o diário de treinos já com esta distância e este tempo"
          />
        </ButtonRow>
      )}
      {runNotice && (
        <Animated.View key={runNotice} entering={enterQuick}>
          <Text style={styles.notice} accessibilityLiveRegion="polite">
            {runNotice}
          </Text>
        </Animated.View>
      )}

      {form.value && (
        <>
          <RacePredictions
            distanceKm={form.value.distanceKm}
            durationSeconds={form.value.durationSeconds}
          />
          <TrainingPaces
            distanceKm={form.value.distanceKm}
            durationSeconds={form.value.durationSeconds}
          />
        </>
      )}

      <RunSheet
        visible={runSheetOpen}
        onClose={() => setRunSheetOpen(false)}
        onSave={handleLogRun}
        initialDistanceKm={form.value?.distanceKm}
        initialDurationSeconds={form.value?.durationSeconds}
      />
    </>
  );
};

const useStyles = createThemedStyles((colors) => ({
  notice: {
    color: colors.accentText,
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.sm,
    marginTop: SPACING.sm,
    textAlign: 'center',
  },
}));

export default PaceCalculator;
