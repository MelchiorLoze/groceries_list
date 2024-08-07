import AsyncStorage from '@react-native-async-storage/async-storage';
import { act, renderHook, waitFor } from '@testing-library/react-native';
import { Product } from '../../types/Product';
import { ProductProvider, useProductContext } from './ProductsContext';

const item1: Product = { id: '1', name: 'item 1', quantity: 1 };
const item2: Product = { id: '2', name: 'item 2', quantity: 0 };

jest.mock('react-native-uuid', () => ({
  v4: () => '3',
}));

beforeEach(async () => {
  await AsyncStorage.setItem('productsToBuy', JSON.stringify([item1]));
  await AsyncStorage.setItem('productsHistory', JSON.stringify([item2]));
});

it('fetches and sets initial product items from AsyncStorage', async () => {
  const { result } = renderHook(useProductContext, {
    wrapper: ProductProvider,
  });

  await waitFor(() => expect(result.current.productsToBuy).toEqual([item1]));
  expect(result.current.productsHistory).toEqual([item2]);
});

it('adds a product', async () => {
  const { result } = renderHook(() => useProductContext(), {
    wrapper: ProductProvider,
  });

  await waitFor(() => expect(result.current.productsToBuy).toEqual([item1]));

  act(() => result.current.addProduct());

  await waitFor(() =>
    expect(result.current.productsToBuy).toEqual([
      item1,
      { id: '3', name: '', quantity: 1 },
    ]),
  );
});

it('updates a product', async () => {
  const { result } = renderHook(() => useProductContext(), {
    wrapper: ProductProvider,
  });

  await waitFor(() => expect(result.current.productsToBuy).toEqual([item1]));

  act(() => result.current.updateProduct({ ...item1, quantity: 0 }));

  await waitFor(() => expect(result.current.productsToBuy).toEqual([]));
  expect(result.current.productsHistory).toEqual([
    { ...item1, quantity: 0 },
    item2,
  ]);

  act(() => result.current.updateProduct({ ...item1, quantity: 1 }));

  await waitFor(() => expect(result.current.productsToBuy).toEqual([item1]));
  expect(result.current.productsHistory).toEqual([item2]);

  act(() =>
    result.current.updateProduct({ ...item1, name: 'new name', quantity: 2 }),
  );

  await waitFor(() =>
    expect(result.current.productsToBuy).toEqual([
      { ...item1, name: 'new name', quantity: 2 },
    ]),
  );
  expect(result.current.productsHistory).toEqual([item2]);
});

it('removes a product', async () => {
  const { result } = renderHook(() => useProductContext(), {
    wrapper: ProductProvider,
  });

  await waitFor(() => expect(result.current.productsToBuy).toEqual([item1]));
  expect(result.current.productsHistory).toEqual([item2]);

  act(() => result.current.removeProduct(item1.id));

  await waitFor(() => expect(result.current.productsToBuy).toEqual([]));

  act(() => result.current.removeProduct(item2.id));

  await waitFor(() => expect(result.current.productsHistory).toEqual([]));
});
