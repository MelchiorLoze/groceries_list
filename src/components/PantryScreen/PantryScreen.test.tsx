import 'react-native';
import React from 'react';

import { it } from '@jest/globals';
import { render, screen } from '@testing-library/react-native';

import PantryScreen from './PantryScreen';

it('renders correctly', () => {
  render(<PantryScreen />);
  screen.getByText('Pantry Screen');
});
