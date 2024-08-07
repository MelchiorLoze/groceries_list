import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { NestableScrollContainer } from 'react-native-draggable-flatlist';
import Icon from 'react-native-vector-icons/FontAwesome5';

import { ProductList } from '../../components';
import { useProductContext } from '../../contexts/ProductsContext';

const ProductsScreen: React.FC = () => {
  const {
    productsToBuy,
    setProductsToBuy,
    productsHistory,
    setProductsHistory,
    addProduct,
  } = useProductContext();

  return (
    <View style={styles.container}>
      <NestableScrollContainer contentContainerStyle={styles.listsContainer}>
        <ProductList
          title="Products to buy"
          products={productsToBuy}
          setProducts={setProductsToBuy}
        />
        <ProductList
          title="History"
          products={productsHistory}
          setProducts={setProductsHistory}
        />
      </NestableScrollContainer>
      <Pressable
        style={styles.addButton}
        onPress={addProduct}
        accessibilityRole="button"
        accessibilityLabel="Add a new product">
        <Icon name="plus" color="white" size={24} />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    padding: 16,
  },
  listsContainer: {
    gap: 16,
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
