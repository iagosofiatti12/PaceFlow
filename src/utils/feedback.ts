import { Alert } from 'react-native';
import * as Haptics from 'expo-haptics';
import { VALIDATION_MESSAGES } from '../constants/messages';
import type { ValidationError } from '../validation/rules';

/**
 * Feedback padrão de erro de validação: vibração de erro + alerta com a mensagem
 * correspondente ao código de erro.
 */
export const showValidationError = (error: ValidationError): void => {
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
  Alert.alert('Atenção', VALIDATION_MESSAGES[error]);
};

/**
 * Vibração de sucesso após um cálculo válido.
 */
export const notifySuccess = (): void => {
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
};
