import React from 'react';
import { formatDistanceInput, formatPaceInput } from '../format/masks';
import { formatSecondsToTime } from '../format/time';
import { evaluateDistancePaceForm, shouldShowError } from '../validation/forms';
import { VALIDATION_MESSAGES } from '../constants/messages';
import { useMaskedField } from '../hooks/useMaskedField';
import Card from './ui/Card';
import ScreenHeader from './ui/ScreenHeader';
import InputField from './ui/InputField';
import Button from './ui/Button';
import ButtonRow from './ui/ButtonRow';
import ResultCard from './ui/ResultCard';

const TimeCalculator: React.FC = () => {
  const distance = useMaskedField(formatDistanceInput);
  const pace = useMaskedField(formatPaceInput);

  // Cálculo ao vivo: o tempo total aparece assim que os dois campos são válidos
  const form = evaluateDistancePaceForm({ distance: distance.value, pace: pace.value });

  const distanceError = shouldShowError(form.errors.distance, distance.touched)
    ? VALIDATION_MESSAGES[form.errors.distance]
    : null;
  const paceError = shouldShowError(form.errors.pace, pace.touched)
    ? VALIDATION_MESSAGES[form.errors.pace]
    : null;

  const handleClear = (): void => {
    distance.clear();
    pace.clear();
  };

  return (
    <Card>
      <ScreenHeader
        title="Calcular tempo"
        description="Insira a distância e seu pace: o tempo de prova aparece na hora"
      />

      <InputField
        label="Distância"
        value={distance.value}
        onChangeText={distance.onChangeText}
        onBlur={distance.onBlur}
        error={distanceError}
        unit="km"
        placeholder="5,0"
        accessibilityLabel="Campo de distância em quilômetros"
        accessibilityHint="Digite a distância da prova"
      />

      <InputField
        label="Pace desejado"
        value={pace.value}
        onChangeText={pace.onChangeText}
        onBlur={pace.onBlur}
        error={paceError}
        unit="/km"
        placeholder="5:30"
        keyboardType="number-pad"
        maxLength={5}
        hint="Formato: min:seg (ex: 5:30)"
        accessibilityLabel="Campo de pace"
        accessibilityHint="Digite o pace em minutos e segundos"
      />

      {form.value && (
        <ResultCard
          label="Tempo estimado"
          value={formatSecondsToTime(form.value.totalSeconds)}
          subtext={form.value.totalSeconds >= 3600 ? 'horas' : 'minutos'}
        />
      )}

      <ButtonRow>
        <Button
          title="Limpar"
          icon="trash-outline"
          variant="secondary"
          onPress={handleClear}
          accessibilityLabel="Limpar campos"
          accessibilityHint="Toque para limpar todos os campos"
        />
      </ButtonRow>
    </Card>
  );
};

export default TimeCalculator;
