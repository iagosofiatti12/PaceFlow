import React, { useState } from 'react';
import { ScrollView, Text, TextInput, View } from 'react-native';
import { RUN_TYPE_ORDER, RUN_TYPES } from '../constants/runTypes';
import { VALIDATION_MESSAGES } from '../constants/messages';
import { FONT_SCALE, FONT_SIZES, FONTS, RADIUS, SPACING } from '../constants/theme';
import { formatKm } from '../format/distance';
import { formatRunDay, recentDays } from '../format/dates';
import { formatDistanceInput, formatHoursInput, formatMinutesInput } from '../format/masks';
import { formatPace, splitDuration } from '../format/time';
import { useMaskedField } from '../hooks/useMaskedField';
import { createThemedStyles, useColors } from '../hooks/useTheme';
import { evaluatePaceForm, shouldShowError } from '../validation/forms';
import { notifySelection } from '../utils/feedback';
import { MAX_NOTE_LENGTH, type RunType } from '../utils/personalSchema';
import type { NewRun } from '../utils/personalStorage';
import Button from './ui/Button';
import DistancePresets from './ui/DistancePresets';
import InputField from './ui/InputField';
import PressableScale from './ui/PressableScale';
import SegmentedControl, { type SegmentOption } from './ui/SegmentedControl';
import Sheet from './ui/Sheet';
import TimeInput from './ui/TimeInput';

interface RunSheetProps {
  visible: boolean;
  onClose: () => void;
  /** Salva o treino (o painel fecha sozinho depois) */
  onSave: (run: NewRun) => Promise<void>;
  /** Para já abrir preenchido (ex: vindo de um cálculo da aba Pace) */
  initialDistanceKm?: number;
  initialDurationSeconds?: number;
}

const TYPE_OPTIONS: readonly SegmentOption<RunType>[] = RUN_TYPE_ORDER.map((type) => ({
  value: type,
  label: RUN_TYPES[type].label,
  accessibilityLabel: `Tipo de treino: ${RUN_TYPES[type].label}`,
}));

/** Dias que dá para escolher no formulário: hoje e os 6 anteriores */
const DAY_CHOICES = 7;

