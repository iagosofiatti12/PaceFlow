import React from 'react';
import { render, screen } from '@testing-library/react-native';
import ResultCard from '../ui/ResultCard';
import Button from '../ui/Button';
import InputField from '../ui/InputField';
import { FONT_SCALE } from '../../constants/theme';

// Com a fonte do celular ampliada (acessibilidade), elementos de largura fixa
// precisam de teto para não estourar a tela. Estes testes garantem que o teto
// continua aplicado se alguém mexer nos componentes.

describe('teto de ampliação da fonte', () => {
  it('número do resultado: teto de display e encolhe para caber numa linha', () => {
    render(<ResultCard label="Tempo estimado" value="12:34:56" unit="/km" />);
    const value = screen.getByText('12:34:56');
    expect(value.props.maxFontSizeMultiplier).toBe(FONT_SCALE.display);
    expect(value.props.numberOfLines).toBe(1);
    expect(value.props.adjustsFontSizeToFit).toBe(true);
    expect(screen.getByText('/km').props.maxFontSizeMultiplier).toBe(FONT_SCALE.display);
  });

  it('texto de apoio do resultado cresce livremente', () => {
    render(<ResultCard label="Tempo estimado" value="27:30" subtext="minutos" />);
    expect(screen.getByText('minutos').props.maxFontSizeMultiplier).toBeUndefined();
  });

  it('texto do botão: teto de controle', () => {
    render(<Button title="Calcular" onPress={() => {}} />);
    expect(screen.getByText('Calcular').props.maxFontSizeMultiplier).toBe(FONT_SCALE.control);
  });

  it('campo de texto e unidade: teto de controle', () => {
    render(
      <InputField
        label="Distância"
        value=""
        onChangeText={() => {}}
        unit="km"
        accessibilityLabel="Campo de distância"
      />,
    );
    expect(screen.getByLabelText('Campo de distância').props.maxFontSizeMultiplier).toBe(
      FONT_SCALE.control,
    );
    expect(screen.getByText('km').props.maxFontSizeMultiplier).toBe(FONT_SCALE.control);
  });
});
