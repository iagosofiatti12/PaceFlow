import { renderHook } from '@testing-library/react-native';
import { useAutoAdvance, type FocusableInput } from '../useAutoAdvance';

const input = (focused: boolean): { current: FocusableInput & { focus: jest.Mock } } => ({
  current: { isFocused: () => focused, focus: jest.fn() },
});

const setup = (
  initial: string,
  field: 'hours' | 'minutes',
  focused = true,
): {
  next: ReturnType<typeof input>;
  type: (value: string) => void;
} => {
  const current = input(focused);
  const next = input(false);
  const { rerender } = renderHook(
    ({ value }: { value: string }) => useAutoAdvance(value, field, current, next),
    { initialProps: { value: initial } },
  );
  return { next, type: (value) => rerender({ value }) };
};

describe('useAutoAdvance', () => {
  it('horas: pula para os minutos ao completar 2 dígitos', () => {
    const { next, type } = setup('', 'hours');
    type('1');
    expect(next.current.focus).not.toHaveBeenCalled();
    type('12');
    expect(next.current.focus).toHaveBeenCalledTimes(1);
  });

  it('minutos: pula na hora com um dígito de 6 a 9', () => {
    const { next, type } = setup('', 'minutes');
    type('7');
    expect(next.current.focus).toHaveBeenCalledTimes(1);
  });

  it('não pula ao apagar (texto diminuiu)', () => {
    const { next, type } = setup('12', 'hours');
    type('1');
    expect(next.current.focus).not.toHaveBeenCalled();
  });

  it('não pula quando o campo não está com foco (ex: cálculo restaurado)', () => {
    const { next, type } = setup('', 'hours', false);
    type('12');
    expect(next.current.focus).not.toHaveBeenCalled();
  });

  it('não pula no valor inicial, só quando a pessoa digita', () => {
    const { next } = setup('12', 'hours');
    expect(next.current.focus).not.toHaveBeenCalled();
  });
});
