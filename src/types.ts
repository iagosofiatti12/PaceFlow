// Tipos compartilhados entre componentes do app
export type TabKey = 'pace' | 'time' | 'table' | 'history';

export interface PaceFeedback {
  text: string;
  color: string;
  /** Cor do texto sobre o badge — escura quando o fundo é claro, para manter contraste */
  textColor: string;
}
