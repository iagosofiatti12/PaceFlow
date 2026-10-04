// Design Tokens - Cores, espaçamentos e tamanhos usados no app (ver DESIGN.md)

/**
 * Paleta de cores com nomes pelo PAPEL da cor, e não pela aparência:
 * `surface` é "fundo de cartão" (branco no tema claro, cinza-escuro no escuro).
 * Assim o componente pede "a cor de cartão" e o tema decide qual é.
 *
 * Todas as combinações de texto × fundo passam no contraste WCAG AA (4.5:1),
 * e o teste src/constants/__tests__/contrast.test.ts garante isso no CI.
 */
export interface ColorPalette {
  /** Fundo das telas */
  background: string;
  /** Fundo de cartões, barra de abas e tabela */
  surface: string;
  /** Fundo de campos de texto e linhas alternadas da tabela */
  surfaceMuted: string;
  /** Bordas de campos e divisórias */
  border: string;
  /** Detalhes decorativos sem texto (ex: os ":" entre h, min e seg) */
  borderStrong: string;
  text: {
    /** Títulos, valores e texto principal */
    primary: string;
    /** Descrições e texto de apoio */
    secondary: string;
    /** Unidades, abas inativas, datas */
    tertiary: string;
    /** Rótulos de campos */
    label: string;
    /** Texto de exemplo dentro de campos vazios */
    placeholder: string;
  };
  /** Ícones secundários (abas inativas, estado vazio) — mínimo 3:1 */
  iconMuted: string;
  /** Laranja da marca (a mesma cor do logo) para ícones e detalhes, sem texto por cima */
  accent: string;
  /** Laranja de fundo com texto branco por cima: botões e cartão de resultado */
  accentStrong: string;
  /** Ponta escura do degradê do cartão de resultado (mais contraste com o branco) */
  accentDeep: string;
  /** Laranja para TEXTO sobre fundos do app ("km", coluna Total) */
  accentText: string;
  /** Fundo laranja-claro: aba ativa, linha final da tabela */
  accentSoft: string;
  /** Texto e ícones sobre accentStrong */
  onAccent: string;
  /** Ações destrutivas (excluir, limpar tudo) */
  danger: string;
  /** Fundo "invertido" (cabeçalho da tabela) e o texto sobre ele */
  inverseSurface: string;
  onInverse: string;
  shadow: string;
  /** Véu escuro atrás de painéis que sobem (ex: "Aparência") */
  scrim: string;
}

export const LIGHT_COLORS: ColorPalette = {
  background: '#FAF8F5',
  surface: '#FFFFFF',
  surfaceMuted: '#F9F7F4',
  border: '#E8E8E8',
  borderStrong: '#DDDDDD',
  text: {
    primary: '#2C2C2C',
    secondary: '#5F5F5F',
    tertiary: '#6B6B6B',
    label: '#444444',
    placeholder: '#6E6E6E',
  },
  iconMuted: '#8A8A8A',
  accent: '#E75713',
  accentStrong: '#BF4B17',
  accentDeep: '#8F340C',
  accentText: '#BF4B17',
  accentSoft: '#FFF5F0',
  onAccent: '#FFFFFF',
  danger: '#C62828',
  inverseSurface: '#2C2C2C',
  onInverse: '#FFFFFF',
  shadow: '#000000',
  scrim: 'rgba(0, 0, 0, 0.45)',
};

// Tema escuro: fundos quase pretos com um toque quente (combinam com o laranja),
// texto claro e laranja mais luminoso para continuar legível no escuro
export const DARK_COLORS: ColorPalette = {
  background: '#121110',
  surface: '#1C1A18',
  surfaceMuted: '#27231F',
  border: '#3A3531',
  borderStrong: '#4A443F',
  text: {
    primary: '#F2EFEA',
    secondary: '#C2BBB2',
    tertiary: '#A8A198',
    label: '#DCD6CE',
    placeholder: '#958E85',
  },
  iconMuted: '#7F786F',
  accent: '#F07A45',
  accentStrong: '#BF4B17',
  accentDeep: '#8F340C',
  accentText: '#F07A45',
  accentSoft: '#3A2418',
  onAccent: '#FFFFFF',
  danger: '#FF8A80',
  inverseSurface: '#E9E4DD',
  onInverse: '#1C1A18',
  shadow: '#000000',
  scrim: 'rgba(0, 0, 0, 0.6)',
};

