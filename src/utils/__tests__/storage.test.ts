import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  saveCalculation,
  getHistory,
  clearHistory,
  deleteHistoryItem,
  findHistoryItem,
} from '../storage';

// Usa o mock oficial da biblioteca: um "AsyncStorage de mentira" que
// guarda os dados em memória só durante o teste
jest.mock('@react-native-async-storage/async-storage', () =>
  // fábricas do jest.mock precisam de require(); import não funciona aqui
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

const STORAGE_KEY = '@paceflow:history';

const readRaw = async (): Promise<unknown> => {
  const data = await AsyncStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : null;
};

describe('storage', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    jest.clearAllMocks();
  });

  describe('saveCalculation', () => {
    it('deve salvar um cálculo no histórico com dados brutos', async () => {
      await saveCalculation(10, 3930); // 10 km em 1:05:30

      const history = await getHistory();
      expect(history).toHaveLength(1);
      expect(history[0].distanceKm).toBe(10);
      expect(history[0].durationSeconds).toBe(3930);
      expect(history[0].id).toBeDefined();
      expect(history[0].createdAt).toBeDefined();
    });

    it('deve salvar tempos menores que 1 hora em segundos', async () => {
      await saveCalculation(5, 1800); // 5 km em 30:00

      const history = await getHistory();
      expect(history[0].durationSeconds).toBe(1800);
    });

    it('deve gravar no formato v2, com versão', async () => {
      await saveCalculation(5, 1800);

      expect(await readRaw()).toEqual({
        version: 2,
        items: [expect.objectContaining({ distanceKm: 5, durationSeconds: 1800 })],
      });
    });

    it('deve adicionar o item mais recente no início da lista', async () => {
      await saveCalculation(5, 1800);
      await saveCalculation(10, 3600);

      const history = await getHistory();
      expect(history[0].distanceKm).toBe(10);
      expect(history[1].distanceKm).toBe(5);
    });

    it('deve manter no máximo 10 itens no histórico', async () => {
      for (let i = 1; i <= 12; i++) {
        await saveCalculation(i, 1800);
      }

      const history = await getHistory();
      expect(history).toHaveLength(10);
      // Os mais antigos (1 e 2) foram descartados
      expect(history[0].distanceKm).toBe(12);
      expect(history[9].distanceKm).toBe(3);
    });
  });

  describe('getHistory', () => {
    it('deve retornar lista vazia quando não há nada salvo', async () => {
      const history = await getHistory();
      expect(history).toEqual([]);
    });

    it('deve retornar lista vazia se os dados salvos estiverem corrompidos', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      await AsyncStorage.setItem(STORAGE_KEY, 'isso-nao-e-json{');

      const history = await getHistory();
      expect(history).toEqual([]);
      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });

    it('deve migrar o histórico da v1 e regravar no formato v2', async () => {
      // Formato gravado pelas versões anteriores do app
      await AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify([
          {
            id: 'a',
            distance: '10',
            time: '0:50:00',
            pace: '5:00',
            date: '2026-09-20T10:00:00.000Z',
          },
        ]),
      );

      const history = await getHistory();
      expect(history).toEqual([
        { id: 'a', distanceKm: 10, durationSeconds: 3000, createdAt: '2026-09-20T10:00:00.000Z' },
      ]);
      expect(await readRaw()).toEqual({ version: 2, items: history });
    });

    it('deve ignorar só os itens inválidos, sem perder o resto', async () => {
      await AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          version: 2,
          items: [
            {
              id: 'ok',
              distanceKm: 5,
              durationSeconds: 1500,
              createdAt: '2026-09-20T10:00:00.000Z',
            },
            { id: 'ruim', distanceKm: -1, durationSeconds: 1500, createdAt: 'ontem' },
          ],
        }),
      );

      const history = await getHistory();
      expect(history.map((item) => item.id)).toEqual(['ok']);
    });
  });

  describe('findHistoryItem', () => {
    it('deve encontrar o item pelo id', async () => {
      await saveCalculation(5, 1800);
      await saveCalculation(10, 3600);
      const [latest] = await getHistory();

      expect(await findHistoryItem(latest.id)).toEqual(latest);
    });

    it('deve devolver null quando o id não existe (ex: item apagado)', async () => {
      await saveCalculation(5, 1800);
      expect(await findHistoryItem('nao-existe')).toBeNull();
    });
  });

  describe('deleteHistoryItem', () => {
    it('deve remover apenas o item com o id informado', async () => {
      await saveCalculation(5, 1800);
      await saveCalculation(10, 3600);

      const before = await getHistory();
      expect(before).toHaveLength(2);

      await deleteHistoryItem(before[0].id);

      const after = await getHistory();
      expect(after).toHaveLength(1);
      expect(after[0].distanceKm).toBe(5);
    });
  });

  describe('clearHistory', () => {
    it('deve apagar todo o histórico', async () => {
      await saveCalculation(5, 1800);
      await clearHistory();

      const history = await getHistory();
      expect(history).toEqual([]);
    });
  });
});
