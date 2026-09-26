import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import TrainingPaces from '../TrainingPaces';
import PaceCalculator from '../PaceCalculator';

jest.mock('@react-native-async-storage/async-storage', () =>
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

describe('ritmos de treino', () => {
  it('10K em 50:00: cinco zonas, com faixa no leve', () => {
    render(<TrainingPaces distanceKm={10} durationSeconds={3000} />);
    expect(screen.getByText('Ritmos de treino')).toBeTruthy();
    expect(screen.getByText('6:07 – 6:43 /km')).toBeTruthy(); // leve
    expect(screen.getByText('5:05 /km')).toBeTruthy(); // limiar
    ['Leve', 'Maratona', 'Limiar', 'Intervalado', 'Repetição'].forEach((label) =>
      expect(screen.getByText(label)).toBeTruthy(),
    );
  });

  it('cada linha é lida por completo pelo leitor de tela', () => {
    render(<TrainingPaces distanceKm={10} durationSeconds={3000} />);
    expect(
      screen.getByLabelText(
        'Leve, Rodagem e longão, dá para conversar: pace de 6:07 a 6:43 por km',
      ),
    ).toBeTruthy();
    expect(
      screen.getByLabelText('Limiar, Forte e contínuo, até uns 20 min: pace 5:05 por km'),
    ).toBeTruthy();
  });

  it('não aparece para distâncias curtas demais', () => {
    render(<TrainingPaces distanceKm={1} durationSeconds={240} />);
    expect(screen.queryByText('Ritmos de treino')).toBeNull();
  });

  it('aparece na aba Pace assim que o resultado é calculado', () => {
    render(<PaceCalculator />);
    expect(screen.queryByText('Ritmos de treino')).toBeNull();
    fireEvent.changeText(screen.getByLabelText('Campo de distância em quilômetros'), '10');
    fireEvent.changeText(screen.getByLabelText('Minutos'), '50');
    expect(screen.getByText('Ritmos de treino')).toBeTruthy();
  });
});
