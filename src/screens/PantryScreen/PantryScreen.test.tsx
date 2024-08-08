import React from 'react';

import { render, screen } from '@testing-library/react-native';

import PantryScreen from './PantryScreen';

jest.useFakeTimers();

it('renders correctly', () => {
  render(<PantryScreen />);
  screen.getByText('Pantry Screen');
});
