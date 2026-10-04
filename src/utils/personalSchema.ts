import { z } from 'zod';

// Formato dos dados pessoais salvos no aparelho (perfil, diário de treinos e meta).
// Mesma ideia do histórico (historySchema.ts): o Zod é o "porteiro" que confere o que
// vem do armazenamento, e cada formato tem `version` para poder migrar no futuro.

export const PERSONAL_VERSION = 1;

/** Tipo de treino, para o diário */
export const RunTypeSchema = z.enum(['easy', 'long', 'workout', 'race']);
export type RunType = z.infer<typeof RunTypeSchema>;

/** Limite da anotação de um treino (cabe numa linha e meia da tela) */
export const MAX_NOTE_LENGTH = 140;

export const RunSchema = z.object({
  id: z.string().min(1),
  /** Dia do treino, no formato AAAA-MM-DD (sem hora: "corri no sábado") */
  date: z.iso.date(),
  distanceKm: z.number().positive(),
  durationSeconds: z.number().int().positive(),
  type: RunTypeSchema,
  note: z.string().max(MAX_NOTE_LENGTH).optional(),
  /** Quando foi registrado: desempata treinos do mesmo dia */
  createdAt: z.iso.datetime(),
});
export type Run = z.infer<typeof RunSchema>;

const RunsEnvelopeSchema = z.object({
  version: z.literal(PERSONAL_VERSION),
  items: z.array(z.unknown()),
});

/**
 * Lê o diário salvo (já passado por JSON.parse). Treinos estragados são
 * descartados um a um, sem perder o resto.
 */
export const parseStoredRuns = (stored: unknown): Run[] => {
  const envelope = RunsEnvelopeSchema.safeParse(stored);
  if (!envelope.success) return [];
  return envelope.data.items.flatMap((raw) => {
    const run = RunSchema.safeParse(raw);
    return run.success ? [run.data] : [];
  });
};

export const serializeRuns = (
  items: Run[],
): { version: typeof PERSONAL_VERSION; items: Run[] } => ({ version: PERSONAL_VERSION, items });

/** Limite do nome no perfil */
export const MAX_NAME_LENGTH = 30;

export const ProfileSchema = z.object({
  version: z.literal(PERSONAL_VERSION),
  name: z.string().trim().min(1).max(MAX_NAME_LENGTH),
});
export type Profile = Omit<z.infer<typeof ProfileSchema>, 'version'>;

export const GoalSchema = z.object({
  version: z.literal(PERSONAL_VERSION),
  distanceKm: z.number().positive(),
  targetSeconds: z.number().int().positive(),
});
export type StoredGoal = Omit<z.infer<typeof GoalSchema>, 'version'>;

/** Lê um objeto salvo com um schema; qualquer problema vira null */
export const parseStored = <T>(schema: z.ZodType<T>, stored: unknown): T | null => {
  const result = schema.safeParse(stored);
  return result.success ? result.data : null;
};
