import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import TreadmillCalculator from '../TreadmillCalculator';

const typeSpeed = (text: string): void =>
  fireEvent.changeText(screen.getByLabelText('Campo de velocidade da esteira em km/h'), text);

describe('aba Esteira', () => {
  it('começa no modo "sei a velocidade"', () => {
    render(<TreadmillCalculator />);
    expect(screen.getByLabelText('Converter velocidade da esteira em pace')).toBeChecked();
    expect(screen.getByLabelText('Campo de velocidade da esteira em km/h')).toBeTruthy();
  });

  it('velocidade → pace ao vivo, aceitando vírgula', () => {
    render(<TreadmillCalculator />);
    typeSpeed('10');
    expect(screen.getByText('6:00')).toBeTruthy();
    typeSpeed('12,5');
    expect(screen.getByText('4:48')).toBeTruthy();
  });

  it('pace → velocidade no outro modo', () => {
    render(<TreadmillCalculator />);
    fireEvent.press(screen.getByLabelText('Converter pace em velocidade'));
    fireEvent.changeText(screen.getByLabelText('Campo de pace para a esteira'), '5:30');
    expect(screen.getByText('Regule a esteira em')).toBeTruthy();
    expect(screen.getByText('10,9')).toBeTruthy();
  });

  it('destaca na tabela a velocidade atual', () => {
    render(<TreadmillCalculator />);
    const row = (): ReturnType<typeof screen.getByLabelText> =>
      screen.getByLabelText('12,0 quilômetros por hora: pace 5:00 por km');
    expect(row()).not.toBeSelected();
    typeSpeed('12');
    expect(row()).toBeSelected();
  });

  it('tabela de consulta de 8 a 16 km/h', () => {
    render(<TreadmillCalculator />);
    expect(screen.getByLabelText('8,0 quilômetros por hora: pace 7:30 por km')).toBeTruthy();
    expect(screen.getByLabelText('16,0 quilômetros por hora: pace 3:45 por km')).toBeTruthy();
  });

  it('velocidade acima de 30 km/h: erro na hora', () => {
    render(<TreadmillCalculator />);
    typeSpeed('35');
    expect(screen.getByText('A velocidade máxima é 30 km/h')).toBeTruthy();
    expect(screen.queryByText('Seu pace')).toBeNull();
  });

  it('velocidade abaixo de 3 km/h: erro só depois de sair do campo ("1" pode virar "12")', () => {
    render(<TreadmillCalculator />);
    typeSpeed('1');
    expect(screen.queryByText('A velocidade mínima é 3 km/h')).toBeNull();
    fireEvent(screen.getByLabelText('Campo de velocidade da esteira em km/h'), 'blur');
    expect(screen.getByText('A velocidade mínima é 3 km/h')).toBeTruthy();
  });

  it('limpar apaga o campo e o resultado', () => {
    render(<TreadmillCalculator />);
    typeSpeed('10');
    fireEvent.press(screen.getByLabelText('Limpar campos'));
    expect(screen.queryByText('Seu pace')).toBeNull();
  });
});
