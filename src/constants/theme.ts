// Design Tokens - Cores, espaçamentos e tamanhos usados no app
export const COLORS = {
  primary: '#E8662E',
  primaryLight: '#fff5f0',
  background: '#FAF8F5',
  white: '#FFFFFF',
  danger: '#ff6b6b',
  shadow: '#000',
  text: {
    primary: '#2C2C2C',
    secondary: '#777',
    tertiary: '#999',
    light: '#AAA',
    muted: '#666',
    label: '#444',
  },
  border: '#E8E8E8',
  borderLight: '#DDD',
  input: '#F9F7F4',
  // Escala de cores do feedback de pace (do mais rápido ao mais lento)
  paceFeedback: {
    alien: '#587a0e',
    elite: '#A73E12',
    advanced: '#D9591E',
    intermediate: '#EC7A42',
    beginner: '#F29A6A',
    keepTraining: '#FBB896',
  },
} as const;

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
} as const;

export const RADIUS = {
  sm: 12,
  md: 14,
  lg: 16,
  xl: 20,
  xxl: 24,
} as const;

export const FONT_SIZES = {
  xs: 12,
  sm: 13,
  md: 15,
  lg: 17,
  xl: 20,
  xxl: 26,
  xxxl: 56,
} as const;
