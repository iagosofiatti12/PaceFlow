// Nível do corredor a partir do pace. O domínio só diz QUAL é o nível;
// texto, emoji e cor de cada nível ficam em src/constants/paceLevels.ts.
// Assim a mesma regra serve para modo escuro, outro idioma ou um widget.

export type PaceLevel = 'alien' | 'elite' | 'advanced' | 'intermediate' | 'beginner' | 'training';

/** Limite superior (exclusivo) de cada nível, em segundos por km */
const LEVEL_THRESHOLDS: readonly [number, PaceLevel][] = [
  [3 * 60, 'alien'],
  [4 * 60, 'elite'],
  [5 * 60, 'advanced'],
  [6 * 60, 'intermediate'],
  [8 * 60, 'beginner'],
];

export const getPaceLevel = (paceSeconds: number): PaceLevel => {
  const match = LEVEL_THRESHOLDS.find(([limit]) => paceSeconds < limit);
  return match ? match[1] : 'training';
};
