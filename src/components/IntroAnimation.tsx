import React, { useEffect, useRef } from 'react';
import { Image, Pressable, StyleSheet, useWindowDimensions } from 'react-native';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { INTRO } from '../constants/theme';
import { createThemedStyles } from '../hooks/useTheme';

// O mesmo logo e o mesmo tamanho da splash (app.json, imageWidth 200): quando a
// splash some, a animação começa exatamente onde ela estava, sem "pulo"
const LOGO = require('../../assets/logo.png');
const SPLASH_LOGO_SIZE = 200;

interface IntroAnimationProps {
  /** Chamado quando a animação termina (ou é pulada com um toque) */
  onFinish: () => void;
}

/**
 * Abertura do app: o logo cresce, pulsa como um coração e sai correndo para a
 * direita, inclinado para a frente, enquanto o fundo some e revela o app.
 * Tocar na tela pula a animação. Com "reduzir movimento" ligado no celular, o
 * Reanimated pula cada etapa direto para o fim, e a abertura some na hora.
 */
const IntroAnimation: React.FC<IntroAnimationProps> = ({ onFinish }) => {
  const styles = useStyles();
  const { width } = useWindowDimensions();
  // A animação roda uma vez só: guardamos o callback e a largura num ref para
  // que um novo render (ex: girar o celular) não a reinicie do zero
  const onFinishRef = useRef(onFinish);
  onFinishRef.current = onFinish;
  const widthRef = useRef(width);

  const scale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const tilt = useSharedValue(0);
  const opacity = useSharedValue(1);

  useEffect(() => {
    const callFinish = (): void => onFinishRef.current();
    const finish = (finished?: boolean): void => {
      'worklet';
      if (finished) runOnJS(callFinish)();
    };
    const screenWidth = widthRef.current;

    const { pulse, pulses, runStart, windUp, sprint, fadeOut } = INTRO;
    const pulseDuration = pulse / 2;

    // 1. Cresce (de onde a splash estava) e pulsa como batida de coração
    scale.value = withSequence(
      withSpring(INTRO.bigScale, { damping: 12, stiffness: 140 }),
      withRepeat(
        withSequence(
          withTiming(INTRO.bigScale * 1.08, {
            duration: pulseDuration,
            easing: Easing.out(Easing.quad),
          }),
          withTiming(INTRO.bigScale, { duration: pulseDuration, easing: Easing.in(Easing.quad) }),
        ),
        pulses,
      ),
    );

    // 2. Largada: recua um pouco (como quem pega impulso) e dispara para a direita
    translateX.value = withDelay(
      runStart,
      withSequence(
        withTiming(-screenWidth * 0.06, { duration: windUp, easing: Easing.out(Easing.quad) }),
        withTiming(screenWidth * 1.3, { duration: sprint, easing: Easing.in(Easing.cubic) }),
      ),
    );
    // Inclina para a frente, como um corredor acelerando
    tilt.value = withDelay(runStart, withTiming(10, { duration: windUp + sprint / 2 }));

    // 3. O fundo some no fim da corrida e revela o app
    opacity.value = withDelay(
      runStart + windUp + sprint * 0.5,
      withTiming(0, { duration: fadeOut }, finish),
    );
  }, [opacity, scale, tilt, translateX]);

  const overlayStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));
  const logoStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { scale: scale.value },
      { rotate: `${tilt.value}deg` },
    ],
  }));

  return (
    <Animated.View style={[styles.overlay, overlayStyle]}>
      <Pressable
        style={styles.touch}
        onPress={() => onFinishRef.current()}
        accessibilityRole="button"
        accessibilityLabel="PaceFlow"
        accessibilityHint="Toque para pular a abertura"
      >
        <Animated.View style={logoStyle}>
          <Image source={LOGO} style={styles.logo} resizeMode="contain" />
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
};

const useStyles = createThemedStyles((colors) => ({
  logo: {
    height: SPLASH_LOGO_SIZE,
    width: SPLASH_LOGO_SIZE,
  },
  // Cobre a tela inteira, por cima do app, com o mesmo fundo da splash
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.background,
    zIndex: 10,
  },
  touch: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
}));

export default IntroAnimation;
