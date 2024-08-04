import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Product } from '../../types';

interface ProductItemProps {
  product: Product;
  updateProduct: (quantity: number) => void;
  removeProduct: () => void;
}

const ProductItem: React.FC<ProductItemProps> = ({
  product,
  updateProduct,
  removeProduct,
}) => {
  return (
    <View style={styles.container}>
      <Text>{product.name}</Text>
      <View style={styles.quantitySection}>
        <Text>x{product.quantity}</Text>
        <View style={styles.quantityCtaSection}>
          <Pressable
            style={styles.quantityCta}
            onPress={() => updateProduct(product.quantity + 1)}>
            <Icon name="plus" size={16} />
          </Pressable>
          {product.quantity > 0 && (
            <Pressable style={styles.quantityCta}>
              <Icon
                name="minus"
                onPress={() => updateProduct(product.quantity - 1)}
                size={16}
              />
            </Pressable>
          )}
        </View>
        <View style={styles.quantityCtaSection}>
          {product.quantity > 0 && (
            <Pressable style={styles.quantityCta}>
              <Icon
                name="cart-plus"
                onPress={() => updateProduct(0)}
                color="green"
                size={16}
              />
            </Pressable>
          )}
          <Pressable style={styles.quantityCta}>
            <Icon name="trash" onPress={removeProduct} color="red" size={16} />
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 8,
    alignItems: 'center',
  },
  quantitySection: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  quantityCtaSection: {
    alignItems: 'center',
    borderRadius: 100,
    backgroundColor: 'lightgray',
  },
  quantityCta: {
    padding: 6,
  },
});

export default ProductItem;
