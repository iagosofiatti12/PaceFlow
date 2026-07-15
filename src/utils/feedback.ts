import { Alert } from 'react-native';
import * as Haptics from 'expo-haptics';

/**
 * Feedback padrão de erro de validação: vibração de erro + alerta com a mensagem.
 */
export const showValidationError = (message?: string): void => {
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
  Alert.alert('Atenção', message ?? 'Verifique os dados informados');
};

/**
 * Vibração de sucesso após um cálculo válido.
 */
export const notifySuccess = (): void => {
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
};
