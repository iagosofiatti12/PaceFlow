import AsyncStorage from '@react-native-async-storage/async-storage';
import { saveCalculation, getHistory, clearHistory, deleteHistoryItem } from '../storage';

// Usa o mock oficial da biblioteca: um "AsyncStorage de mentira" que
// guarda os dados em memória só durante o teste
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

describe('storage', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    jest.clearAllMocks();
  });

  describe('saveCalculation', () => {
    it('deve salvar um cálculo no histórico', async () => {
      await saveCalculation('10', '1', '05', '30', '6:33');

      const history = await getHistory();
      expect(history).toHaveLength(1);
      expect(history[0].distance).toBe('10');
      expect(history[0].time).toBe('1:05:30');
      expect(history[0].pace).toBe('6:33');
      expect(history[0].id).toBeDefined();
      expect(history[0].date).toBeDefined();
    });

    it('deve usar 0 horas quando o campo de horas estiver vazio', async () => {
      await saveCalculation('5', '', '30', '0', '6:00');

      const history = await getHistory();
      expect(history[0].time).toBe('0:30:00');
    });

    it('deve adicionar o item mais recente no início da lista', async () => {
      await saveCalculation('5', '0', '30', '0', '6:00');
      await saveCalculation('10', '1', '00', '0', '6:00');

      const history = await getHistory();
      expect(history[0].distance).toBe('10');
      expect(history[1].distance).toBe('5');
    });

    it('deve manter no máximo 10 itens no histórico', async () => {
      for (let i = 1; i <= 12; i++) {
        await saveCalculation(String(i), '0', '30', '0', '6:00');
      }

      const history = await getHistory();
      expect(history).toHaveLength(10);
      // Os mais antigos (1 e 2) foram descartados
      expect(history[0].distance).toBe('12');
      expect(history[9].distance).toBe('3');
    });
  });

  describe('getHistory', () => {
    it('deve retornar lista vazia quando não há nada salvo', async () => {
      const history = await getHistory();
      expect(history).toEqual([]);
    });

    it('deve retornar lista vazia se os dados salvos estiverem corrompidos', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      await AsyncStorage.setItem('@paceflow:history', 'isso-nao-e-json{');

      const history = await getHistory();
      expect(history).toEqual([]);
      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });
  });

  describe('deleteHistoryItem', () => {
    it('deve remover apenas o item com o id informado', async () => {
      await saveCalculation('5', '0', '30', '0', '6:00');
      await saveCalculation('10', '1', '00', '0', '6:00');

      const before = await getHistory();
      expect(before).toHaveLength(2);

      await deleteHistoryItem(before[0].id);

      const after = await getHistory();
      expect(after).toHaveLength(1);
      expect(after[0].distance).toBe('5');
    });
  });

  describe('clearHistory', () => {
    it('deve apagar todo o histórico', async () => {
      await saveCalculation('5', '0', '30', '0', '6:00');
      await clearHistory();

      const history = await getHistory();
      expect(history).toEqual([]);
    });
  });
});
