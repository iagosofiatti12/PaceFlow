import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react-native';
import IntroAnimation from '../IntroAnimation';

describe('animação de abertura', () => {
  it('mostra o logo e um toque pula a abertura', () => {
    const onFinish = jest.fn();
    render(<IntroAnimation onFinish={onFinish} />);

    const logo = screen.getByLabelText('PaceFlow');
    expect(logo).toHaveProp('accessibilityHint', 'Toque para pular a abertura');

    fireEvent.press(logo);
    expect(onFinish).toHaveBeenCalledTimes(1);
  });
});
