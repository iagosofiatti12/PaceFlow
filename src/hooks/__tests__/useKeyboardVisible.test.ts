import { act, renderHook } from '@testing-library/react-native';
import { Keyboard } from 'react-native';
import { useKeyboardVisible } from '../useKeyboardVisible';

type Listener = () => void;

describe('useKeyboardVisible', () => {
  const listeners: Record<string, Listener> = {};
  const remove = jest.fn();

  beforeEach(() => {
    remove.mockClear();
    jest.spyOn(Keyboard, 'addListener').mockImplementation(((event: string, cb: Listener) => {
      listeners[event] = cb;
      return { remove } as unknown as ReturnType<typeof Keyboard.addListener>;
    }) as typeof Keyboard.addListener);
  });

  afterEach(() => jest.restoreAllMocks());

  it('começa fechado e acompanha o teclado abrindo e fechando', () => {
    const { result } = renderHook(() => useKeyboardVisible());
    expect(result.current).toBe(false);

    act(() => listeners.keyboardDidShow());
    expect(result.current).toBe(true);

    act(() => listeners.keyboardDidHide());
    expect(result.current).toBe(false);
  });

  it('para de ouvir o teclado ao desmontar', () => {
    const { unmount } = renderHook(() => useKeyboardVisible());
    unmount();
    expect(remove).toHaveBeenCalledTimes(2);
  });
});
