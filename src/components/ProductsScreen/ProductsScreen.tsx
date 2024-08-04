import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Product } from '../../types';
import ProductList from './ProductList';

const ProductsScreen: React.FC = () => {
  const [productItems, setProductItems] = useState<Product[]>([
    { name: 'item 1', quantity: 1 },
  ]);

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
    <View style={styles.container}>
      <ProductList
        title="Products to buy"
        productItems={productItems.filter((item) => item.quantity > 0)}
        updateProduct={updateProduct}
        removeProduct={removeProduct}
      />
      <ProductList
        title="History"
        productItems={productItems.filter((item) => item.quantity === 0)}
        updateProduct={updateProduct}
        removeProduct={removeProduct}
      />
      <Pressable style={styles.addButton} onPress={addProduct}>
        <Icon name="plus" color="white" size={24} />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    gap: 16,
    padding: 16,
  },
  addButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    color: 'white',
    backgroundColor: 'blue',
    borderRadius: 100,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ProductsScreen;
