import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import RacePredictions from '../RacePredictions';
import PaceCalculator from '../PaceCalculator';

jest.mock('@react-native-async-storage/async-storage', () =>
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

describe('previsão de prova', () => {
  it('10K em 50:00: mostra 5K, meia e maratona, sem repetir o 10K', () => {
    render(<RacePredictions distanceKm={10} durationSeconds={3000} />);
    expect(screen.getByText('Previsão de prova')).toBeTruthy();
    expect(screen.getByText('1:50:19')).toBeTruthy(); // meia
    expect(screen.getByText('3:50:01')).toBeTruthy(); // maratona
    expect(screen.queryByText('10K')).toBeNull();
  });

  it('cada linha é lida por completo pelo leitor de tela', () => {
    render(<RacePredictions distanceKm={10} durationSeconds={3000} />);
    expect(screen.getByLabelText('Meia maratona: 1:50:19, pace 5:14 por km')).toBeTruthy();
  });

  it('não aparece para distâncias curtas demais', () => {
    render(<RacePredictions distanceKm={1} durationSeconds={300} />);
    expect(screen.queryByText('Previsão de prova')).toBeNull();
  });

  it('aparece na aba Pace assim que o resultado é calculado', () => {
    render(<PaceCalculator />);
    expect(screen.queryByText('Previsão de prova')).toBeNull();
    fireEvent.changeText(screen.getByLabelText('Campo de distância em quilômetros'), '10');
    fireEvent.changeText(screen.getByLabelText('Minutos'), '50');
    expect(screen.getByText('Previsão de prova')).toBeTruthy();
    expect(screen.getByText('3:50:01')).toBeTruthy();
  });
});
