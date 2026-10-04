import * as Haptics from 'expo-haptics';

/**
 * Vibração de sucesso (ex: cálculo salvo no histórico).
 *
 * Os erros de validação não vibram nem abrem alerta: eles aparecem embaixo
 * do próprio campo (ver FieldError), sem interromper quem está digitando.
 */
export const notifySuccess = (): void => {
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
};

/**
 * Toque leve de seleção (trocar de aba, escolher um atalho ou modo).
 * É o "clique" sutil que apps modernos dão ao escolher uma opção.
 */
export const notifySelection = (): void => {
  Haptics.selectionAsync();
};
