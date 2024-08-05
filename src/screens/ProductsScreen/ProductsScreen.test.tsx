import React, { PropsWithChildren } from 'react';
import 'react-native';

import { it } from '@jest/globals';
import {
  render,
  screen,
  userEvent,
  waitFor,
  within,
} from '@testing-library/react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { ReactTestInstance } from 'react-test-renderer';
import { ProductProvider } from '../../contexts/ProductsContext';
import ProductScreens from './ProductsScreen';

const user = userEvent.setup();

jest.useFakeTimers();

const product1 = { id: 1, name: 'item 1', quantity: 2 };

const getTestInstance = async (
  name: string,
  parent?: ReactTestInstance,
): Promise<ReactTestInstance> => {
  let listTestInstance;
  await waitFor(() => {
    listTestInstance = parent
      ? within(parent).getByText(name).parent?.parent
      : screen.getByText(name).parent?.parent;
  });
  expect(listTestInstance).not.toBeNull();
  if (!listTestInstance) throw new Error('Element not found');
  return listTestInstance;
};

const Wrapper: React.FC<PropsWithChildren> = ({ children }) => (
  <ProductProvider>{children}</ProductProvider>
);

it('renders correctly', () => {
  render(<ProductScreens />, { wrapper: Wrapper });
  screen.getByText('Products to buy');
  screen.getByText('History');
  screen.getByRole('button', { name: 'Add a new product' });
});

it('adds a product when the add button is pressed', async () => {
  render(<ProductScreens />, { wrapper: Wrapper });
  const addButton = screen.getByRole('button', { name: 'Add a new product' });
  await user.press(addButton);

  const productsToBuyList = await getTestInstance('Products to buy');
  getTestInstance('item 1', productsToBuyList);

  await user.press(addButton);

  const item2 = await getTestInstance('item 2', productsToBuyList);
  within(item2).getByText('x1');
});

it('updates the quantity of a product when pressing +', async () => {
  await AsyncStorage.setItem('productItems', JSON.stringify([product1]));

  render(<ProductScreens />, { wrapper: Wrapper });

  const productsToBuyList = await getTestInstance('Products to buy');

  const item1 = await getTestInstance('item 1', productsToBuyList);

  within(item1).getByText('x2');

  const addOneButton = within(item1).getByRole('button', {
    name: 'Add one item 1',
  });
  await user.press(addOneButton);

  within(item1).getByText('x3');
});

it("updates the quantity of a product when pressing + so that it's > 0 and moves it to Product to buy", async () => {
  await AsyncStorage.setItem(
    'productItems',
    JSON.stringify([{ ...product1, quantity: 0 }]),
  );

  render(<ProductScreens />, { wrapper: Wrapper });

  const historyList = await getTestInstance('History');
  const item1 = await getTestInstance(product1.name, historyList);

  within(item1).getByText('x0');

  const addOneButton = within(item1).getByRole('button', {
    name: 'Add one item 1',
  });
  await user.press(addOneButton);

  expect(within(historyList).queryByText(product1.name)).toBeNull();

  const productsToBuyList = await getTestInstance('Products to buy');
  const item2 = await getTestInstance(product1.name, productsToBuyList);

  within(item2).getByText('x1');
});

it('updates the quantity of a product when pressing -', async () => {
  await AsyncStorage.setItem('productItems', JSON.stringify([product1]));

  render(<ProductScreens />, { wrapper: Wrapper });

  const productsToBuyList = await getTestInstance('Products to buy');
  const item1 = await getTestInstance('item 1', productsToBuyList);

  const removeOneButton = within(item1).getByRole('button', {
    name: 'Remove one item 1',
  });
  await user.press(removeOneButton);
  await user.press(removeOneButton);

  expect(within(productsToBuyList).queryByText(product1.name)).toBeNull();

  const historyList = await getTestInstance('History');
  const historyItem1 = await getTestInstance(product1.name, historyList);

  within(historyItem1).getByText('x0');
});

it("updates the quantity of a product when pressing - so that it's < 0 and moves it to History", async () => {
  await AsyncStorage.setItem(
    'productItems',
    JSON.stringify([{ ...product1, quantity: 1 }]),
  );

  render(<ProductScreens />, { wrapper: Wrapper });

  const productsToBuyList = await getTestInstance('Products to buy');
  const item1 = await getTestInstance(product1.name, productsToBuyList);

  within(item1).getByText('x1');

  const removeOneButton = within(item1).getByRole('button', {
    name: 'Remove one item 1',
  });
  await user.press(removeOneButton);

  expect(within(productsToBuyList).queryByText(product1.name)).toBeNull();

  const historyList = await getTestInstance('History');
  const item2 = await getTestInstance(product1.name, historyList);

  within(item2).getByText('x0');
});

it('marks a product as bought when pressing the cart button', async () => {
  await AsyncStorage.setItem('productItems', JSON.stringify([product1]));

  render(<ProductScreens />, { wrapper: Wrapper });

  const productsToBuyList = await getTestInstance('Products to buy');

  const item1 = await getTestInstance(product1.name, productsToBuyList);

  const addOneButton = within(item1).getByRole('button', {
    name: 'Add one item 1',
  });
  await user.press(addOneButton);

  const markAsBoughtButton = within(item1).getByRole('button', {
    name: 'Mark item 1 as bought',
  });
  await user.press(markAsBoughtButton);

  expect(within(productsToBuyList).queryByText(product1.name)).toBeNull();

  const historyList = await getTestInstance('History');
  const historyItem1 = await getTestInstance(product1.name, historyList);

  within(historyItem1).getByText('x0');
});

it('removes a product when pressing the trash button', async () => {
  await AsyncStorage.setItem('productItems', JSON.stringify([product1]));

  render(<ProductScreens />, { wrapper: Wrapper });

  const productsToBuyList = await getTestInstance('Products to buy');
  const item1 = await getTestInstance(product1.name, productsToBuyList);

  const removeButton = within(item1).getByRole('button', {
    name: 'Remove product item 1',
  });
  await user.press(removeButton);

  expect(screen.queryByText(product1.name)).toBeNull();
});