/** Conteúdo do formulário. Fica separado para nascer "limpo" a cada abertura. */
const RunForm: React.FC<Omit<RunSheetProps, 'visible'>> = ({
  onClose,
  onSave,
  initialDistanceKm,
  initialDurationSeconds,
}) => {
  const styles = useStyles();
  const colors = useColors();
  const initialTime = initialDurationSeconds ? splitDuration(initialDurationSeconds) : null;
  const distance = useMaskedField(
    formatDistanceInput,
    initialDistanceKm ? formatKm(initialDistanceKm) : '',
  );
  const hours = useMaskedField(formatHoursInput, initialTime?.hours ?? '');
  const minutes = useMaskedField(formatMinutesInput, initialTime?.minutes ?? '');
  const seconds = useMaskedField(formatMinutesInput, initialTime?.seconds ?? '');
  const [days] = useState(() => recentDays(DAY_CHOICES));
  const [day, setDay] = useState(days[0]);
  const [type, setType] = useState<RunType>('easy');
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);

  const form = evaluatePaceForm({
    distance: distance.value,
    hours: hours.value,
    minutes: minutes.value,
    seconds: seconds.value,
  });
  const timeTouched = hours.touched || minutes.touched || seconds.touched;
  const distanceError = shouldShowError(form.errors.distance, distance.touched)
    ? VALIDATION_MESSAGES[form.errors.distance]
    : null;
  const timeError = shouldShowError(form.errors.time, timeTouched)
    ? VALIDATION_MESSAGES[form.errors.time]
    : null;

  const handleSave = async (): Promise<void> => {
    if (!form.value || saving) return;
    setSaving(true);
    const trimmed = note.trim();
    await onSave({
      date: day,
      distanceKm: form.value.distanceKm,
      durationSeconds: form.value.durationSeconds,
      type,
      ...(trimmed ? { note: trimmed } : {}),
    });
    onClose();
  };

  return (
    <>
      <InputField
        label="Distância"
        value={distance.value}
        onChangeText={distance.onChangeText}
        onBlur={distance.onBlur}
        error={distanceError}
        unit="km"
        placeholder="5,0"
        accessibilityLabel="Distância do treino em quilômetros"
      />
      <DistancePresets value={distance.value} onSelect={distance.onChangeText} />
      <TimeInput
        label="Tempo"
        hours={hours}
        minutes={minutes}
        seconds={seconds}
        error={timeError}
      />

      <Text style={styles.label}>Dia</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.days}
        keyboardShouldPersistTaps="handled"
      >
        {days.map((value) => {
          const selected = value === day;
          const label = formatRunDay(value);
          return (
            <PressableScale
              key={value}
              style={[styles.day, selected && styles.daySelected]}
              onPress={() => {
                if (!selected) notifySelection();
                setDay(value);
              }}
              accessibilityRole="radio"
              accessibilityState={{ checked: selected }}
              accessibilityLabel={`Dia do treino: ${label}`}
            >
              <Text
                style={[styles.dayText, selected && styles.dayTextSelected]}
                maxFontSizeMultiplier={FONT_SCALE.control}
              >
                {label}
              </Text>
            </PressableScale>
          );
        })}
      </ScrollView>

      <Text style={styles.label}>Tipo</Text>
      <SegmentedControl options={TYPE_OPTIONS} value={type} onChange={setType} />

      <Text style={styles.label}>Anotação (opcional)</Text>
      <TextInput
        style={styles.note}
        value={note}
        onChangeText={setNote}
        placeholder="Ex: calor, subidas, me senti bem"
        placeholderTextColor={colors.text.placeholder}
        maxLength={MAX_NOTE_LENGTH}
        accessibilityLabel="Anotação do treino"
      />

      {form.value && (
        <Text style={styles.summary} maxFontSizeMultiplier={FONT_SCALE.control}>
          Pace médio: {formatPace(form.value.paceSeconds)} /km
        </Text>
      )}

      <View style={styles.actions}>
        <Button
          title="Salvar treino"
          icon="checkmark"
          onPress={handleSave}
          disabled={!form.value || saving}
          accessibilityHint="Guarda este treino no seu diário"
        />
      </View>
    </>
  );
};

/** Painel "Registrar treino": distância, tempo, dia, tipo e anotação */
const RunSheet: React.FC<RunSheetProps> = ({ visible, ...props }) => (
  <Sheet visible={visible} title="Registrar treino" onClose={props.onClose}>
    {visible && <RunForm {...props} />}
  </Sheet>
);

const useStyles = createThemedStyles((colors) => ({
  actions: {
    flexDirection: 'row',
    marginTop: SPACING.md,
  },
  day: {
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.border,
    borderRadius: RADIUS.pill,
    borderWidth: 1,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  daySelected: {
    backgroundColor: colors.accentSoft,
    borderColor: colors.accent,
  },
  dayText: {
    color: colors.text.secondary,
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.sm,
  },
  dayTextSelected: {
    color: colors.accentText,
    fontFamily: FONTS.semiBold,
  },
  days: {
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  label: {
    color: colors.text.label,
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.md,
    letterSpacing: 0.3,
    marginBottom: SPACING.sm,
  },
  note: {
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.border,
    borderRadius: RADIUS.lg,
    borderWidth: 1.5,
    color: colors.text.primary,
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.md,
    padding: SPACING.md,
  },
  summary: {
    color: colors.accentText,
    fontFamily: FONTS.monoSemiBold,
    fontSize: FONT_SIZES.md,
    fontVariant: ['tabular-nums'],
    marginTop: SPACING.md,
    textAlign: 'center',
  },
}));

export default RunSheet;
