import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  GoalSchema,
  PERSONAL_VERSION,
  ProfileSchema,
  parseStored,
  parseStoredRuns,
  serializeRuns,
  type Profile,
  type Run,
  type StoredGoal,
} from './personalSchema';

// Dados pessoais no aparelho: perfil, diário de treinos e meta.
// Sem login e sem servidor: tudo fica só no celular da pessoa.

const KEYS = {
  runs: '@paceflow:runs',
  profile: '@paceflow:profile',
  goal: '@paceflow:goal',
} as const;

/** Teto do diário: anos de treino cabem com folga, sem pesar o armazenamento */
export const MAX_RUNS = 1000;

const readJson = async (key: string): Promise<unknown> => {
  try {
    const data = await AsyncStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error(`Erro ao ler ${key}:`, error);
    return null;
  }
};

const writeJson = async (key: string, value: unknown): Promise<void> => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Erro ao salvar ${key}:`, error);
  }
};

/** Mais recentes primeiro: pelo dia do treino e, no mesmo dia, pela hora do registro */
const newestFirst = (a: Run, b: Run): number =>
  b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt);

// ---------- Diário de treinos ----------

export const getRuns = async (): Promise<Run[]> =>
  parseStoredRuns(await readJson(KEYS.runs)).sort(newestFirst);

export type NewRun = Omit<Run, 'id' | 'createdAt'>;

/** Registra um treino e devolve o treino salvo (com id) */
export const addRun = async (data: NewRun): Promise<Run> => {
  const run: Run = {
    ...data,
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: new Date().toISOString(),
  };
  const runs = await getRuns();
  await writeJson(KEYS.runs, serializeRuns([run, ...runs].sort(newestFirst).slice(0, MAX_RUNS)));
  return run;
};

export const deleteRun = async (id: string): Promise<void> => {
  const runs = await getRuns();
  await writeJson(KEYS.runs, serializeRuns(runs.filter((run) => run.id !== id)));
};

// ---------- Perfil ----------

export const getProfile = async (): Promise<Profile | null> => {
  const stored = parseStored(ProfileSchema, await readJson(KEYS.profile));
  return stored ? { name: stored.name } : null;
};

export const saveProfile = async (profile: Profile): Promise<void> =>
  writeJson(KEYS.profile, { version: PERSONAL_VERSION, name: profile.name.trim() });

// ---------- Meta ----------

export const getGoal = async (): Promise<StoredGoal | null> => {
  const stored = parseStored(GoalSchema, await readJson(KEYS.goal));
  return stored ? { distanceKm: stored.distanceKm, targetSeconds: stored.targetSeconds } : null;
};

export const saveGoal = async (goal: StoredGoal): Promise<void> =>
  writeJson(KEYS.goal, { version: PERSONAL_VERSION, ...goal });

export const clearGoal = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(KEYS.goal);
  } catch (error) {
    console.error('Erro ao apagar a meta:', error);
  }
};
