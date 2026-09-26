import type { ValidationError } from '../validation/rules';

// Textos das mensagens de validação. Record<ValidationError, string> obriga
// o TypeScript a reclamar se um código novo de erro nascer sem mensagem.
export const VALIDATION_MESSAGES: Record<ValidationError, string> = {
  'distance.empty': 'Por favor, insira uma distância válida',
  'distance.min': 'A distância mínima é 0,1 km',
  'distance.max': 'A distância máxima é 500 km',
  'time.empty': 'Por favor, insira um tempo válido',
  'time.max': 'O tempo deve ser de no máximo 99:59:59',
  'pace.empty': 'Por favor, insira um pace válido',
  'pace.format': 'Formato inválido. Use: minutos:segundos (ex: 5:30)',
  'pace.range': 'Pace deve estar entre 0:01 e 20:00 por km',
  'pace.zero': 'Pace não pode ser zero',
};
