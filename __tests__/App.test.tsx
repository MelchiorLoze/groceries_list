import React from 'react';
import 'react-native';

import {
  render,
  screen,
  userEvent,
  within,
} from '@testing-library/react-native';

import App from '../App';

const user = userEvent.setup();

jest.useFakeTimers();

it('renders correctly', () => {
  render(<App />);
});

it('renders the tab navigation bar correctly', () => {
  render(<App />);
  within(screen.getByTestId('tab-bar-products')).getByText('Products');
  within(screen.getByTestId('tab-bar-pantry')).getByText('Pantry');
});

it('renders the Products screen by default', () => {
  render(<App />);
  screen.getByText('Products to buy');
  expect(screen.queryByText('Pantry Screen')).toBeNull();
});

it('renders the Pantry screen when the Pantry tab is pressed', async () => {
  render(<App />);
  const pantryTab = screen.getByTestId('tab-bar-pantry');
  await user.press(pantryTab);
  screen.getByText('Pantry Screen');
  expect(screen.queryByText('Products to buy')).toBeNull();
});
