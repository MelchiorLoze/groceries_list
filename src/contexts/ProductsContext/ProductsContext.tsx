import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { SwipeableItemImperativeRef } from 'react-native-swipeable-item';
import uuid from 'react-native-uuid';

import { Product } from '../../types/Product';

interface ProductContextProps {
  productsToBuy: Product[];
  setProductsToBuy: (items: Product[]) => void;
  productsHistory: Product[];
  setProductsHistory: (items: Product[]) => void;
  addProduct: () => void;
  updateProduct: (product: Product) => void;
  removeProduct: (id: Product['id']) => void;
  focusedItemId: Product['id'] | null;
  unsetFocusedItemId: () => void;
  itemRefs: React.MutableRefObject<
    Map<Product['id'], SwipeableItemImperativeRef>
  >;
}

const ProductContext = createContext<ProductContextProps | undefined>(
  undefined,
);

export const ProductProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [productsToBuy, setProductsToBuy] = useState<Product[]>([]);
  const [productsHistory, setProductsHistory] = useState<Product[]>([]);
  const [focusedItemId, setFocusedItemId] = useState<string | null>(null);
  const itemRefs = useRef(new Map());

  useEffect(() => {
    AsyncStorage.getItem('productsToBuy', (error, result) => {
      if (!error && result?.length) setProductsToBuy(JSON.parse(result));
    });
    AsyncStorage.getItem('productsHistory', (error, result) => {
      if (!error && result?.length) setProductsHistory(JSON.parse(result));
    });
  }, []);

  useEffect(() => {
    AsyncStorage.setItem('productsToBuy', JSON.stringify(productsToBuy));
  }, [productsToBuy]);

  useEffect(() => {
    AsyncStorage.setItem('productsHistory', JSON.stringify(productsHistory));
  }, [productsHistory]);

  const addProduct = () => {
    if (productsToBuy.length < 100) {
      const newProductId = uuid.v4() as string;
      setProductsToBuy([
        ...productsToBuy,
        {
          id: newProductId,
          name: '',
          quantity: 1,
        },
      ]);
      setFocusedItemId(newProductId);
    }
  };

  const updateProduct = (product: Product) => {
    const productToBuyToUpdateIndex = productsToBuy.findIndex(
      (item) => item.id === product.id,
    );
    if (productToBuyToUpdateIndex !== -1) {
      const newProductsToBuy = [...productsToBuy];
      if (product.quantity === 0) {
        newProductsToBuy.splice(productToBuyToUpdateIndex, 1);
        setProductsHistory([product, ...productsHistory]);
      } else {
        newProductsToBuy[productToBuyToUpdateIndex] = product;
      }
      setProductsToBuy(newProductsToBuy);
    } else {
      const productHistoryToUpdateIndex = productsHistory.findIndex(
        (item) => item.id === product.id,
      );
      if (productHistoryToUpdateIndex !== -1) {
        const newProductsHistory = [...productsHistory];
        if (product.quantity > 0) {
          newProductsHistory.splice(productHistoryToUpdateIndex, 1);
          setProductsToBuy([product, ...productsToBuy]);
        } else {
          newProductsHistory[productHistoryToUpdateIndex] = product;
        }
        setProductsHistory(newProductsHistory);
      }
    }
  };

  const removeProduct = (id: Product['id']) => {
    const productToBuyToRemoveIndex = productsToBuy.findIndex(
      (item) => item.id === id,
    );
    if (productToBuyToRemoveIndex !== -1) {
      const newProductsToBuy = [...productsToBuy];
      newProductsToBuy.splice(productToBuyToRemoveIndex, 1);
      setProductsToBuy(newProductsToBuy);
    } else {
      const productHistoryToRemoveIndex = productsHistory.findIndex(
        (item) => item.id === id,
      );
      if (productHistoryToRemoveIndex !== -1) {
        const newProductsHistory = [...productsHistory];
        newProductsHistory.splice(productHistoryToRemoveIndex, 1);
        setProductsHistory(newProductsHistory);
      }
    }
  };

  const unsetFocusedItemId = () => {
    setFocusedItemId(null);
  };

  return (
    <ProductContext.Provider
      value={{
        productsToBuy,
        setProductsToBuy,
        productsHistory,
        setProductsHistory,
        addProduct,
        updateProduct,
        removeProduct,
        focusedItemId,
        unsetFocusedItemId,
        itemRefs,
      }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProductContext = (): ProductContextProps => {
  const context = useContext(ProductContext);
  if (!context)
    throw new Error('useProductContext must be used within a ProductProvider');

  return context;
};
