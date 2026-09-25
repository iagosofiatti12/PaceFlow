import AsyncStorage from '@react-native-async-storage/async-storage';
import { parseStoredHistory, serializeHistory, type HistoryItem } from './historySchema';

export type { HistoryItem } from './historySchema';

const STORAGE_KEY = '@paceflow:history';
const MAX_HISTORY_ITEMS = 10;

const writeHistory = async (items: HistoryItem[]): Promise<void> => {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(serializeHistory(items)));
};

/**
 * Lê o histórico. Se encontrar dados da versão antiga (v1), converte
 * e já regrava no formato novo, para não precisar migrar de novo.
 */
export const getHistory = async (): Promise<HistoryItem[]> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    if (!data) return [];

    const { items, migrated } = parseStoredHistory(JSON.parse(data));
    if (migrated) {
      await writeHistory(items);
    }
    return items;
  } catch (error) {
    console.error('Erro ao carregar histórico:', error);
    return [];
  }
};

/** Salva um cálculo de pace (dados brutos: km e segundos) no topo do histórico. */
export const saveCalculation = async (
  distanceKm: number,
  durationSeconds: number,
): Promise<void> => {
  try {
    const history = await getHistory();

    const newItem: HistoryItem = {
      // Timestamp + sufixo aleatório: dois cálculos no mesmo milissegundo
      // não podem acabar com o mesmo id
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      distanceKm,
      durationSeconds,
      createdAt: new Date().toISOString(),
    };

    await writeHistory([newItem, ...history].slice(0, MAX_HISTORY_ITEMS));
  } catch (error) {
    console.error('Erro ao salvar histórico:', error);
  }
};

export const clearHistory = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Erro ao limpar histórico:', error);
  }
};

export const deleteHistoryItem = async (id: string): Promise<void> => {
  try {
    const history = await getHistory();
    await writeHistory(history.filter((item) => item.id !== id));
  } catch (error) {
    console.error('Erro ao deletar item:', error);
  }
};
