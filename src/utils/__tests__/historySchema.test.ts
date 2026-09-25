import { migrateLegacyItem, parseStoredHistory, serializeHistory } from '../historySchema';

const validItem = {
  id: '1',
  distanceKm: 21.0975,
  durationSeconds: 7200,
  createdAt: '2026-09-20T10:00:00.000Z',
};

const legacyItem = {
  id: '1',
  distance: '21.0975',
  time: '2:00:00',
  pace: '5:41',
  date: '2026-09-20T10:00:00.000Z',
};

describe('migrateLegacyItem', () => {
  it('deve converter um item v1 em dados brutos', () => {
    expect(migrateLegacyItem(legacyItem)).toEqual(validItem);
  });

  it('deve converter tempos sem horas ("0:mm:ss")', () => {
    expect(migrateLegacyItem({ ...legacyItem, time: '0:25:30' })?.durationSeconds).toBe(1530);
  });

  it('deve descartar itens com distância ilegível', () => {
    expect(migrateLegacyItem({ ...legacyItem, distance: 'abc' })).toBeNull();
  });

  it('deve descartar itens com tempo em formato inesperado', () => {
    expect(migrateLegacyItem({ ...legacyItem, time: '25:30' })).toBeNull();
    expect(migrateLegacyItem({ ...legacyItem, time: '0:00:00' })).toBeNull();
    expect(migrateLegacyItem({ ...legacyItem, time: '1:xx:00' })).toBeNull();
  });

  it('deve descartar itens sem os campos obrigatórios', () => {
    expect(migrateLegacyItem({ id: '1' })).toBeNull();
    expect(migrateLegacyItem('texto solto')).toBeNull();
  });
});

describe('parseStoredHistory', () => {
  it('deve reconhecer a v1 (lista sem envelope) e marcar para regravar', () => {
    expect(parseStoredHistory([legacyItem])).toEqual({ items: [validItem], migrated: true });
  });

  it('deve ler a v2 sem marcar migração', () => {
    expect(parseStoredHistory(serializeHistory([validItem]))).toEqual({
      items: [validItem],
      migrated: false,
    });
  });

  it('deve descartar só os itens inválidos da v2', () => {
    const stored = { version: 2, items: [validItem, { ...validItem, durationSeconds: 1.5 }] };
    expect(parseStoredHistory(stored).items).toEqual([validItem]);
  });

  it('deve devolver lista vazia para versões desconhecidas ou lixo', () => {
    expect(parseStoredHistory({ version: 99, items: [validItem] }).items).toEqual([]);
    expect(parseStoredHistory(null).items).toEqual([]);
    expect(parseStoredHistory('texto').items).toEqual([]);
  });
});

describe('serializeHistory', () => {
  it('deve envolver os itens com a versão atual', () => {
    expect(serializeHistory([validItem])).toEqual({ version: 2, items: [validItem] });
  });
});
