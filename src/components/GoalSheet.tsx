import React from 'react';
import { Text, View } from 'react-native';
import { VALIDATION_MESSAGES } from '../constants/messages';
import { FONT_SCALE, FONT_SIZES, FONTS, SPACING } from '../constants/theme';
import { formatKm } from '../format/distance';
import { formatDistanceInput, formatHoursInput, formatMinutesInput } from '../format/masks';
import { formatPace, splitDuration } from '../format/time';
import { useMaskedField } from '../hooks/useMaskedField';
import { createThemedStyles } from '../hooks/useTheme';
import { evaluatePaceForm, shouldShowError } from '../validation/forms';
import type { StoredGoal } from '../utils/personalSchema';
import Button from './ui/Button';
import DistancePresets from './ui/DistancePresets';
import InputField from './ui/InputField';
import Sheet from './ui/Sheet';
import TimeInput from './ui/TimeInput';

interface GoalSheetProps {
  visible: boolean;
  goal: StoredGoal | null;
  onClose: () => void;
  onSave: (goal: StoredGoal | null) => Promise<void>;
}

const GoalForm: React.FC<Omit<GoalSheetProps, 'visible'>> = ({ goal, onClose, onSave }) => {
  const styles = useStyles();
  const initialTime = goal ? splitDuration(goal.targetSeconds) : null;
  const distance = useMaskedField(formatDistanceInput, goal ? formatKm(goal.distanceKm) : '');
  const hours = useMaskedField(formatHoursInput, initialTime?.hours ?? '');
  const minutes = useMaskedField(formatMinutesInput, initialTime?.minutes ?? '');
  const seconds = useMaskedField(formatMinutesInput, initialTime?.seconds ?? '');

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

  const save = async (value: StoredGoal | null): Promise<void> => {
    await onSave(value);
    onClose();
  };

  return (
    <>
      <InputField
        label="Distância da prova"
        value={distance.value}
        onChangeText={distance.onChangeText}
        onBlur={distance.onBlur}
        error={distanceError}
        unit="km"
        placeholder="10,0"
        accessibilityLabel="Distância da meta em quilômetros"
      />
      <DistancePresets value={distance.value} onSelect={distance.onChangeText} />
      <TimeInput
        label="Tempo que você quer fazer"
        hours={hours}
        minutes={minutes}
        seconds={seconds}
        error={timeError}
      />

      {form.value && (
        <Text style={styles.summary} maxFontSizeMultiplier={FONT_SCALE.control}>
          Pace necessário: {formatPace(form.value.paceSeconds)} /km
        </Text>
      )}

      <View style={styles.actions}>
        {goal && (
          <Button
            title="Remover"
            icon="trash-outline"
            variant="secondary"
            onPress={() => save(null)}
            accessibilityLabel="Remover meta"
          />
        )}
        <Button
          title="Salvar meta"
          icon="flag-outline"
          disabled={!form.value}
          onPress={() =>
            form.value &&
            save({ distanceKm: form.value.distanceKm, targetSeconds: form.value.durationSeconds })
          }
        />
      </View>
    </>
  );
};

/** Painel "Sua meta": distância e tempo alvo */
const GoalSheet: React.FC<GoalSheetProps> = ({ visible, ...props }) => (
  <Sheet visible={visible} title="Sua meta" onClose={props.onClose}>
    {visible && <GoalForm {...props} />}
  </Sheet>
);

const useStyles = createThemedStyles((colors) => ({
  actions: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginTop: SPACING.sm,
  },
  summary: {
    color: colors.accentText,
    fontFamily: FONTS.monoSemiBold,
    fontSize: FONT_SIZES.md,
    fontVariant: ['tabular-nums'],
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
}));

export default GoalSheet;
