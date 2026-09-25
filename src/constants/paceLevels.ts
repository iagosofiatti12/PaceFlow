import type { PaceLevel } from '../domain/levels';
import { PACE_LEVEL_COLORS } from './theme';

export interface PaceLevelStyle {
  /** Texto do selo, sem emoji (é o que o leitor de tela lê) */
  label: string;
  /** Emoji exibido ao lado do texto, só na tela */
  emoji: string;
  /** Fundo do selo */
  color: string;
  /** Texto sobre o selo: escuro quando o fundo é claro, para manter o contraste WCAG */
  textColor: string;
}

const colors = PACE_LEVEL_COLORS;
const light = PACE_LEVEL_COLORS.lightText;
const dark = PACE_LEVEL_COLORS.darkText;

// Aparência de cada nível. A regra de QUAL nível é fica em src/domain/levels.ts
export const PACE_LEVELS: Record<PaceLevel, PaceLevelStyle> = {
  alien: { label: 'Alienígena!', emoji: '👽🏅', color: colors.alien, textColor: light },
  elite: { label: 'Pace de elite!', emoji: '🏆', color: colors.elite, textColor: light },
  advanced: { label: 'Pace avançado!', emoji: '💪', color: colors.advanced, textColor: light },
  intermediate: {
    label: 'Pace intermediário!',
    emoji: '👏',
    color: colors.intermediate,
    textColor: dark,
  },
  beginner: { label: 'Pace iniciante!', emoji: '🎯', color: colors.beginner, textColor: dark },
  training: {
    label: 'Continue treinando!',
    emoji: '🚀',
    color: colors.keepTraining,
    textColor: dark,
  },
};
