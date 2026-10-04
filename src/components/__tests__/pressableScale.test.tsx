import React from 'react';
import { Text } from 'react-native';
import { render, screen, fireEvent } from '@testing-library/react-native';
import PressableScale from '../ui/PressableScale';

it('PressableScale chama onPress', () => {
  const onPress = jest.fn();
  render(
    <PressableScale onPress={onPress} accessibilityRole="button" accessibilityLabel="ok">
      <Text>ok</Text>
    </PressableScale>,
  );
  fireEvent.press(screen.getByLabelText('ok'));
  expect(onPress).toHaveBeenCalled();
});
