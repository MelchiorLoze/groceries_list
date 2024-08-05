import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { ProductList } from '../../components';
import { useProductContext } from '../../contexts/ProductsContext';

const ProductsScreen: React.FC = () => {
  const { productItems, addProduct } = useProductContext();

  return (
    <View style={styles.container}>
      <ProductList
        title="Products to buy"
        productItems={productItems.filter((item) => item.quantity)}
      />
      <ProductList
        title="History"
        productItems={productItems.filter((item) => !item.quantity)}
      />
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
