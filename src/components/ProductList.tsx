import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { NestableDraggableFlatList } from 'react-native-draggable-flatlist';
import Icon from 'react-native-vector-icons/FontAwesome5';
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
    <View style={styles.header}>
      <Text style={styles.title}>{title}</Text>
      {products.length > 0 && (
        <Pressable
          onPress={() => setProducts([])}
          accessibilityRole="button"
          accessibilityLabel={`Remove all ${title.toLowerCase()}`}>
          <Icon name="trash-alt" size={16} />
        </Pressable>
      )}
    </View>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  deleteAllButton: {
    padding: 8,
  },
  list: {
    gap: 8,
  },
});

export default ProductList;
