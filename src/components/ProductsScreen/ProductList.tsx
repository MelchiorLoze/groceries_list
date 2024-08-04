import React from 'react';
import { FlatList, StyleSheet, Text } from 'react-native';
import { Product } from '../../types';
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
    <>
      <Text style={styles.title}>{title}</Text>
      <FlatList
        contentContainerStyle={styles.itemList}
        data={productItems.filter((item) => item.quantity > 0)}
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
    </>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  itemList: {
    gap: 8,
  },
});

export default ProductList;
