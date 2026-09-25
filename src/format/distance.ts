// Distância (número em km) → texto no formato brasileiro, com vírgula decimal

/**
 * Km → texto com vírgula: 10 → "10", 21.0975 → "21,0975", 5.5 → "5,5".
 * `maxDecimals` limita as casas (a tabela usa 1: 21.0975 → "21,1").
 */
export const formatKm = (km: number, maxDecimals = 4): string =>
  // Number(...toFixed) corta as casas extras e some com zeros à direita ("5,50" → "5,5")
  Number(km.toFixed(maxDecimals)).toString().replace('.', ',');

/** Texto do campo ("10,5" ou "10.5") → número. NaN se não for número. */
export const parseKm = (text: string): number => parseFloat(text.replace(',', '.'));
