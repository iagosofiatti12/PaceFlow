import type { Ionicons } from '@expo/vector-icons';
import type { RunType } from '../utils/personalSchema';

export interface RunTypeInfo {
  /** Nome curto, para os botões de escolha */
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
}

// Tipos de treino do diário. A ordem é a dos botões no formulário
export const RUN_TYPES: Record<RunType, RunTypeInfo> = {
  easy: { label: 'Leve', icon: 'leaf-outline' },
  long: { label: 'Longão', icon: 'trail-sign-outline' },
  workout: { label: 'Treino', icon: 'flash-outline' },
  race: { label: 'Prova', icon: 'trophy-outline' },
};

export const RUN_TYPE_ORDER: readonly RunType[] = ['easy', 'long', 'workout', 'race'];
