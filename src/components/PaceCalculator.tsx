import React, { useState } from 'react';
import { getPaceLevel } from '../domain/levels';
import { formatDistanceInput, formatHoursInput, formatMinutesInput } from '../format/masks';
import { formatPace, splitDuration } from '../format/time';
import { formatKm } from '../format/distance';
import { evaluatePaceForm, shouldShowError } from '../validation/forms';
import { VALIDATION_MESSAGES } from '../constants/messages';
import { useMaskedField } from '../hooks/useMaskedField';
import { notifySuccess } from '../utils/feedback';
import { saveCalculation, type HistoryItem } from '../utils/storage';
import Card from './ui/Card';
import ScreenHeader from './ui/ScreenHeader';
import InputField from './ui/InputField';
import TimeInput from './ui/TimeInput';
import Button from './ui/Button';
import ButtonRow from './ui/ButtonRow';
import ResultCard from './ui/ResultCard';

interface PaceCalculatorProps {
  /** Item do histórico para preencher os campos ao restaurar um cálculo salvo */
  initialItem?: HistoryItem | null;
}

/** Identifica um cálculo pelos dados brutos, para saber se ele já foi salvo */
const calculationKey = (distanceKm: number, durationSeconds: number): string =>
  `${distanceKm}|${durationSeconds}`;

const PaceCalculator: React.FC<PaceCalculatorProps> = ({ initialItem }) => {
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

  const handleClear = (): void => {
    distance.clear();
    hours.clear();
    minutes.clear();
    seconds.clear();
  };

  return (
    <Card>
      <ScreenHeader
        title="Calcular pace"
        description="Insira a distância e o tempo: o ritmo médio aparece na hora"
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
        accessibilityHint="Digite a distância percorrida"
      />

      <TimeInput
        label="Tempo total"
        hours={hours}
        minutes={minutes}
        seconds={seconds}
        error={timeError}
      />

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

export default PaceCalculator;
