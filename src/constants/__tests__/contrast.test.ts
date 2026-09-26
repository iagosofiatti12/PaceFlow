import { DARK_COLORS, LIGHT_COLORS, PACE_LEVEL_COLORS, type ColorPalette } from '../theme';
import { PACE_LEVELS } from '../paceLevels';

// Guarda de acessibilidade: mede o contraste (fórmula oficial da WCAG 2.x)
// de cada combinação de texto × fundo que o app realmente usa, nos dois temas.
// Trocou uma cor e o teste falhou? A nova cor não é legível o bastante.

/** Luminância relativa de uma cor "#RRGGBB" (WCAG 2.x) */
const luminance = (hex: string): number => {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const channel = parseInt(hex.slice(i, i + 2), 16) / 255;
    return channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

/** Razão de contraste entre duas cores: de 1 (iguais) a 21 (preto × branco) */
const contrast = (a: string, b: string): number => {
  const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (light + 0.05) / (dark + 0.05);
};

// WCAG AA: 4.5:1 para texto; 3:1 para ícones e elementos gráficos
const TEXT_MIN = 4.5;
const ICON_MIN = 3;

type Pair = [label: string, foreground: string, background: string];

const textPairs = (c: ColorPalette): Pair[] => {
  const pageBackgrounds: [string, string][] = [
    ['background', c.background],
    ['surface', c.surface],
    ['surfaceMuted', c.surfaceMuted],
  ];
  const texts: [string, string][] = [
    ['text.primary', c.text.primary],
    ['text.secondary', c.text.secondary],
    ['text.tertiary', c.text.tertiary],
    ['text.label', c.text.label],
    ['text.placeholder', c.text.placeholder],
    ['accentText', c.accentText],
  ];
  const pairs: Pair[] = [];
  texts.forEach(([textName, text]) =>
    pageBackgrounds.forEach(([bgName, bg]) => pairs.push([`${textName} / ${bgName}`, text, bg])),
  );
  return [
    ...pairs,
    ['accentText / accentSoft (aba ativa, linha final)', c.accentText, c.accentSoft],
    ['text.primary / accentSoft', c.text.primary, c.accentSoft],
    ['onAccent / accentStrong (botões, resultado)', c.onAccent, c.accentStrong],
    ['danger / surface (excluir, limpar tudo)', c.danger, c.surface],
    ['onInverse / inverseSurface (cabeçalho da tabela)', c.onInverse, c.inverseSurface],
  ];
};

const iconPairs = (c: ColorPalette): Pair[] => [
  ['iconMuted / surface', c.iconMuted, c.surface],
  ['iconMuted / background', c.iconMuted, c.background],
  ['accent / surface', c.accent, c.surface],
  ['accent / background', c.accent, c.background],
  ['onAccent / accentStrong (ícone do botão)', c.onAccent, c.accentStrong],
  ['danger / surfaceMuted (borda de campo com erro)', c.danger, c.surfaceMuted],
];

describe.each([
  ['claro', LIGHT_COLORS],
  ['escuro', DARK_COLORS],
])('contraste do tema %s', (_, colors) => {
  it.each(textPairs(colors))('texto %s', (_label, foreground, background) => {
    expect(contrast(foreground, background)).toBeGreaterThanOrEqual(TEXT_MIN);
  });

  it.each(iconPairs(colors))('ícone %s', (_label, foreground, background) => {
    expect(contrast(foreground, background)).toBeGreaterThanOrEqual(ICON_MIN);
  });
});

describe('contraste dos selos de nível do pace', () => {
  it.each(Object.entries(PACE_LEVELS))('selo %s', (_level, style) => {
    expect(contrast(style.textColor, style.color)).toBeGreaterThanOrEqual(TEXT_MIN);
  });

  it('usa só cores da escala PACE_LEVEL_COLORS', () => {
    const scale: string[] = Object.values(PACE_LEVEL_COLORS);
    Object.values(PACE_LEVELS).forEach((style) => {
      expect(scale).toContain(style.color);
      expect(scale).toContain(style.textColor);
    });
  });
});

describe('fórmula de contraste', () => {
  it('confere com os valores de referência da WCAG', () => {
    expect(contrast('#000000', '#FFFFFF')).toBeCloseTo(21, 0);
    expect(contrast('#FFFFFF', '#FFFFFF')).toBeCloseTo(1, 5);
    expect(contrast('#767676', '#FFFFFF')).toBeCloseTo(4.54, 2);
  });
});
