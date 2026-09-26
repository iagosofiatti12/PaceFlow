import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import TimeCalculator from '../TimeCalculator';
import PaceTable from '../PaceTable';
import DistancePresets from '../ui/DistancePresets';

jest.mock('@react-native-async-storage/async-storage', () =>
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

describe('atalhos de distância', () => {
  it('preenche a distância oficial da meia maratona com vírgula', () => {
    render(<TimeCalculator />);
    fireEvent.press(screen.getByLabelText('Meia maratona, 21,0975 km'));
    expect(screen.getByLabelText('Campo de distância em quilômetros').props.value).toBe('21,0975');
  });

  it('o resultado se atualiza na hora com a distância do atalho', () => {
    render(<TimeCalculator />);
    fireEvent.changeText(screen.getByLabelText('Campo de pace'), '5:00');
    fireEvent.press(screen.getByLabelText('Maratona, 42,195 km'));
    expect(screen.getByText('3:30:59')).toBeTruthy(); // 42,195 km a 5:00/km
  });

  it('destaca o atalho da distância atual, inclusive se foi digitada', () => {
    render(<TimeCalculator />);
    fireEvent.changeText(screen.getByLabelText('Campo de distância em quilômetros'), '10');
    expect(screen.getByLabelText('10 quilômetros, 10 km')).toBeSelected();
    expect(screen.getByLabelText('5 quilômetros, 5 km')).not.toBeSelected();
  });

  it('na tabela, o atalho monta as parciais da prova', () => {
    render(<PaceTable />);
    fireEvent.press(screen.getByLabelText('5 quilômetros, 5 km'));
    fireEvent.changeText(screen.getByLabelText('Campo de pace desejado'), '5:00');
    expect(screen.getByText('Tempo final: 25:00')).toBeTruthy();
  });

  it('mostra os quatro atalhos', () => {
    render(<DistancePresets value="" onSelect={() => {}} />);
    ['5K', '10K', '21K', '42K'].forEach((label) => expect(screen.getByText(label)).toBeTruthy());
  });
});
