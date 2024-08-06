import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { type Product } from '../types/Product';
import ProductItem from './ProductItem';

interface ProductListProps {
  title: string;
  productItems: Product[];
}

const ProductList: React.FC<ProductListProps> = ({ title, productItems }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <FlatList
        contentContainerStyle={styles.itemList}
        data={productItems}
        renderItem={(itemInfo) => <ProductItem product={itemInfo.item} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    //height: '50%',
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
