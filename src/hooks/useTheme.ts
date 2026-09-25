import { StyleSheet, useColorScheme } from 'react-native';
import { DARK_COLORS, LIGHT_COLORS, type ColorPalette } from '../constants/theme';

/**
 * Paleta de cores do tema atual do celular (claro ou escuro).
 * Troca sozinha quando a pessoa muda o tema do sistema.
 */
export const useColors = (): ColorPalette =>
  useColorScheme() === 'dark' ? DARK_COLORS : LIGHT_COLORS;

/**
 * Cria estilos que dependem do tema, no lugar do StyleSheet.create direto.
 *
 * Os dois conjuntos (claro e escuro) são montados UMA vez, quando o arquivo
 * carrega; o hook devolvido só escolhe qual usar. Pense em dois figurinos
 * já prontos no camarim: trocar de tema é trocar de roupa, não costurar outra.
 *
 * Uso:
 *   const useStyles = createThemedStyles((colors) => ({
 *     card: { backgroundColor: colors.surface },
 *   }));
 *   // dentro do componente:
 *   const styles = useStyles();
 */
export const createThemedStyles = <T extends StyleSheet.NamedStyles<T>>(
  factory: (colors: ColorPalette) => T,
): (() => T) => {
  const light = StyleSheet.create(factory(LIGHT_COLORS));
  const dark = StyleSheet.create(factory(DARK_COLORS));
  return function useThemedStyles(): T {
    return useColorScheme() === 'dark' ? dark : light;
  };
};
