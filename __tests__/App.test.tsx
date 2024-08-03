import 'react-native';
import React from 'react';

import { it } from '@jest/globals';
import {
  render,
  screen,
  userEvent,
  within,
} from '@testing-library/react-native';

import App from '../App';

const user = userEvent.setup();

it('renders correctly', () => {
  render(<App />);
});

it('renders the tab navigation bar correctly', () => {
  render(<App />);
  within(screen.getByTestId('tab-bar-list')).getByText('List');
  within(screen.getByTestId('tab-bar-pantry')).getByText('Pantry');
});

it('renders the List screen by default', () => {
  render(<App />);
  screen.getByText('List Screen');
  expect(screen.queryByText('Pantry Screen')).toBeNull();
});

it('renders the Pantry screen when the Pantry tab is pressed', async () => {
  render(<App />);
  const pantryTab = screen.getByTestId('tab-bar-pantry');
  await user.press(pantryTab);
  screen.getByText('Pantry Screen');
  expect(screen.queryByText('List Screen')).toBeNull();
});
