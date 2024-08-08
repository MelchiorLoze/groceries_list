import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { NestableDraggableFlatList } from 'react-native-draggable-flatlist';
import { Product } from '../types/Product';
import ProductItem from './ProductItem';

const ACTIVATION_DISTANCE = 20;

interface ProductListProps {
  title: string;
  products: Product[];
  setProducts: (products: Product[]) => void;
}

const ProductList: React.FC<ProductListProps> = ({
  title,
  products,
  setProducts,
}) => (
  <>
    <Text style={styles.listTitle}>{title}</Text>
    <NestableDraggableFlatList
      contentContainerStyle={styles.list}
      data={products}
      renderItem={({ item, drag }) => (
        <ProductItem product={item} drag={drag} />
      )}
      keyExtractor={(item) => item.id.toString()}
      onDragEnd={({ data }) => setProducts(data)}
      activationDistance={ACTIVATION_DISTANCE}
      testID={`${title.toLowerCase().replaceAll(' ', '-')}-list`}
    />
  </>
);

const styles = StyleSheet.create({
  listTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  list: {
    gap: 8,
  },
});

export default ProductList;
