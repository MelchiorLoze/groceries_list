import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import {
  NestableDraggableFlatList,
  NestableScrollContainer,
} from 'react-native-draggable-flatlist';
import Icon from 'react-native-vector-icons/FontAwesome';
import ProductItem from '../../components/ProductItem';
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
        <Text style={styles.listTitle}>Products to buy</Text>
        <NestableDraggableFlatList
          contentContainerStyle={styles.list}
          data={productsToBuy}
          renderItem={({ item, drag }) => (
            <ProductItem product={item} drag={drag} />
          )}
          keyExtractor={(item) => item.id.toString()}
          onDragEnd={({ data }) => {
            setProductsToBuy(data);
          }}
        />
        <Text style={styles.listTitle}>History</Text>
        <NestableDraggableFlatList
          contentContainerStyle={styles.list}
          data={productsHistory}
          renderItem={({ item, drag }) => (
            <ProductItem product={item} drag={drag} />
          )}
          keyExtractor={(item) => item.id.toString()}
          onDragEnd={({ data }) => {
            setProductsHistory(data);
          }}
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
  listTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  list: {
    gap: 8,
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
