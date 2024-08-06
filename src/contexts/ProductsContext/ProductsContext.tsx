import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react';

import { Product } from '../../types/Product';

interface ProductContextProps {
  productItems: Product[];
  addProduct: () => void;
  updateProduct: (product: Product) => void;
  removeProduct: (id: number) => void;
}

const ProductContext = createContext<ProductContextProps | undefined>(
  undefined,
);

export const ProductProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [productItems, setProductItems] = useState<Product[]>([]);

  useEffect(() => {
    AsyncStorage.getItem('productItems', (error, result) => {
      if (!error && result?.length) setProductItems(JSON.parse(result));
    });
  }, []);

  useEffect(() => {
    if (productItems.length)
      AsyncStorage.setItem('productItems', JSON.stringify(productItems));
  }, [productItems]);

  const addProduct = () => {
    if (productItems.length < 100) {
      const productItemsCount = productItems.length;
      setProductItems([
        ...productItems,
        {
          id: productItemsCount + 1,
          name: 'New product',
          quantity: 1,
        },
      ]);
    }
  };

  const updateProduct = (product: Product) => {
    setProductItems((prevItems) => {
      const newItems = [...prevItems];
      const itemIndexToUpdate = newItems.findIndex(
        (item) => item.id === product.id,
      );
      newItems[itemIndexToUpdate] = product;
      return newItems;
    });
  };

  const removeProduct = (id: number) => {
    setProductItems((prevItems) => {
      const newItems = [...prevItems];
      const itemIndexToRemove = newItems.findIndex((item) => item.id === id);
      newItems.splice(itemIndexToRemove, 1);
      return newItems;
    });
  };

  return (
    <ProductContext.Provider
      value={{
        productItems,
        addProduct,
        updateProduct,
        removeProduct,
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
