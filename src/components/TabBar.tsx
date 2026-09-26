import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { Tabs } from 'expo-router';
import { SPACING, RADIUS, FONT_SIZES, FONTS, FONT_SCALE } from '../constants/theme';
import { createThemedStyles, useColors } from '../hooks/useTheme';

// Props que o navegador de abas do Expo Router entrega para uma barra customizada
// (estado das abas + objeto de navegação). Derivadas do próprio componente Tabs,
// para não depender de um pacote interno do Expo Router.
type TabBarProps = Parameters<NonNullable<React.ComponentProps<typeof Tabs>['tabBar']>>[0];

// Ícone de cada aba, pelo nome do arquivo da rota em app/
const TAB_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  index: 'speedometer-outline',
  time: 'time-outline',
  table: 'list-outline',
  treadmill: 'walk-outline',
  history: 'archive-outline',
};

/**
 * Barra de abas no estilo do app (pílula laranja-clara na aba ativa, ver DESIGN.md).
 * Quem decide qual aba está ativa agora é o Expo Router; esta barra só desenha.
 */
const TabBar: React.FC<TabBarProps> = ({ state, descriptors, navigation }) => {
  const styles = useStyles();
  const colors = useColors();
  return (
    <View style={styles.tabContainer}>
      {state.routes.map((route, index) => {
        const isActive = state.index === index;
        const label = descriptors[route.key].options.title ?? route.name;

        const handlePress = (): void => {
          // Avisa o navegador do toque (padrão do React Navigation) e só troca
          // de aba se ninguém cancelou o evento e ela ainda não está ativa
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          if (!isActive && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        return (
          <Pressable
            key={route.key}
            style={({ pressed }) => [
              styles.tab,
              isActive && styles.tabActive,
              pressed && styles.pressed,
            ]}
            onPress={handlePress}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
            accessibilityLabel={`Aba ${label}`}
          >
            <Ionicons
              name={TAB_ICONS[route.name] ?? 'ellipse-outline'}
              size={20}
              color={isActive ? colors.accent : colors.iconMuted}
              style={styles.tabIcon}
            />
            {/* Cinco abas dividem a largura: com fonte ampliada, o rótulo
                encolhe para caber numa linha em vez de quebrar */}
            <Text
              style={[styles.tabText, isActive && styles.tabTextActive]}
              maxFontSizeMultiplier={FONT_SCALE.control}
              numberOfLines={1}
              adjustsFontSizeToFit
            >
              {label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};

const useStyles = createThemedStyles((colors) => ({
  pressed: {
    opacity: 0.7,
  },
  tab: {
    alignItems: 'center',
    borderRadius: RADIUS.sm,
    flex: 1,
    paddingVertical: SPACING.xs,
    position: 'relative',
  },
  tabIcon: {
    marginBottom: 2,
  },
  // Um único sinal de aba ativa (ver DESIGN.md): pílula laranja-clara
  tabActive: {
    backgroundColor: colors.accentSoft,
  },
  tabContainer: {
    backgroundColor: colors.surface,
    borderRadius: RADIUS.lg,
    elevation: 4,
    flexDirection: 'row',
    marginBottom: 0,
    marginHorizontal: SPACING.lg,
    padding: 6,
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
  },
  tabText: {
    color: colors.text.tertiary,
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.md,
  },
  tabTextActive: {
    color: colors.accentText,
    fontFamily: FONTS.semiBold,
  },
}));

export default TabBar;
