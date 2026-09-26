import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { render, screen, fireEvent, act } from '@testing-library/react-native';
import PaceCalculator from '../PaceCalculator';
import TimeCalculator from '../TimeCalculator';
import PaceTable from '../PaceTable';
import { getHistory } from '../../utils/storage';

// Cálculo ao vivo: o resultado aparece enquanto a pessoa digita, os erros
// ficam embaixo do campo e salvar no histórico é uma ação explícita.

jest.mock('@react-native-async-storage/async-storage', () =>
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

beforeEach(async () => {
  await AsyncStorage.clear();
});

const typeDistance = (text: string): void =>
  fireEvent.changeText(screen.getByLabelText('Campo de distância em quilômetros'), text);

describe('aba Pace', () => {
  it('mostra o pace enquanto digita, sem botão de calcular', () => {
    render(<PaceCalculator />);
    expect(screen.queryByText('Seu pace médio')).toBeNull();

    typeDistance('10');
    fireEvent.changeText(screen.getByLabelText('Minutos'), '50');

    expect(screen.getByText('5:00')).toBeTruthy();
    expect(screen.getByLabelText('Pace intermediário!')).toBeTruthy();
  });

  it('atualiza o resultado a cada mudança', () => {
    render(<PaceCalculator />);
    typeDistance('10');
    fireEvent.changeText(screen.getByLabelText('Minutos'), '50');
    fireEvent.changeText(screen.getByLabelText('Minutos'), '45');
    expect(screen.getByText('4:30')).toBeTruthy();
  });

  it('só salva no histórico ao tocar no botão, e uma vez por cálculo', async () => {
    render(<PaceCalculator />);
    const saveButton = (): ReturnType<typeof screen.getByRole> =>
      screen.getByRole('button', { name: /histórico/ });

    // Sem resultado, o botão fica desabilitado
    expect(saveButton()).toBeDisabled();

    typeDistance('10');
    fireEvent.changeText(screen.getByLabelText('Minutos'), '50');
    expect(await getHistory()).toHaveLength(0);

    await act(async () => {
      fireEvent.press(screen.getByLabelText('Salvar no histórico'));
    });
    expect(await getHistory()).toHaveLength(1);
    expect(screen.getByText('Salvo')).toBeTruthy();
    expect(saveButton()).toBeDisabled();

    // Mudou o cálculo: pode salvar de novo
    fireEvent.changeText(screen.getByLabelText('Minutos'), '45');
    expect(screen.getByLabelText('Salvar no histórico')).toBeEnabled();
  });

  it('distância acima do máximo: erro aparece na hora, sem alerta', () => {
    render(<PaceCalculator />);
    typeDistance('600');
    expect(screen.getByText('A distância máxima é 500 km')).toBeTruthy();
  });

  it('distância abaixo do mínimo: espera sair do campo ("0" pode virar "0,5")', () => {
    render(<PaceCalculator />);
    typeDistance('0');
    expect(screen.queryByText('A distância mínima é 0,1 km')).toBeNull();

    fireEvent(screen.getByLabelText('Campo de distância em quilômetros'), 'blur');
    expect(screen.getByText('A distância mínima é 0,1 km')).toBeTruthy();

    typeDistance('0,5');
    expect(screen.queryByText('A distância mínima é 0,1 km')).toBeNull();
  });

  it('limpar apaga campos, resultado e erros', () => {
    render(<PaceCalculator />);
    typeDistance('600');
    fireEvent.changeText(screen.getByLabelText('Minutos'), '50');
    fireEvent.press(screen.getByLabelText('Limpar campos'));

    expect(screen.queryByText('A distância máxima é 500 km')).toBeNull();
    expect(screen.getByLabelText('Minutos').props.value).toBe('');
  });

  it('item restaurado do histórico já aparece calculado e marcado como salvo', () => {
    render(
      <PaceCalculator
        initialItem={{
          id: 'x',
          distanceKm: 5,
          durationSeconds: 1500,
          createdAt: new Date().toISOString(),
        }}
      />,
    );
    expect(screen.getByText('5:00')).toBeTruthy();
    expect(screen.getByText('Salvo')).toBeTruthy();
  });
});

describe('aba Tempo', () => {
  it('mostra o tempo total enquanto digita', () => {
    render(<TimeCalculator />);
    typeDistance('21,1');
    fireEvent.changeText(screen.getByLabelText('Campo de pace'), '6:00');
    expect(screen.getByText('2:06:36')).toBeTruthy();
    expect(screen.getByText('horas')).toBeTruthy();
  });

  it('pace incompleto ("5:"): erro só depois de sair do campo', () => {
    render(<TimeCalculator />);
    const paceField = screen.getByLabelText('Campo de pace');
    fireEvent.changeText(paceField, '5:');
    expect(screen.queryByText(/Formato inválido/)).toBeNull();

    fireEvent(paceField, 'blur');
    expect(screen.getByText(/Formato inválido/)).toBeTruthy();
  });
});

describe('aba Tabela', () => {
  it('monta a tabela enquanto digita', () => {
    render(<PaceTable />);
    fireEvent.changeText(screen.getByLabelText('Campo de distância da prova'), '5,5');
    fireEvent.changeText(screen.getByLabelText('Campo de pace desejado'), '5:00');
    expect(screen.getByText('Tempo final: 27:30')).toBeTruthy();
    expect(screen.getByText('5,5')).toBeTruthy();
  });

  it('negative split: mesmo tempo final, primeira metade mais lenta', () => {
    render(<PaceTable />);
    fireEvent.changeText(screen.getByLabelText('Campo de distância da prova'), '10');
    fireEvent.changeText(screen.getByLabelText('Campo de pace desejado'), '5:30');
    expect(screen.getByLabelText('Plano com ritmo constante')).toBeChecked();
    expect(screen.queryByText(/1ª metade/)).toBeNull();

    fireEvent.press(screen.getByLabelText('Plano com negative split: segunda metade mais rápida'));
    expect(screen.getByText(/1ª metade a 5:33\/km e 2ª metade a\s+5:27\/km/)).toBeTruthy();
    expect(screen.getByText('Tempo final: 55:00')).toBeTruthy();
    expect(screen.getAllByText('5:33').length).toBeGreaterThan(0); // parcial do 1º km
  });
});
