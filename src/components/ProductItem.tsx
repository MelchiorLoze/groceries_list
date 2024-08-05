import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Product } from '../types/Product';

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
            onPress={() => updateProduct(product.quantity + 1)}
            accessibilityRole="button"
            accessibilityLabel={`Add one ${product.name}`}>
            <Icon name="plus" size={16} />
          </Pressable>
          {product.quantity > 0 && (
            <Pressable
              style={styles.quantityCta}
              onPress={() => updateProduct(product.quantity - 1)}
              accessibilityRole="button"
              accessibilityLabel={`Remove one ${product.name}`}>
              <Icon name="minus" size={16} />
            </Pressable>
          )}
        </View>
        <View style={styles.quantityCtaSection}>
          {product.quantity > 0 && (
            <Pressable
              style={styles.quantityCta}
              onPress={() => updateProduct(0)}
              accessibilityRole="button"
              accessibilityLabel={`Mark ${product.name} as bought`}>
              <Icon name="cart-plus" color="green" size={16} />
            </Pressable>
          )}
          <Pressable
            style={styles.quantityCta}
            onPress={removeProduct}
            accessibilityRole="button"
            accessibilityLabel={`Remove product ${product.name}`}>
            <Icon name="trash" color="red" size={16} />
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
