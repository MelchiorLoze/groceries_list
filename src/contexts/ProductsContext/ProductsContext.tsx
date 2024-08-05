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
  updateProduct: (id: number, quantity: number) => void;
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
          name: `item ${productItemsCount + 1}`,
          quantity: 1,
        },
      ]);
    }
  };

  const updateProduct = (id: number, quantity: number) => {
    setProductItems((prevItems) => {
      const newItems = [...prevItems];
      const itemToUpdate = newItems.find((item) => item.id === id);
      if (itemToUpdate) itemToUpdate.quantity = quantity;
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
      value={{ productItems, addProduct, updateProduct, removeProduct }}>
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
