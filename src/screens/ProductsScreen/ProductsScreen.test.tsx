import React, { PropsWithChildren } from 'react';
import 'react-native';

import { it } from '@jest/globals';
import {
  render,
  screen,
  userEvent,
  within,
} from '@testing-library/react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { ReactTestInstance } from 'react-test-renderer';
import { ProductProvider } from '../../contexts/ProductsContext';
import ProductScreens from './ProductsScreen';

const user = userEvent.setup();

jest.useFakeTimers();

const product1 = { id: 1, name: 'item 1', quantity: 2 };

const getProductListTestInstance = async (
  name: string,
): Promise<ReactTestInstance> => {
  const listTestInstance = (await screen.findByText(name)).parent?.parent;
  expect(listTestInstance).not.toBeNull();
  if (!listTestInstance) throw new Error('Product list element not found');
  return listTestInstance;
};

const getProductItemTestInstance = async (
  name: string,
  productList: ReactTestInstance,
): Promise<ReactTestInstance> => {
  const productItemTestInstance = (
    await within(productList).findByDisplayValue(name)
  ).parent?.parent;
  expect(productItemTestInstance).not.toBeNull();
  if (!productItemTestInstance)
    throw new Error('Product item element not found');
  return productItemTestInstance;
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

  const productsToBuyList = await getProductListTestInstance('Products to buy');
  await getProductItemTestInstance('', productsToBuyList);
});

it('updates the quantity of a product when pressing +', async () => {
  await AsyncStorage.setItem('productsToBuy', JSON.stringify([product1]));

  render(<ProductScreens />, { wrapper: Wrapper });

  const productsToBuyList = await getProductListTestInstance('Products to buy');

  const item1 = await getProductItemTestInstance('item 1', productsToBuyList);

  within(item1).getByText('x2');

  const addOneButton = within(item1).getByRole('button', {
    name: 'Add one item 1',
  });
  await user.press(addOneButton);

  within(item1).getByText('x3');
});

it("updates the quantity of a product when pressing + so that it's > 0 and moves it to Product to buy", async () => {
  await AsyncStorage.setItem(
    'productsToBuy',
    JSON.stringify([{ ...product1, quantity: 0 }]),
  );

  render(<ProductScreens />, { wrapper: Wrapper });

  const historyList = await getProductListTestInstance('History');
  const item1 = await getProductItemTestInstance(product1.name, historyList);

  within(item1).getByText('x0');

  const addOneButton = within(item1).getByRole('button', {
    name: 'Add one item 1',
  });
  await user.press(addOneButton);

  expect(within(historyList).queryByText(product1.name)).toBeNull();

  const productsToBuyList = await getProductListTestInstance('Products to buy');
  const item2 = await getProductItemTestInstance(
    product1.name,
    productsToBuyList,
  );

  within(item2).getByText('x1');
});

it('updates the quantity of a product when pressing -', async () => {
  await AsyncStorage.setItem('productsToBuy', JSON.stringify([product1]));

  render(<ProductScreens />, { wrapper: Wrapper });

  const productsToBuyList = await getProductListTestInstance('Products to buy');
  const item1 = await getProductItemTestInstance('item 1', productsToBuyList);

  const removeOneButton = within(item1).getByRole('button', {
    name: 'Remove one item 1',
  });
  await user.press(removeOneButton);
  await user.press(removeOneButton);

  expect(within(productsToBuyList).queryByText(product1.name)).toBeNull();

  const historyList = await getProductListTestInstance('History');
  const historyItem1 = await getProductItemTestInstance(
    product1.name,
    historyList,
  );

  within(historyItem1).getByText('x0');
});

it("updates the quantity of a product when pressing - so that it's < 0 and moves it to History", async () => {
  await AsyncStorage.setItem(
    'productsToBuy',
    JSON.stringify([{ ...product1, quantity: 1 }]),
  );

  render(<ProductScreens />, { wrapper: Wrapper });

  const productsToBuyList = await getProductListTestInstance('Products to buy');
  const item1 = await getProductItemTestInstance(
    product1.name,
    productsToBuyList,
  );

  within(item1).getByText('x1');

  const removeOneButton = within(item1).getByRole('button', {
    name: 'Remove one item 1',
  });
  await user.press(removeOneButton);

  expect(within(productsToBuyList).queryByText(product1.name)).toBeNull();

  const historyList = await getProductListTestInstance('History');
  const item2 = await getProductItemTestInstance(product1.name, historyList);

  within(item2).getByText('x0');
});

it('updates the name of a product', async () => {
  await AsyncStorage.setItem('productsToBuy', JSON.stringify([product1]));

  render(<ProductScreens />, { wrapper: Wrapper });

  const productsToBuyList = await getProductListTestInstance('Products to buy');
  const item1 = await getProductItemTestInstance('item 1', productsToBuyList);

  const nameInput = within(item1).getByDisplayValue('item 1');
  await user.clear(nameInput);
  await user.type(nameInput, 'new item 1');

  expect(within(item1).queryByText('item 1')).toBeNull();
  within(item1).queryByText('new item 1');
});

it('marks a product as bought when pressing the cart button', async () => {
  await AsyncStorage.setItem('productsToBuy', JSON.stringify([product1]));

  render(<ProductScreens />, { wrapper: Wrapper });

  const productsToBuyList = await getProductListTestInstance('Products to buy');

  const item1 = await getProductItemTestInstance(
    product1.name,
    productsToBuyList,
  );

  const addOneButton = within(item1).getByRole('button', {
    name: 'Add one item 1',
  });
  await user.press(addOneButton);

  const markAsBoughtButton = within(item1).getByRole('button', {
    name: 'Mark item 1 as bought',
  });
  await user.press(markAsBoughtButton);

  expect(within(productsToBuyList).queryByText(product1.name)).toBeNull();

  const historyList = await getProductListTestInstance('History');
  const historyItem1 = await getProductItemTestInstance(
    product1.name,
    historyList,
  );

  within(historyItem1).getByText('x0');
});

it('removes a product when pressing the trash button', async () => {
  await AsyncStorage.setItem('productsToBuy', JSON.stringify([product1]));

  render(<ProductScreens />, { wrapper: Wrapper });

  const productsToBuyList = await getProductListTestInstance('Products to buy');
  const item1 = await getProductItemTestInstance(
    product1.name,
    productsToBuyList,
  );

  const removeButton = within(item1).getByRole('button', {
    name: 'Remove product item 1',
  });
  await user.press(removeButton);

  expect(screen.queryByText(product1.name)).toBeNull();
});
