import AsyncStorage from '@react-native-async-storage/async-storage';

export interface HistoryItem {
  id: string;
  distance: string;
  time: string;
  pace: string;
  date: string;
}

const STORAGE_KEY = '@paceflow:history';
const MAX_HISTORY_ITEMS = 10;

export const saveCalculation = async (
  distance: string,
  hours: string,
  minutes: string,
  seconds: string,
  pace: string,
): Promise<void> => {
  try {
    const history = await getHistory();

    const newItem: HistoryItem = {
      // Timestamp + sufixo aleatório: dois cálculos no mesmo milissegundo
      // não podem acabar com o mesmo id
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      distance,
      time: `${hours || '0'}:${minutes.padStart(2, '0')}:${seconds.padStart(2, '0')}`,
      pace,
      date: new Date().toISOString(),
    };

    const updatedHistory = [newItem, ...history].slice(0, MAX_HISTORY_ITEMS);

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
  } catch (error) {
    console.error('Erro ao salvar histórico:', error);
  }
};

export const getHistory = async (): Promise<HistoryItem[]> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Erro ao carregar histórico:', error);
    return [];
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
    const updatedHistory = history.filter((item) => item.id !== id);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
  } catch (error) {
    console.error('Erro ao deletar item:', error);
  }
};
