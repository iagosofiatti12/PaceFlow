import React, { useState } from 'react';
import type { PaceLevel } from '../domain/levels';
import { getPaceLevel } from '../domain/levels';
import { calculatePace } from '../domain/pace';
import { formatDistanceInput, formatHoursInput, formatMinutesInput } from '../format/masks';
import { formatPace, paceToSeconds } from '../format/time';
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
  // Se veio um item do histórico, os campos já nascem preenchidos
  const [h, m, s] = initialItem ? initialItem.time.split(':') : ['', '', ''];

  const distance = useMaskedField(formatDistanceInput, initialItem?.distance ?? '');
  const hours = useMaskedField(formatHoursInput, h === '0' ? '' : h);
  const minutes = useMaskedField(formatMinutesInput, m);
  const seconds = useMaskedField(formatMinutesInput, s);

  const [result, setResult] = useState<string | null>(initialItem?.pace ?? null);
  const [level, setLevel] = useState<PaceLevel | null>(
    initialItem ? getPaceLevel(paceToSeconds(initialItem.pace)) : null,
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

    await saveCalculation(distance.value, hours.value, minutes.value, seconds.value, formatted);
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
