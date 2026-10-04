import { useCallback, useEffect, useState } from 'react';
import { RACE_DISTANCES } from '../constants/raceDistances';
import { recordsBrokenBy } from '../domain/records';
import {
  addRun,
  clearGoal,
  deleteRun,
  getGoal,
  getProfile,
  getRuns,
  saveGoal,
  saveProfile,
  type NewRun,
} from '../utils/personalStorage';
import type { Profile, Run, StoredGoal } from '../utils/personalSchema';

const RACE_KMS = RACE_DISTANCES.map((race) => race.km);

export interface PersonalData {
  loaded: boolean;
  profile: Profile | null;
  runs: Run[];
  goal: StoredGoal | null;
  /** Lê tudo de novo do aparelho (ex: ao voltar para a tela) */
  reload: () => Promise<void>;
  /** Registra um treino e devolve as distâncias em que ele virou recorde */
  logRun: (run: NewRun) => Promise<number[]>;
  removeRun: (id: string) => Promise<void>;
  setName: (name: string) => Promise<void>;
  setGoal: (goal: StoredGoal | null) => Promise<void>;
}

/**
 * Dados pessoais do corredor (perfil, diário de treinos e meta), lidos do
 * aparelho, com as ações para alterar. Cada ação salva e atualiza a tela.
 */
export const usePersonalData = (): PersonalData => {
  const [loaded, setLoaded] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [runs, setRuns] = useState<Run[]>([]);
  const [goal, setGoalState] = useState<StoredGoal | null>(null);

  const reload = useCallback(async (): Promise<void> => {
    const [storedProfile, storedRuns, storedGoal] = await Promise.all([
      getProfile(),
      getRuns(),
      getGoal(),
    ]);
    setProfile(storedProfile);
    setRuns(storedRuns);
    setGoalState(storedGoal);
    setLoaded(true);
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  const logRun = useCallback(async (data: NewRun): Promise<number[]> => {
    const previous = await getRuns();
    const run = await addRun(data);
    setRuns(await getRuns());
    return recordsBrokenBy(run, previous, RACE_KMS);
  }, []);

  const removeRun = useCallback(async (id: string): Promise<void> => {
    await deleteRun(id);
    setRuns(await getRuns());
  }, []);

  const setName = useCallback(async (name: string): Promise<void> => {
    await saveProfile({ name });
    setProfile(await getProfile());
  }, []);

  const setGoal = useCallback(async (value: StoredGoal | null): Promise<void> => {
    if (value) await saveGoal(value);
    else await clearGoal();
    setGoalState(value);
  }, []);

  return { loaded, profile, runs, goal, reload, logRun, removeRun, setName, setGoal };
};
