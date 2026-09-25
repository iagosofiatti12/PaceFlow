import { renderHook } from '@testing-library/react-native';
import * as ReactNative from 'react-native';
import { useColors, createThemedStyles } from '../useTheme';
import { DARK_COLORS, LIGHT_COLORS } from '../../constants/theme';

// Simula o tema do celular trocando o retorno do useColorScheme
const mockScheme = (scheme: 'light' | 'dark' | null): void => {
  jest.spyOn(ReactNative, 'useColorScheme').mockReturnValue(scheme);
};

afterEach(() => jest.restoreAllMocks());

describe('useColors', () => {
  it('deve usar a paleta clara no tema claro', () => {
    mockScheme('light');
    expect(renderHook(() => useColors()).result.current).toBe(LIGHT_COLORS);
  });

  it('deve usar a paleta escura no tema escuro', () => {
    mockScheme('dark');
    expect(renderHook(() => useColors()).result.current).toBe(DARK_COLORS);
  });

  it('deve cair no tema claro quando o sistema não informa o tema', () => {
    mockScheme(null);
    expect(renderHook(() => useColors()).result.current).toBe(LIGHT_COLORS);
  });
});

describe('createThemedStyles', () => {
  const useStyles = createThemedStyles((colors) => ({
    card: { backgroundColor: colors.surface },
  }));

  it('deve devolver os estilos do tema claro', () => {
    mockScheme('light');
    const styles = renderHook(() => useStyles()).result.current;
    expect(styles.card.backgroundColor).toBe(LIGHT_COLORS.surface);
  });

  it('deve devolver os estilos do tema escuro', () => {
    mockScheme('dark');
    const styles = renderHook(() => useStyles()).result.current;
    expect(styles.card.backgroundColor).toBe(DARK_COLORS.surface);
  });

  it('deve reaproveitar o mesmo objeto de estilos entre renderizações', () => {
    mockScheme('dark');
    const { result, rerender } = renderHook(() => useStyles());
    const first = result.current;
    rerender({});
    expect(result.current).toBe(first);
  });
});
