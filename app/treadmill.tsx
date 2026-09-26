import React from 'react';
import TreadmillCalculator from '../src/components/TreadmillCalculator';
import KeyboardScreen from '../src/components/ui/KeyboardScreen';

/** Aba Esteira. Rota "/treadmill". */
export default function TreadmillScreen(): React.ReactElement {
  return (
    <KeyboardScreen>
      <TreadmillCalculator />
    </KeyboardScreen>
  );
}
