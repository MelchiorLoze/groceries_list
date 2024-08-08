import React, { PropsWithChildren } from 'react';
import 'react-native';

import { it } from '@jest/globals';
import {
  act,
  render,
  screen,
  userEvent,
  within,
} from '@testing-library/react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { ReactTestInstance } from 'react-test-renderer';
import { ProductProvider } from '../../contexts/ProductsContext';
import { Product } from '../../types/Product';
import ProductScreens from './ProductsScreen';

const user = userEvent.setup();

jest.useFakeTimers();

const product1: Product = { id: '1', name: 'item 1', quantity: 2 };

const getProductListTestInstance = async (
  id: string,
): Promise<ReactTestInstance> => await screen.findByTestId(id);

const getProductItemTestInstance = async (
  id: string,
  productList: ReactTestInstance,
): Promise<ReactTestInstance> => await within(productList).findByTestId(id);

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

  const productsToBuyList = await getProductListTestInstance(
    'products-to-buy-list',
  );
  const historyList = await getProductListTestInstance('history-list');

  expect(within(productsToBuyList).queryByDisplayValue('')).toBeNull();
  expect(within(historyList).queryByDisplayValue('')).toBeNull();

  const addButton = screen.getByRole('button', { name: 'Add a new product' });
  await user.press(addButton);

  await within(productsToBuyList).findByDisplayValue('');
  expect(within(historyList).queryByDisplayValue('')).toBeNull();
});

it('updates the quantity of a product when pressing +', async () => {
  await AsyncStorage.setItem('productsToBuy', JSON.stringify([product1]));

  render(<ProductScreens />, { wrapper: Wrapper });

  const productsToBuyList = await getProductListTestInstance(
    'products-to-buy-list',
  );

  const productToBuyItem = await getProductItemTestInstance(
    product1.id,
    productsToBuyList,
  );
  within(productToBuyItem).getByText('x2');

  const addOneButton = within(productToBuyItem).getByRole('button', {
    name: 'Add one item 1',
  });
  await user.press(addOneButton);

  within(productToBuyItem).getByText('x3');
});

it("updates the quantity of a product when pressing + so that it's > 0 and moves it to Product to buy", async () => {
  await AsyncStorage.setItem(
    'productsHistory',
    JSON.stringify([{ ...product1, quantity: 0 }]),
  );

  render(<ProductScreens />, { wrapper: Wrapper });

  const historyList = await getProductListTestInstance('history-list');
  const historyProduct = await getProductItemTestInstance(
    product1.id,
    historyList,
  );

  within(historyProduct).getByText('x0');

  const addOneButton = within(historyProduct).getByRole('button', {
    name: 'Add one item 1',
  });
  await user.press(addOneButton);

  expect(within(historyList).queryByDisplayValue(product1.name)).toBeNull();

  const productsToBuyList = await getProductListTestInstance(
    'products-to-buy-list',
  );
  const productToBuyItem = await getProductItemTestInstance(
    product1.id,
    productsToBuyList,
  );

  within(productToBuyItem).getByText('x1');
});

it('updates the quantity of a product when pressing -', async () => {
  await AsyncStorage.setItem('productsToBuy', JSON.stringify([product1]));

  render(<ProductScreens />, { wrapper: Wrapper });

  const productsToBuyList = await getProductListTestInstance(
    'products-to-buy-list',
  );
  const productToBuyItem = await getProductItemTestInstance(
    product1.id,
    productsToBuyList,
  );

  within(productToBuyItem).getByText('x2');

  const removeOneButton = within(productToBuyItem).getByRole('button', {
    name: 'Remove one item 1',
  });
  await user.press(removeOneButton);

  within(productToBuyItem).getByText('x1');
});

it("updates the quantity of a product when pressing - so that it's < 0 and moves it to History", async () => {
  await AsyncStorage.setItem(
    'productsToBuy',
    JSON.stringify([{ ...product1, quantity: 1 }]),
  );

  render(<ProductScreens />, { wrapper: Wrapper });

  const productsToBuyList = await getProductListTestInstance(
    'products-to-buy-list',
  );
  const productToBuyItem = await getProductItemTestInstance(
    product1.id,
    productsToBuyList,
  );

  within(productToBuyItem).getByText('x1');

  const removeOneButton = within(productToBuyItem).getByRole('button', {
    name: 'Remove one item 1',
  });
  await user.press(removeOneButton);

  expect(
    within(productsToBuyList).queryByDisplayValue(product1.name),
  ).toBeNull();

  const historyList = await getProductListTestInstance('history-list');
  const historyItem = await getProductItemTestInstance(
    product1.id,
    historyList,
  );

  within(historyItem).getByText('x0');
});

it('updates the name of a product', async () => {
  await AsyncStorage.setItem('productsToBuy', JSON.stringify([product1]));

  render(<ProductScreens />, { wrapper: Wrapper });

  const productsToBuyList = await getProductListTestInstance(
    'products-to-buy-list',
  );
  const productToBuyItem = await getProductItemTestInstance(
    product1.id,
    productsToBuyList,
  );

  const nameInput = within(productToBuyItem).getByDisplayValue(product1.name);
  await user.clear(nameInput);
  await user.type(nameInput, 'new item 1');

  expect(
    within(productToBuyItem).queryByDisplayValue(product1.name),
  ).toBeNull();
  within(productToBuyItem).queryByDisplayValue('new item 1');
});

it('marks a product as bought when pressing the cart button', async () => {
  await AsyncStorage.setItem('productsToBuy', JSON.stringify([product1]));

  render(<ProductScreens />, { wrapper: Wrapper });

  const productsToBuyList = await getProductListTestInstance(
    'products-to-buy-list',
  );
  await getProductItemTestInstance(product1.id, productsToBuyList);

  const markAsBoughtButton = within(productsToBuyList).getByRole('button', {
    name: `Mark ${product1.name} as bought`,
  });
  act(markAsBoughtButton.props.onClick); // Simulate press on underlay

  expect(
    within(productsToBuyList).queryByDisplayValue(product1.name),
  ).toBeNull();

  const historyList = await getProductListTestInstance('history-list');
  const historyItem = await getProductItemTestInstance(
    product1.id,
    historyList,
  );

  within(historyItem).getByText('x0');
});

it('removes a product when pressing the item trash button', async () => {
  await AsyncStorage.setItem('productsToBuy', JSON.stringify([product1]));

  render(<ProductScreens />, { wrapper: Wrapper });

  const productsToBuyList = await getProductListTestInstance(
    'products-to-buy-list',
  );
  await getProductItemTestInstance(product1.id, productsToBuyList);

  const removeButton = within(productsToBuyList).getByRole('button', {
    name: `Remove product ${product1.name}`,
  });
  act(removeButton.props.onClick); // Simulate press on underlay

  expect(screen.queryByDisplayValue(product1.name)).toBeNull();
});

it('removes all products when pressing the list trash button', async () => {
  const product2: Product = { id: '2', name: 'item 2', quantity: 1 };
  await AsyncStorage.setItem(
    'productsToBuy',
    JSON.stringify([product1, product2]),
  );

  render(<ProductScreens />, { wrapper: Wrapper });

  const productsToBuyList = await getProductListTestInstance(
    'products-to-buy-list',
  );
  await getProductItemTestInstance(product1.id, productsToBuyList);

  const removeAllButton = screen.getByRole('button', {
    name: 'Remove all products to buy',
  });
  await user.press(removeAllButton);

  expect(screen.queryByDisplayValue(product1.name)).toBeNull();
  expect(screen.queryByDisplayValue(product2.name)).toBeNull();
});
