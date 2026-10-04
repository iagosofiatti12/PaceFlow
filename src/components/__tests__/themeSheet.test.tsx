import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Appearance } from 'react-native';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import Header from '../Header';

jest.mock('@react-native-async-storage/async-storage', () =>
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

describe('aparência (tema no app)', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  it('abre o painel, troca para escuro, aplica e salva', async () => {
    const set = jest.spyOn(Appearance, 'setColorScheme').mockImplementation(() => {});
    render(<Header />);

    fireEvent.press(screen.getByLabelText('Aparência: Automático'));
    expect(screen.getByLabelText('Automático: Segue o tema do celular')).toBeChecked();

    await act(async () => {
      fireEvent.press(screen.getByLabelText('Escuro: Sempre escuro'));
    });

    expect(set).toHaveBeenLastCalledWith('dark');
    expect(await AsyncStorage.getItem('@paceflow:theme')).toBe('dark');
    // O ícone do botão passa a mostrar o tema escolhido
    await waitFor(() => expect(screen.getByLabelText('Aparência: Escuro')).toBeTruthy());
    set.mockRestore();
  });
});
