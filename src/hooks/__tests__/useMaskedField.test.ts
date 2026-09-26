import { renderHook, act } from '@testing-library/react-native';
import { useMaskedField } from '../useMaskedField';
import { formatDistanceInput, formatPaceInput } from '../../format/masks';

describe('useMaskedField', () => {
  it('deve começar com o valor inicial', () => {
    const { result } = renderHook(() => useMaskedField(formatDistanceInput, '10'));
    expect(result.current.value).toBe('10');
  });

  it('deve aplicar a máscara ao digitar', () => {
    const { result } = renderHook(() => useMaskedField(formatDistanceInput));
    act(() => result.current.onChangeText('10.5'));
    expect(result.current.value).toBe('10,5');
  });

  it('deve ignorar a tecla quando a máscara devolve null', () => {
    const { result } = renderHook(() => useMaskedField(formatDistanceInput, '10'));
    act(() => result.current.onChangeText('10a'));
    expect(result.current.value).toBe('10');
  });

  it('deve aceitar máscaras que nunca rejeitam', () => {
    const { result } = renderHook(() => useMaskedField(formatPaceInput));
    act(() => result.current.onChangeText('530'));
    expect(result.current.value).toBe('53:0');
  });

  it('deve limpar o campo', () => {
    const { result } = renderHook(() => useMaskedField(formatDistanceInput, '10'));
    act(() => result.current.clear());
    expect(result.current.value).toBe('');
  });

  it('deve começar sem ter sido visitado', () => {
    const { result } = renderHook(() => useMaskedField(formatDistanceInput));
    expect(result.current.touched).toBe(false);
  });

  it('deve marcar como visitado ao sair do campo', () => {
    const { result } = renderHook(() => useMaskedField(formatDistanceInput));
    act(() => result.current.onBlur());
    expect(result.current.touched).toBe(true);
  });

  it('limpar deve esquecer a visita', () => {
    const { result } = renderHook(() => useMaskedField(formatDistanceInput, '10'));
    act(() => result.current.onBlur());
    act(() => result.current.clear());
    expect(result.current.touched).toBe(false);
  });
});
