import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import DraggableFlatList from 'react-native-draggable-flatlist';
import Icon from 'react-native-vector-icons/FontAwesome';
import ProductItem from '../../components/ProductItem';
import { useProductContext } from '../../contexts/ProductsContext';

const ProductsScreen: React.FC = () => {
  const { productItems, setProductItems, addProduct } = useProductContext();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Products to buy</Text>
      <DraggableFlatList
        contentContainerStyle={styles.list}
        data={productItems}
        renderItem={({ item, drag }) => (
          <ProductItem product={item} drag={drag} />
        )}
        keyExtractor={(item) => item.id.toString()}
        onDragEnd={({ data }) => {
          setProductItems(data);
        }}
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
  title: {
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
