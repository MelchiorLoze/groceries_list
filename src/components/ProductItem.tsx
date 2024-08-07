import React, { useEffect, useRef } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useProductContext } from '../contexts/ProductsContext';
import { Product } from '../types/Product';

interface ProductItemProps {
  product: Product;
}

const ProductItem: React.FC<ProductItemProps> = ({ product }) => {
  const { updateProduct, removeProduct, focusedItemId, unsetFocusedItemId } =
    useProductContext();
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (inputRef?.current && product.id === focusedItemId) {
      inputRef.current.focus();
      unsetFocusedItemId();
    }
  }, [focusedItemId, inputRef, product, unsetFocusedItemId]);

  return (
    <View style={styles.container}>
      <TextInput
        ref={inputRef}
        style={styles.nameInput}
        value={product.name}
        onChangeText={(newName) => {
          if (newName !== product.name)
            updateProduct({ ...product, name: newName });
        }}
        onBlur={() => {
          if (!product.name) updateProduct({ ...product, name: 'New product' });
        }}
      />
      <Text>x{product.quantity}</Text>
      <View style={styles.quantityCtaSection}>
        <Pressable
          style={styles.quantityCta}
          onPress={() =>
            updateProduct({ ...product, quantity: product.quantity + 1 })
          }
          accessibilityRole="button"
          accessibilityLabel={`Add one ${product.name}`}>
          <Icon name="plus" size={16} />
        </Pressable>
        {product.quantity > 0 && (
          <Pressable
            style={styles.quantityCta}
            onPress={() =>
              updateProduct({ ...product, quantity: product.quantity - 1 })
            }
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
            onPress={() => updateProduct({ ...product, quantity: 0 })}
            accessibilityRole="button"
            accessibilityLabel={`Mark ${product.name} as bought`}>
            <Icon name="cart-plus" color="green" size={16} />
          </Pressable>
        )}
        <Pressable
          style={styles.quantityCta}
          onPress={() => removeProduct(product.id)}
          accessibilityRole="button"
          accessibilityLabel={`Remove product ${product.name}`}>
          <Icon name="trash" color="red" size={16} />
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    gap: 8,
    backgroundColor: 'white',
    borderRadius: 8,
    alignItems: 'center',
  },
  nameInput: {
    padding: 0,
    height: '100%',
    flexGrow: 1,
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
