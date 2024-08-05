import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { type Product } from '../types/Product';
import ProductItem from './ProductItem';

interface ProductListProps {
  title: string;
  productItems: Product[];
  updateProduct: (index: number, quantity: number) => void;
  removeProduct: (index: number) => void;
}

const ProductList: React.FC<ProductListProps> = ({
  title,
  productItems,
  updateProduct,
  removeProduct,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <FlatList
        contentContainerStyle={styles.itemList}
        data={productItems}
        renderItem={(itemInfo) => (
          <ProductItem
            product={itemInfo.item}
            updateProduct={(quantity: number) =>
              updateProduct(itemInfo.index, quantity)
            }
            removeProduct={() => removeProduct(itemInfo.index)}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '50%',
    gap: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  itemList: {
    gap: 8,
  },
});

export default ProductList;
