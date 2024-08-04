import React from 'react';
import 'react-native';

import { it } from '@jest/globals';
import {
  render,
  screen,
  userEvent,
  within,
} from '@testing-library/react-native';

import ProductScreens from './ProductsScreen';

const user = userEvent.setup();

it('renders correctly', () => {
  render(<ProductScreens />);
  screen.getByText('Products to buy');
  screen.getByText('History');
  screen.getByRole('button', { name: 'Add a new product' });
});

it('adds a product when the add button is pressed', async () => {
  render(<ProductScreens />);
  const addButton = screen.getByRole('button', { name: 'Add a new product' });
  await user.press(addButton);

  const productsToBuyList = screen.getByText('Products to buy').parent?.parent;
  expect(productsToBuyList).not.toBeNull();
  if (!productsToBuyList) return;

  const item2 = within(productsToBuyList).getByText('item 2').parent?.parent;
  expect(item2).not.toBeNull();
  if (!item2) return;

  within(item2).getByText('x1');
});

it('updates the quantity of a product when pressing +', async () => {
  render(<ProductScreens />);

  const productsToBuyList = screen.getByText('Products to buy').parent?.parent;
  expect(productsToBuyList).not.toBeNull();
  if (!productsToBuyList) return;

  const item1 = within(productsToBuyList).getByText('item 1').parent?.parent;
  expect(item1).not.toBeNull();
  if (!item1) return;

  const addOneButton = within(item1).getByRole('button', {
    name: 'Add one item 1',
  });
  await user.press(addOneButton);

  within(item1).getByText('x2');
});

it('updates the quantity of a product when pressing -', async () => {
  render(<ProductScreens />);

  const productsToBuyList = screen.getByText('Products to buy').parent?.parent;
  expect(productsToBuyList).not.toBeNull();
  if (!productsToBuyList) return;

  const item1 = screen.getByText('item 1').parent?.parent;
  expect(item1).not.toBeNull();
  if (!item1) return;

  const addOneButton = within(item1).getByRole('button', {
    name: 'Add one item 1',
  });
  await user.press(addOneButton);

  const removeOneButton = within(item1).getByRole('button', {
    name: 'Remove one item 1',
  });
  await user.press(removeOneButton);
  await user.press(removeOneButton);

  expect(within(productsToBuyList).queryByText('item 1')).toBeNull();

  const historyList = screen.getByText('History').parent?.parent;
  expect(historyList).not.toBeNull();
  if (!historyList) return;

  const historyItem1 = within(historyList).getByText('item 1').parent?.parent;
  expect(historyItem1).not.toBeNull();
  if (!historyItem1) return;

  within(historyItem1).getByText('x0');
});

it('marks a product as bought when pressing the cart button', async () => {
  render(<ProductScreens />);

  const productsToBuyList = screen.getByText('Products to buy').parent?.parent;
  expect(productsToBuyList).not.toBeNull();
  if (!productsToBuyList) return;

  const item1 = screen.getByText('item 1').parent?.parent;
  expect(item1).not.toBeNull();
  if (!item1) return;

  const addOneButton = within(item1).getByRole('button', {
    name: 'Add one item 1',
  });
  await user.press(addOneButton);

  const markAsBoughtButton = within(item1).getByRole('button', {
    name: 'Mark item 1 as bought',
  });
  await user.press(markAsBoughtButton);

  expect(within(productsToBuyList).queryByText('item 1')).toBeNull();

  const historyList = screen.getByText('History').parent?.parent;
  expect(historyList).not.toBeNull();
  if (!historyList) return;

  const historyItem1 = within(historyList).getByText('item 1').parent?.parent;
  expect(historyItem1).not.toBeNull();
  if (!historyItem1) return;

  within(historyItem1).getByText('x0');
});

it('removes a product when pressing the trash button', async () => {
  render(<ProductScreens />);

  const productsToBuyList = screen.getByText('Products to buy').parent?.parent;
  expect(productsToBuyList).not.toBeNull();
  if (!productsToBuyList) return;

  const item1 = screen.getByText('item 1').parent?.parent;
  expect(item1).not.toBeNull();
  if (!item1) return;

  const removeButton = within(item1).getByRole('button', {
    name: 'Remove product item 1',
  });
  await user.press(removeButton);

  expect(screen.queryByText('item 1')).toBeNull();
});
