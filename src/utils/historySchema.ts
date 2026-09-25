import { z } from 'zod';

// Formato do histórico salvo no aparelho.
//
// v1 (até a Fase 1a): lista de itens com texto já formatado para a tela,
//   ex: { distance: "10", time: "0:50:00", pace: "5:00", date: "..." }.
//   Texto pronto não serve para somar, comparar ou converter para milhas.
//
// v2 (atual): { version: 2, items: [...] } com dados brutos (números).
//   A tela formata na hora de mostrar, e o pace é recalculado a partir deles.
//   O campo `version` permite migrar de novo no futuro sem perder nada.

export const HISTORY_VERSION = 2;

// O Zod confere, na hora de LER, se o dado tem o formato esperado.
// Pense num porteiro: o TypeScript só confere o código na hora de compilar,
// mas o que vem do armazenamento pode ter sido gravado por uma versão
// antiga do app, ou estar corrompido. O porteiro barra o que não passa.
export const HistoryItemSchema = z.object({
  id: z.string().min(1),
  distanceKm: z.number().positive(),
  durationSeconds: z.number().int().positive(),
  createdAt: z.iso.datetime(),
});

// O tipo TypeScript nasce do schema: uma fonte só da verdade
export type HistoryItem = z.infer<typeof HistoryItemSchema>;

const HistoryEnvelopeSchema = z.object({
  version: z.literal(HISTORY_VERSION),
  // Cada item é validado separadamente (abaixo): um item estragado
  // não pode derrubar o histórico inteiro
  items: z.array(z.unknown()),
});

const LegacyItemSchema = z.object({
  id: z.string().min(1),
  distance: z.string(),
  time: z.string(),
  date: z.string(),
});

/** "h:mm:ss" → segundos (formato do campo `time` na v1) */
const legacyTimeToSeconds = (time: string): number => {
  const parts = time.split(':').map(Number);
  if (parts.length !== 3 || parts.some((n) => !Number.isInteger(n) || n < 0)) return NaN;
  const [h, m, s] = parts;
  return h * 3600 + m * 60 + s;
};

/** Converte um item v1 para v2. Devolve null se o item antigo estiver estragado. */
export const migrateLegacyItem = (raw: unknown): HistoryItem | null => {
  const legacy = LegacyItemSchema.safeParse(raw);
  if (!legacy.success) return null;

  const migrated = HistoryItemSchema.safeParse({
    id: legacy.data.id,
    distanceKm: parseFloat(legacy.data.distance),
    durationSeconds: legacyTimeToSeconds(legacy.data.time),
    createdAt: legacy.data.date,
  });
  return migrated.success ? migrated.data : null;
};

const parseItem = (raw: unknown): HistoryItem | null => {
  const result = HistoryItemSchema.safeParse(raw);
  return result.success ? result.data : null;
};

const isItem = (item: HistoryItem | null): item is HistoryItem => item !== null;

export interface ParsedHistory {
  items: HistoryItem[];
  /** true quando os dados vieram da v1 e precisam ser regravados na v2 */
  migrated: boolean;
}

/**
 * Lê o que estava salvo (já passado por JSON.parse), em qualquer versão,
 * e devolve só os itens válidos no formato atual.
 */
export const parseStoredHistory = (stored: unknown): ParsedHistory => {
  // v1: a lista era salva direto, sem envelope
  if (Array.isArray(stored)) {
    return { items: stored.map(migrateLegacyItem).filter(isItem), migrated: true };
  }

  const envelope = HistoryEnvelopeSchema.safeParse(stored);
  if (!envelope.success) return { items: [], migrated: false };

  return { items: envelope.data.items.map(parseItem).filter(isItem), migrated: false };
};

/** Monta o que vai para o armazenamento (antes do JSON.stringify) */
export const serializeHistory = (
  items: HistoryItem[],
): { version: typeof HISTORY_VERSION; items: HistoryItem[] } => ({
  version: HISTORY_VERSION,
  items,
});
