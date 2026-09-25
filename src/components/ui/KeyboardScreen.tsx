import React from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from 'react-native';
import { SPACING } from '../../constants/theme';

interface KeyboardScreenProps {
  children: React.ReactNode;
}

/**
 * Tela com formulário: rola e sobe o conteúdo quando o teclado abre,
 * para o campo digitado não ficar escondido atrás dele.
 * (Antes, isso ficava dentro do App.tsx.)
 */
const KeyboardScreen: React.FC<KeyboardScreenProps> = ({ children }) => (
  <KeyboardAvoidingView
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    style={styles.container}
    keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
  >
    <ScrollView
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      bounces={false}
    >
      {children}
    </ScrollView>
  </KeyboardAvoidingView>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    padding: SPACING.lg,
    paddingBottom: SPACING.xl,
  },
});

export default KeyboardScreen;
