import React, { useEffect, useState } from 'react';
import { View, Text, Platform, type LayoutChangeEvent } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { Tabs } from 'expo-router';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { SPACING, RADIUS, FONT_SIZES, FONTS, FONT_SCALE, MOTION } from '../constants/theme';
import { createThemedStyles, useColors } from '../hooks/useTheme';
import { useKeyboardVisible } from '../hooks/useKeyboardVisible';
import { notifySelection } from '../utils/feedback';
import PressableScale from './ui/PressableScale';

// Props que o navegador de abas do Expo Router entrega para uma barra customizada
// (estado das abas + objeto de navegação). Derivadas do próprio componente Tabs,
// para não depender de um pacote interno do Expo Router.
type TabBarProps = Parameters<NonNullable<React.ComponentProps<typeof Tabs>['tabBar']>>[0];

type IconName = keyof typeof Ionicons.glyphMap;

// Ícone de cada aba, pelo nome do arquivo da rota em app/: contorno quando
// inativa e preenchido quando ativa (como nos apps do iOS e do Android atuais)
const TAB_ICONS: Record<string, { outline: IconName; filled: IconName }> = {
  index: { outline: 'speedometer-outline', filled: 'speedometer' },
  time: { outline: 'time-outline', filled: 'time' },
  table: { outline: 'list-outline', filled: 'list' },
  treadmill: { outline: 'walk-outline', filled: 'walk' },
  history: { outline: 'bookmark-outline', filled: 'bookmark' },
};

const BAR_PADDING = SPACING.xs + 2;

/**
 * Barra de abas flutuante, embaixo da tela (onde o polegar alcança).
 * Uma pílula laranja-clara desliza com uma mola até a aba tocada.
 * Quem decide qual aba está ativa é o Expo Router; esta barra só desenha.
 */
const TabBar: React.FC<TabBarProps> = ({ state, descriptors, navigation }) => {
  const styles = useStyles();
  const colors = useColors();
  const [tabWidth, setTabWidth] = useState(0);
  const indicatorX = useSharedValue(0);
  const keyboardVisible = useKeyboardVisible();

  // Só as rotas com ícone viram aba. Outras telas (ex: "Você", aberta pelo
  // cabeçalho) existem no navegador, mas não aparecem na barra
  const tabs = state.routes.filter((route) => route.name in TAB_ICONS);
  const activeKey = state.routes[state.index]?.key;
  const activeIndex = tabs.findIndex((route) => route.key === activeKey);

  // A pílula vai até a aba ativa (por toque, botão voltar ou link direto)
  useEffect(() => {
    if (activeIndex >= 0) {
      indicatorX.value = withSpring(activeIndex * tabWidth, MOTION.spring.snappy);
    }
  }, [activeIndex, tabWidth, indicatorX]);

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: indicatorX.value }],
  }));

  const handleLayout = (event: LayoutChangeEvent): void => {
    const innerWidth = event.nativeEvent.layout.width - BAR_PADDING * 2;
    setTabWidth(innerWidth / tabs.length);
  };

  // No Android a tela encolhe com o teclado: sem a barra, sobra espaço para o campo
  if (Platform.OS === 'android' && keyboardVisible) return null;

  return (
    <View style={styles.wrapper}>
      <View style={styles.bar} onLayout={handleLayout} accessibilityRole="tablist">
        {tabWidth > 0 && activeIndex >= 0 && (
          <Animated.View style={[styles.indicator, { width: tabWidth }, indicatorStyle]} />
        )}
        {tabs.map((route) => {
          const isActive = route.key === activeKey;
          const label = descriptors[route.key].options.title ?? route.name;
          const icons = TAB_ICONS[route.name];

          const handlePress = (): void => {
            // Avisa o navegador do toque (padrão do React Navigation) e só troca
            // de aba se ninguém cancelou o evento e ela ainda não está ativa
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!isActive && !event.defaultPrevented) {
              notifySelection();
              navigation.navigate(route.name, route.params);
            }
          };

          return (
            <PressableScale
              key={route.key}
              style={styles.tab}
              onPress={handlePress}
              scaleTo={0.92}
              accessibilityRole="tab"
              accessibilityState={{ selected: isActive }}
              accessibilityLabel={`Aba ${label}`}
            >
              <Ionicons
                name={(isActive ? icons?.filled : icons?.outline) ?? 'ellipse-outline'}
                size={22}
                color={isActive ? colors.accent : colors.iconMuted}
              />
              {/* Cinco abas dividem a largura: com fonte ampliada, o rótulo
                  encolhe para caber numa linha em vez de cortar */}
              <Text
                style={[styles.tabText, isActive && styles.tabTextActive]}
                maxFontSizeMultiplier={FONT_SCALE.control}
                numberOfLines={1}
                adjustsFontSizeToFit
              >
                {label}
              </Text>
            </PressableScale>
          );
        })}
      </View>
    </View>
  );
};

const useStyles = createThemedStyles((colors) => ({
  bar: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: RADIUS.xxl,
    borderWidth: 1,
    elevation: 8,
    flexDirection: 'row',
    padding: BAR_PADDING,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
  },
  // Pílula da aba ativa: um único sinal (ver DESIGN.md), agora animado
  indicator: {
    backgroundColor: colors.accentSoft,
    borderRadius: RADIUS.xl,
    bottom: BAR_PADDING,
    left: BAR_PADDING,
    position: 'absolute',
    top: BAR_PADDING,
  },
  tab: {
    alignItems: 'center',
    flex: 1,
    gap: 2,
    paddingHorizontal: 2,
    paddingVertical: SPACING.sm,
  },
  tabText: {
    color: colors.text.tertiary,
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.xxs,
  },
  tabTextActive: {
    color: colors.accentText,
    fontFamily: FONTS.semiBold,
  },
  wrapper: {
    backgroundColor: colors.background,
    paddingBottom: SPACING.sm,
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.xs,
  },
}));

export default TabBar;
