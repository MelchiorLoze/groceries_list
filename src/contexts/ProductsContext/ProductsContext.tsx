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
  updateProduct: (index: number, quantity: number) => void;
  removeProduct: (index: number) => void;
}

const ProductContext = createContext<ProductContextProps | undefined>(
  undefined,
);

export const ProductProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [productItems, setProductItems] = useState<Product[]>([]);

  useEffect(() => {
    AsyncStorage.getItem('productItems', (error, result) => {
      if (!error && result)
        setProductItems((prev) => [...JSON.parse(result), ...prev]);
    });
  }, []);

  useEffect(() => {
    AsyncStorage.setItem('productItems', JSON.stringify(productItems));
  }, [productItems]);

  const addProduct = () => {
    if (productItems.length < 100) {
      setProductItems([
        ...productItems,
        { name: `item ${productItems.length + 1}`, quantity: 1 },
      ]);
    }
  };

  const updateProduct = (index: number, quantity: number) => {
    setProductItems((prevItems) => {
      const newItems = [...prevItems];
      newItems[index].quantity = quantity;
      return newItems;
    });
  };

  const removeProduct = (index: number) => {
    setProductItems((prevItems) => {
      const newItems = [...prevItems];
      newItems.splice(index, 1);
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
