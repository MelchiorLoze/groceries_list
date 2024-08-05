import AsyncStorage from '@react-native-async-storage/async-storage';
import { act, renderHook, waitFor } from '@testing-library/react-native';
import { ProductProvider, useProductContext } from './ProductsContext';

beforeEach(async () => {
  await AsyncStorage.setItem(
    'productItems',
    JSON.stringify([{ name: 'item 1', quantity: 1 }]),
  );
});

it('fetches and sets initial product items from AsyncStorage', async () => {
  const { result } = renderHook(useProductContext, {
    wrapper: ProductProvider,
  });

  await waitFor(() =>
    expect(result.current.productItems).toEqual([
      { name: 'item 1', quantity: 1 },
    ]),
  );
});

it('adds a product', async () => {
  const { result } = renderHook(() => useProductContext(), {
    wrapper: ProductProvider,
  });

  await waitFor(() =>
    expect(result.current.productItems).toEqual([
      { name: 'item 1', quantity: 1 },
    ]),
  );

  act(() => result.current.addProduct());

  await waitFor(() =>
    expect(result.current.productItems).toEqual([
      { name: 'item 1', quantity: 1 },
      { name: 'item 2', quantity: 1 },
    ]),
  );
});

it('updates a product', async () => {
  const { result } = renderHook(() => useProductContext(), {
    wrapper: ProductProvider,
  });

  await waitFor(() =>
    expect(result.current.productItems).toEqual([
      { name: 'item 1', quantity: 1 },
    ]),
  );

  act(() => result.current.updateProduct(0, 2));

  await waitFor(() =>
    expect(result.current.productItems).toEqual([
      { name: 'item 1', quantity: 2 },
    ]),
  );
});

it('removes a product', async () => {
  const { result } = renderHook(() => useProductContext(), {
    wrapper: ProductProvider,
  });

  await waitFor(() =>
    expect(result.current.productItems).toEqual([
      { name: 'item 1', quantity: 1 },
    ]),
  );

  act(() => result.current.removeProduct(0));

  await waitFor(() => expect(result.current.productItems).toEqual([]));
});