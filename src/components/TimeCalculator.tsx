import React, { useState } from 'react';
import { calculateTotalTime } from '../domain/pace';
import { formatDistanceInput, formatPaceInput } from '../format/masks';
import { formatSecondsToTime } from '../format/time';
import { validateDistance, validatePace } from '../validation/rules';
import { useMaskedField } from '../hooks/useMaskedField';
import { showValidationError, notifySuccess } from '../utils/feedback';
import Card from './ui/Card';
import ScreenHeader from './ui/ScreenHeader';
import InputField from './ui/InputField';
import Button from './ui/Button';
import ButtonRow from './ui/ButtonRow';
import ResultCard from './ui/ResultCard';

const TimeCalculator: React.FC = () => {
  const distance = useMaskedField(formatDistanceInput);
  const pace = useMaskedField(formatPaceInput);
  const [totalSeconds, setTotalSeconds] = useState<number | null>(null);

  const handleClear = (): void => {
    distance.clear();
    pace.clear();
    setTotalSeconds(null);
  };

  const handleCalculate = (): void => {
    const distanceResult = validateDistance(distance.value);
    if (!distanceResult.valid) {
      showValidationError(distanceResult.error);
      return;
    }

    const paceResult = validatePace(pace.value);
    if (!paceResult.valid) {
      showValidationError(paceResult.error);
      return;
    }

    notifySuccess();
    setTotalSeconds(calculateTotalTime(distanceResult.value, paceResult.value));
  };

  return (
    <Card>
      <ScreenHeader
        title="Calcular tempo"
        description="Insira a distância e seu pace para descobrir quanto tempo levará"
      />

      <InputField
        label="Distância"
        value={distance.value}
        onChangeText={distance.onChangeText}
        unit="km"
        placeholder="5,0"
        accessibilityLabel="Campo de distância em quilômetros"
        accessibilityHint="Digite a distância da prova"
      />

      <InputField
        label="Pace desejado"
        value={pace.value}
        onChangeText={pace.onChangeText}
        unit="/km"
        placeholder="5:30"
        keyboardType="number-pad"
        maxLength={5}
        hint="Formato: min:seg (ex: 5:30)"
        accessibilityLabel="Campo de pace"
        accessibilityHint="Digite o pace em minutos e segundos"
      />

      <ButtonRow>
        <Button
          title="Calcular"
          icon="timer"
          onPress={handleCalculate}
          accessibilityLabel="Calcular tempo"
          accessibilityHint="Toque para calcular o tempo total"
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

      {totalSeconds !== null && (
        <ResultCard
          label="Tempo estimado"
          value={formatSecondsToTime(totalSeconds)}
          // Decide pelo número, e não contando os ":" do texto formatado
          subtext={totalSeconds >= 3600 ? 'horas' : 'minutos'}
        />
      )}
    </Card>
  );
};

export default TimeCalculator;
