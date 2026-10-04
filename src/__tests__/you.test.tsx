// Tipos dos matchers extras do Expo Router (toHavePathname etc.)
/// <reference types="expo-router/types/expect" />
import AsyncStorage from '@react-native-async-storage/async-storage';
import { renderRouter, screen, fireEvent, waitFor, act } from 'expo-router/testing-library';

import RootLayout from '../../app/_layout';
import PaceScreen from '../../app/index';
import HistoryScreen from '../../app/history';
import YouScreen from '../../app/you';

// A parte pessoal do app (tela "Você"), usada como um corredor usaria

jest.mock('@react-native-async-storage/async-storage', () =>
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

const routes = {
  _layout: RootLayout,
  index: PaceScreen,
  history: HistoryScreen,
  you: YouScreen,
};

const openYou = async (): Promise<void> => {
  fireEvent.press(await screen.findByLabelText('Você: recordes, meta e treinos'));
  await waitFor(() => expect(screen).toHavePathname('/you'));
};

describe('tela Você', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  it('abre pelo cabeçalho, sem aparecer como aba na barra', async () => {
    renderRouter(routes, { initialUrl: '/' });
    await openYou();
    expect(await screen.findByText('Recordes pessoais')).toBeTruthy();
    expect(screen.queryByLabelText('Aba Você')).toBeNull();
  });

  it('pede o nome e cumprimenta', async () => {
    renderRouter(routes, { initialUrl: '/you' });
    fireEvent.changeText(await screen.findByLabelText('Seu nome'), 'Iago');
    await act(async () => {
      fireEvent.press(screen.getByLabelText('Salvar nome'));
    });
    expect(await screen.findByRole('header', { name: 'Olá, Iago' })).toBeTruthy();
  });

  it('registrar um 10K vira recorde, com aviso', async () => {
    renderRouter(routes, { initialUrl: '/you' });
    fireEvent.press(await screen.findByLabelText('Registrar treino'));

    fireEvent.changeText(screen.getByLabelText('Distância do treino em quilômetros'), '10');
    fireEvent.changeText(screen.getByLabelText('Minutos'), '50');
    fireEvent.press(screen.getByLabelText('Tipo de treino: Prova'));
    await act(async () => {
      fireEvent.press(screen.getByLabelText('Salvar treino'));
    });

    expect(await screen.findByText('Novo recorde: 10K! 🎉')).toBeTruthy();
    expect(screen.getByLabelText('Recorde 10 quilômetros: 50:00, pace 5:00 por km')).toBeTruthy();
    expect(screen.getByText('10 km · 50:00')).toBeTruthy();
  });

  it('meta mostra o pace necessário e quanto falta para o recorde', async () => {
    await AsyncStorage.setItem(
      '@paceflow:runs',
      JSON.stringify({
        version: 1,
        items: [
          {
            id: 'r1',
            date: '2026-10-01',
            distanceKm: 10,
            durationSeconds: 2952,
            type: 'race',
            createdAt: '2026-10-01T10:00:00.000Z',
          },
        ],
      }),
    );
    await AsyncStorage.setItem(
      '@paceflow:goal',
      JSON.stringify({ version: 1, distanceKm: 10, targetSeconds: 2880 }),
    );
    renderRouter(routes, { initialUrl: '/you' });

    expect(await screen.findByText('10K em 48:00')).toBeTruthy();
    expect(screen.getByText('Pace necessário: 4:48 /km')).toBeTruthy();
    expect(screen.getByText(/Seu recorde: 49:12 · faltam\s+1:12/)).toBeTruthy();
  });
});

describe('registrar como treino pela aba Pace', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  it('abre o formulário já preenchido e salva no diário', async () => {
    renderRouter(routes, { initialUrl: '/' });
    fireEvent.changeText(await screen.findByLabelText('Campo de distância em quilômetros'), '5');
    fireEvent.changeText(screen.getByLabelText('Minutos'), '25');

    fireEvent.press(screen.getByLabelText('Registrar como treino'));
    expect(screen.getByLabelText('Distância do treino em quilômetros')).toHaveDisplayValue('5');
    await act(async () => {
      fireEvent.press(screen.getByLabelText('Salvar treino'));
    });

    expect(await screen.findByText(/Novo recorde: 5K/)).toBeTruthy();
    const stored = JSON.parse((await AsyncStorage.getItem('@paceflow:runs')) ?? '{}');
    expect(stored.items).toHaveLength(1);
  });
});
