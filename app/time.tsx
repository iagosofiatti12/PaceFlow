import React from 'react';
import TimeCalculator from '../src/components/TimeCalculator';
import KeyboardScreen from '../src/components/ui/KeyboardScreen';

/** Aba Tempo. Rota "/time". */
export default function TimeScreen(): React.ReactElement {
  return (
    <KeyboardScreen>
      <TimeCalculator />
    </KeyboardScreen>
  );
}
