import React from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import Animated, { FadeIn, SlideInDown } from 'react-native-reanimated';
import { FONT_SIZES, FONTS, MOTION, RADIUS, SPACING } from '../../constants/theme';
import { createThemedStyles } from '../../hooks/useTheme';

interface SheetProps {
  visible: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

// O painel sobe de baixo com uma mola, e o fundo escurece com um fade
const enterSheet = SlideInDown.springify()
  .damping(MOTION.spring.gentle.damping)
  .stiffness(MOTION.spring.gentle.stiffness);
const enterBackdrop = FadeIn.duration(MOTION.duration.base);

/**
 * Painel que sobe de baixo (bottom sheet), com véu escuro atrás. Tocar fora ou
 * no "voltar" do Android fecha. Sobe junto com o teclado quando tem campo dentro.
 */
const Sheet: React.FC<SheetProps> = ({ visible, title, onClose, children }) => {
  const styles = useStyles();

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <Animated.View style={styles.backdrop} entering={enterBackdrop}>
          <Pressable
            style={styles.flex}
            onPress={onClose}
            accessibilityRole="button"
            accessibilityLabel={`Fechar ${title.toLowerCase()}`}
          />
          <Animated.View style={styles.sheet} entering={enterSheet}>
            <View style={styles.handle} />
            <Text style={styles.title} accessibilityRole="header">
              {title}
            </Text>
            <ScrollView
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              bounces={false}
            >
              {children}
            </ScrollView>
          </Animated.View>
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const useStyles = createThemedStyles((colors) => ({
  backdrop: {
    backgroundColor: colors.scrim,
    flex: 1,
    justifyContent: 'flex-end',
  },
  flex: {
    flex: 1,
  },
  handle: {
    alignSelf: 'center',
    backgroundColor: colors.borderStrong,
    borderRadius: RADIUS.pill,
    height: 4,
    marginBottom: SPACING.md,
    width: 40,
  },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: RADIUS.xxl,
    borderTopRightRadius: RADIUS.xxl,
    maxHeight: '90%',
    padding: SPACING.lg,
    paddingBottom: SPACING.xl,
  },
  title: {
    color: colors.text.primary,
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZES.xl,
    marginBottom: SPACING.md,
  },
}));

export default Sheet;
