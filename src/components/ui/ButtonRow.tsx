import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SPACING } from '../../constants/theme';

interface ButtonRowProps {
  children: React.ReactNode;
}

/** Linha horizontal que distribui os botões lado a lado com espaçamento padrão. */
const ButtonRow: React.FC<ButtonRowProps> = ({ children }) => (
  <View style={styles.buttonGroup}>{children}</View>
);

const styles = StyleSheet.create({
  buttonGroup: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginTop: SPACING.sm,
  },
});

export default ButtonRow;
