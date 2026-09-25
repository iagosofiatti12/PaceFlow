import React, { useState } from 'react';
import type { PaceLevel } from '../domain/levels';
import { getPaceLevel } from '../domain/levels';
import { calculatePace } from '../domain/pace';
import { formatDistanceInput, formatHoursInput, formatMinutesInput } from '../format/masks';
import { formatPace, splitDuration } from '../format/time';
import { validateDistance, validateTime } from '../validation/rules';
import { useMaskedField } from '../hooks/useMaskedField';
import { showValidationError, notifySuccess } from '../utils/feedback';
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

const PaceCalculator: React.FC<PaceCalculatorProps> = ({ initialItem }) => {
  // Se veio um item do histórico, os campos já nascem preenchidos e o
  // resultado é recalculado a partir dos dados brutos (km e segundos)
  const initialTime = initialItem ? splitDuration(initialItem.durationSeconds) : null;
  const initialPace = initialItem
    ? calculatePace(initialItem.durationSeconds, initialItem.distanceKm)
    : null;

  const distance = useMaskedField(formatDistanceInput, initialItem?.distanceKm.toString() ?? '');
  const hours = useMaskedField(formatHoursInput, initialTime?.hours ?? '');
  const minutes = useMaskedField(formatMinutesInput, initialTime?.minutes ?? '');
  const seconds = useMaskedField(formatMinutesInput, initialTime?.seconds ?? '');

  const [result, setResult] = useState<string | null>(
    initialPace !== null ? formatPace(initialPace) : null,
  );
  const [level, setLevel] = useState<PaceLevel | null>(
    initialPace !== null ? getPaceLevel(initialPace) : null,
  );

  const handleClear = (): void => {
    distance.clear();
    hours.clear();
    minutes.clear();
    seconds.clear();
    setResult(null);
    setLevel(null);
  };

  const handleCalculate = async (): Promise<void> => {
    const distanceResult = validateDistance(distance.value);
    if (!distanceResult.valid) {
      showValidationError(distanceResult.error);
      return;
    }

    const timeResult = validateTime(hours.value, minutes.value, seconds.value);
    if (!timeResult.valid) {
      showValidationError(timeResult.error);
      return;
    }

    const paceSeconds = calculatePace(timeResult.value, distanceResult.value);
    const formatted = formatPace(paceSeconds);

    notifySuccess();
    setResult(formatted);
    setLevel(getPaceLevel(paceSeconds));

    await saveCalculation(distanceResult.value, timeResult.value);
  };

  return (
    <Card>
      <ScreenHeader
        title="Calcular pace"
        description="Insira a distância e o tempo para descobrir seu ritmo médio"
      />

      <InputField
        label="Distância"
        value={distance.value}
        onChangeText={distance.onChangeText}
        unit="km"
        placeholder="5.0"
        accessibilityLabel="Campo de distância em quilômetros"
        accessibilityHint="Digite a distância percorrida"
      />

      <TimeInput label="Tempo total" hours={hours} minutes={minutes} seconds={seconds} />

      <ButtonRow>
        <Button
          title="Calcular"
          icon="calculator"
          onPress={handleCalculate}
          accessibilityLabel="Calcular pace"
          accessibilityHint="Toque para calcular o pace médio"
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

      {result && (
        <ResultCard
          label="Seu pace médio"
          value={result}
          unit="/km"
          subtext="min por quilômetro"
          level={level}
        />
      )}
    </Card>
  );
};

export default PaceCalculator;
