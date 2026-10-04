import React from 'react';
import YouTab from '../src/components/YouTab';
import KeyboardScreen from '../src/components/ui/KeyboardScreen';

/** Tela "Você" (perfil, recordes, meta e diário). Rota "/you", aberta pelo botão do cabeçalho. */
export default function YouScreen(): React.ReactElement {
  return (
    <KeyboardScreen>
      <YouTab />
    </KeyboardScreen>
  );
}
