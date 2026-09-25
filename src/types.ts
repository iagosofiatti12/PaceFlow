// Tipos compartilhados entre componentes do app
export type TabKey = 'pace' | 'time' | 'table' | 'history';

export interface PaceFeedback {
  /** Texto exibido no selo, com emoji */
  text: string;
  /** Mesmo texto sem emoji, para o leitor de tela não ler "rosto de alienígena, medalha..." */
  accessibilityText: string;
  color: string;
  /** Cor do texto sobre o badge — escura quando o fundo é claro, para manter contraste */
  textColor: string;
}
