// Tipos dos matchers extras do Expo Router (toHavePathname etc.)
/// <reference types="expo-router/types/expect" />
import AsyncStorage from '@react-native-async-storage/async-storage';
import { renderRouter, screen, fireEvent, waitFor, act } from 'expo-router/testing-library';

import RootLayout from '../../app/_layout';
import PaceScreen from '../../app/index';
import TimeScreen from '../../app/time';
import TableScreen from '../../app/table';
import TreadmillScreen from '../../app/treadmill';
import HistoryScreen from '../../app/history';

// Testes de integração da navegação: montam o app com as rotas reais de app/
// (em memória) e usam como um usuário usaria, tocando nas abas e nos itens.

jest.mock('@react-native-async-storage/async-storage', () =>
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

const routes = {
  _layout: RootLayout,
  index: PaceScreen,
  time: TimeScreen,
  table: TableScreen,
  treadmill: TreadmillScreen,
  history: HistoryScreen,
};

const seedHistory = async (): Promise<void> => {
  await AsyncStorage.setItem(
    '@paceflow:history',
    JSON.stringify({
      version: 2,
      items: [
        {
          id: 'meia',
          distanceKm: 21.1,
          durationSeconds: 7596, // 2:06:36 → 6:00/km
          createdAt: new Date().toISOString(),
        },
      ],
    }),
  );
};

describe('navegação', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  it('deve abrir na aba Pace e trocar de aba pela barra', async () => {
    renderRouter(routes, { initialUrl: '/' });

    expect(await screen.findByText('Calcular pace')).toBeTruthy();
    expect(screen.getByLabelText('Aba Pace')).toBeSelected();

    fireEvent.press(screen.getByLabelText('Aba Tempo'));

    expect(await screen.findByText('Calcular tempo')).toBeTruthy();
    expect(screen).toHavePathname('/time');
    expect(screen.getByLabelText('Aba Tempo')).toBeSelected();
  });

  it('deve abrir a aba Esteira pela barra', async () => {
    renderRouter(routes, { initialUrl: '/' });

    fireEvent.press(await screen.findByLabelText('Aba Esteira'));

    expect(await screen.findByText('Consulta rápida')).toBeTruthy();
    expect(screen).toHavePathname('/treadmill');
  });

  it('deve mostrar no Histórico um cálculo salvo agora na aba Pace', async () => {
    renderRouter(routes, { initialUrl: '/' });

    fireEvent.changeText(await screen.findByLabelText('Campo de distância em quilômetros'), '10');
    fireEvent.changeText(screen.getByLabelText('Minutos'), '50');
    await act(async () => {
      fireEvent.press(screen.getByLabelText('Salvar no histórico'));
    });

    fireEvent.press(screen.getByLabelText('Aba Histórico'));

    // A aba recarrega ao ganhar foco (useFocusEffect)
    expect(await screen.findByLabelText(/^Pace 5:00 por km, 10 km em 50:00/)).toBeTruthy();
  });

  it('deve restaurar um cálculo do Histórico na aba Pace', async () => {
    await seedHistory();
    renderRouter(routes, { initialUrl: '/history' });

    fireEvent.press(await screen.findByLabelText(/^Pace 6:00 por km, 21,1 km em 2:06:36/));

    await waitFor(() => expect(screen).toHavePathname('/'));
    expect(await screen.findByDisplayValue('21,1')).toBeTruthy();
    expect(screen.getByDisplayValue('2')).toBeTruthy();
    expect(screen.getByDisplayValue('06')).toBeTruthy();
    expect(screen.getByDisplayValue('36')).toBeTruthy();
    expect(screen.getByText('6:00')).toBeTruthy();
  });

  it('deve restaurar de novo o mesmo item, descartando o que foi editado', async () => {
    await seedHistory();
    renderRouter(routes, { initialUrl: '/history' });

    fireEvent.press(await screen.findByLabelText(/^Pace 6:00 por km/));
    fireEvent.changeText(await screen.findByDisplayValue('21,1'), '5');

    fireEvent.press(screen.getByLabelText('Aba Histórico'));
    fireEvent.press(await screen.findByLabelText(/^Pace 6:00 por km/));

    expect(await screen.findByDisplayValue('21,1')).toBeTruthy();
  });
});
