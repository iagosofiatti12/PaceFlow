import React from 'react';
import { Pressable, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { MOTION } from '../../constants/theme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface PressableScaleProps extends Omit<PressableProps, 'style'> {
  style?: StyleProp<ViewStyle>;
  /** Quanto encolhe ao tocar (1 = não encolhe). Padrão: MOTION.pressScale */
  scaleTo?: number;
}

/**
 * Pressable que "afunda" um pouquinho enquanto o dedo está em cima e volta com
 * uma mola ao soltar. É o retorno de toque dos apps atuais, no lugar do
 * "fica transparente" antigo. A animação roda na thread de UI (Reanimated),
 * então não engasga mesmo com o JavaScript ocupado.
 */
const PressableScale: React.FC<PressableScaleProps> = ({
  style,
  scaleTo = MOTION.pressScale,
  onPressIn,
  onPressOut,
  disabled,
  children,
  ...rest
}) => {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <AnimatedPressable
      {...rest}
      disabled={disabled}
      onPressIn={(event) => {
        scale.value = withSpring(scaleTo, MOTION.spring.snappy);
        onPressIn?.(event);
      }}
      onPressOut={(event) => {
        scale.value = withSpring(1, MOTION.spring.snappy);
        onPressOut?.(event);
      }}
      style={[style, animatedStyle]}
    >
      {children}
    </AnimatedPressable>
  );
};

export default PressableScale;
