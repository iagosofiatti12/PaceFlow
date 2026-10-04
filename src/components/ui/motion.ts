import { FadeIn, FadeInDown, FadeOut, LinearTransition } from 'react-native-reanimated';
import { MOTION } from '../../constants/theme';

// Animações prontas do app (Reanimated "layout animations"). Ficam num lugar só
// para todas as telas se moverem do mesmo jeito, como os tokens de cor do theme.ts.
// Todas respeitam o "reduzir movimento" do celular (padrão do Reanimated).

const { gentle, snappy } = MOTION.spring;

/** Cartão ou seção que aparece: sobe um pouco e surge com uma mola suave */
export const enterSection = FadeInDown.springify()
  .damping(gentle.damping)
  .stiffness(gentle.stiffness)
  .withInitialValues({ opacity: 0, transform: [{ translateY: 16 }] });

/** Item de lista que aparece em sequência (`index` = posição na lista) */
export const enterItem = (index: number): typeof enterSection =>
  enterSection.delay(Math.min(index, 10) * MOTION.stagger);

/** Troca rápida de conteúdo (ex: o número do resultado a cada tecla) */
export const enterQuick = FadeIn.duration(MOTION.duration.base);

/** Saída discreta */
export const exitQuick = FadeOut.duration(MOTION.duration.fast);

/**
 * Itens de lista deslizam para o novo lugar quando um vizinho sai
 * (ex: os cálculos de baixo sobem ao excluir um do histórico).
 */
export const layoutSpring = LinearTransition.springify()
  .damping(snappy.damping)
  .stiffness(snappy.stiffness);