// Escala de cores do selo de nível do pace (do mais rápido ao mais lento).
// Igual nos dois temas: o selo tem fundo próprio e texto calibrado para ele.
export const PACE_LEVEL_COLORS = {
  alien: '#587a0e',
  elite: '#A73E12',
  advanced: '#C2521C',
  intermediate: '#EC7A42',
  beginner: '#F29A6A',
  keepTraining: '#FBB896',
  /** Texto sobre fundos escuros da escala */
  lightText: '#FFFFFF',
  /** Texto sobre fundos claros da escala (intermediário/iniciante/treinando) */
  darkText: '#4A2410',
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
  xs: 8,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 20,
  xxl: 24,
  /** Pílula: botões, chips e barra de abas */
  pill: 999,
} as const;

export const FONT_SIZES = {
  /** Rótulo das abas */
  xxs: 11,
  xs: 12,
  sm: 13,
  md: 15,
  lg: 17,
  xl: 20,
  xxl: 22,
  /** Título grande de cada aba */
  title: 30,
  xxxl: 46,
} as const;

// Sistema tipográfico (ver DESIGN.md):
// - Geist Sans para interface: regular 400 / medium 500 / semibold 600
// - Geist Mono para números, sempre com fontVariant: ['tabular-nums']
//   (dígitos de largura igual, para números alinharem como numa planilha)
export const FONTS = {
  regular: 'Geist_400Regular',
  medium: 'Geist_500Medium',
  semiBold: 'Geist_600SemiBold',
  mono: 'GeistMono_500Medium',
  monoSemiBold: 'GeistMono_600SemiBold',
} as const;

/**
 * Teto de ampliação da fonte (maxFontSizeMultiplier) quando a pessoa aumenta
 * o tamanho do texto no celular (acessibilidade).
 *
 * Texto corrido (títulos, descrições, histórico) cresce sem limite: ele quebra
 * linha. Já elementos de largura fixa estourariam a tela, então têm um teto:
 * - display: o número grande do resultado (46px → no máximo ~60px)
 * - control: botões, abas, campos e células da tabela, que dividem a linha com outros
 */
export const FONT_SCALE = {
  display: 1.3,
  control: 1.4,
} as const;

/**
 * Movimento (ver DESIGN.md, "Motion"). Molas em vez de durações fixas: o
 * movimento desacelera como um objeto real, e o app parece "vivo" sem demorar.
 * Todas as animações do Reanimated respeitam o "reduzir movimento" do celular.
 */
export const MOTION = {
  /** Durações (ms) para fades e trocas de cor */
  duration: {
    fast: 150,
    base: 220,
    slow: 320,
  },
  /** Molas do Reanimated (withSpring / .springify()) */
  spring: {
    /** Resposta rápida e firme: toque, indicador de aba, seleção */
    snappy: { damping: 20, stiffness: 300, mass: 0.8 },
    /** Entrada de cartões e seções */
    gentle: { damping: 18, stiffness: 160, mass: 1 },
  },
  /** Escala do botão enquanto o dedo está em cima */
  pressScale: 0.96,
  /** Atraso entre itens de uma lista que entra em sequência (ms) */
  stagger: 40,
} as const;

/**
 * Abertura do app (IntroAnimation): tempos em ms. O logo cresce (mola, ~450 ms), pulsa
 * `pulses` vezes e sai correndo. Tudo junto dura uns 2 segundos.
 */
export const INTRO = {
  /** Tamanho do logo depois de crescer (1 = tamanho da splash) */
  bigScale: 1.7,
  /** Duração de uma batida (cresce e volta) */
  pulse: 520,
  /** Quantas batidas */
  pulses: 2,
  /** Quando a corrida começa (depois de crescer e pulsar) */
  runStart: 1450,
  /** Recuo antes de disparar */
  windUp: 160,
  /** Disparo até sair da tela */
  sprint: 420,
  /** Fade do fundo revelando o app */
  fadeOut: 280,
} as const;
