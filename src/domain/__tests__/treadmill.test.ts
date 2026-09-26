import { speedToPace, paceToSpeed, TREADMILL_REFERENCE_SPEEDS } from '../treadmill';

describe('speedToPace', () => {
  it('converte velocidades redondas', () => {
    expect(speedToPace(10)).toBe(360); // 6:00/km
    expect(speedToPace(12)).toBe(300); // 5:00/km
    expect(speedToPace(15)).toBe(240); // 4:00/km
  });

  it('arredonda ao segundo', () => {
    expect(speedToPace(11)).toBe(327); // 327,27 s → 5:27/km
    expect(speedToPace(9.5)).toBe(379); // 378,9 s → 6:19/km
  });
});

describe('paceToSpeed', () => {
  it('converte paces redondos', () => {
    expect(paceToSpeed(360)).toBe(10);
    expect(paceToSpeed(300)).toBe(12);
  });

  it('arredonda a 1 casa decimal, como o painel da esteira', () => {
    expect(paceToSpeed(330)).toBe(10.9); // 5:30/km = 10,909 km/h
    expect(paceToSpeed(270)).toBe(13.3); // 4:30/km = 13,33 km/h
  });

  it('faz ida e volta com speedToPace nas velocidades redondas', () => {
    [8, 10, 12, 15].forEach((kmh) => expect(paceToSpeed(speedToPace(kmh))).toBe(kmh));
  });
});

describe('TREADMILL_REFERENCE_SPEEDS', () => {
  it('vai de 8 a 16 km/h, de 0,5 em 0,5', () => {
    expect(TREADMILL_REFERENCE_SPEEDS[0]).toBe(8);
    expect(TREADMILL_REFERENCE_SPEEDS[1]).toBe(8.5);
    expect(TREADMILL_REFERENCE_SPEEDS[TREADMILL_REFERENCE_SPEEDS.length - 1]).toBe(16);
    expect(TREADMILL_REFERENCE_SPEEDS).toHaveLength(17);
  });
});
