import React, { useEffect, useState } from 'react';
import { View, Text, type LayoutChangeEvent } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { FONT_SCALE, FONT_SIZES, FONTS, MOTION, RADIUS, SPACING } from '../../constants/theme';
import { createThemedStyles } from '../../hooks/useTheme';
import { notifySelection } from '../../utils/feedback';
import PressableScale from './PressableScale';

export interface SegmentOption<T extends string> {
  value: T;
  label: string;
  /** Descrição lida pelo leitor de tela (quando o rótulo curto não basta) */
  accessibilityLabel?: string;
}

interface SegmentedControlProps<T extends string> {
  options: readonly SegmentOption<T>[];
  value: T;
  onChange: (value: T) => void;
}

const PADDING = SPACING.xs;

/**
 * Botões lado a lado para escolher um modo (ex: "Sei a velocidade" / "Sei o pace").
 * A pílula da opção escolhida desliza até a nova opção com uma mola,
 * igual à barra de abas.
 */
const SegmentedControl = <T extends string>({
  options,
  value,
  onChange,
}: SegmentedControlProps<T>): React.ReactElement => {
  const styles = useStyles();
  const [segmentWidth, setSegmentWidth] = useState(0);
  const selectedIndex = Math.max(
    0,
    options.findIndex((option) => option.value === value),
  );
  const indicatorX = useSharedValue(0);

  useEffect(() => {
    indicatorX.value = withSpring(selectedIndex * segmentWidth, MOTION.spring.snappy);
  }, [selectedIndex, segmentWidth, indicatorX]);

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: indicatorX.value }],
  }));

  const handleLayout = (event: LayoutChangeEvent): void => {
    setSegmentWidth((event.nativeEvent.layout.width - PADDING * 2) / options.length);
  };

  return (
    <View style={styles.container} accessibilityRole="radiogroup" onLayout={handleLayout}>
      {segmentWidth > 0 && (
        <Animated.View style={[styles.indicator, { width: segmentWidth }, indicatorStyle]} />
      )}
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <PressableScale
            key={option.value}
            onPress={() => {
              if (!selected) notifySelection();
              onChange(option.value);
            }}
            style={styles.segment}
            accessibilityRole="radio"
            accessibilityState={{ checked: selected }}
            accessibilityLabel={option.accessibilityLabel ?? option.label}
          >
            <Text
              style={[styles.label, selected && styles.labelSelected]}
              maxFontSizeMultiplier={FONT_SCALE.control}
              numberOfLines={1}
              adjustsFontSizeToFit
            >
              {option.label}
            </Text>
          </PressableScale>
        );
      })}
    </View>
  );
};

const useStyles = createThemedStyles((colors) => ({
  container: {
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.border,
    borderRadius: RADIUS.pill,
    borderWidth: 1,
    flexDirection: 'row',
    marginBottom: SPACING.md,
    padding: PADDING,
  },
  // Pílula da opção escolhida: superfície clara com sombra, como um botão "levantado"
  indicator: {
    backgroundColor: colors.surface,
    borderColor: colors.accent,
    borderRadius: RADIUS.pill,
    borderWidth: 1,
    bottom: PADDING,
    elevation: 2,
    left: PADDING,
    position: 'absolute',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    top: PADDING,
  },
  label: {
    color: colors.text.tertiary,
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.sm,
  },
  labelSelected: {
    color: colors.accentText,
    fontFamily: FONTS.semiBold,
  },
  segment: {
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: SPACING.xs,
    paddingVertical: SPACING.sm + 2,
  },
}));

export default SegmentedControl;
