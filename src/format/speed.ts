// Velocidade (km/h) ↔ texto no formato brasileiro, com vírgula decimal

/** 10 → "10,0"; 10.909 → "10,9" (sempre 1 casa, como no painel da esteira) */
export const formatSpeed = (kmh: number): string => kmh.toFixed(1).replace('.', ',');

/** Texto do campo ("10,5" ou "10.5") → número. NaN se não for número. */
export const parseSpeed = (text: string): number => parseFloat(text.replace(',', '.'));
