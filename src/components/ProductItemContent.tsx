import React, { useEffect, useRef } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome5';

import { useProductContext } from '../contexts/ProductsContext';
import { Product } from '../types/Product';

interface ProductItemContentProps {
  product: Product;
  drag: () => void;
}

const ProductItemContent: React.FC<ProductItemContentProps> = ({
  product,
  drag,
}) => {
  const { updateProduct, focusedItemId, unsetFocusedItemId } =
    useProductContext();

  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (inputRef?.current && product.id === focusedItemId) {
      setTimeout(() => inputRef.current?.focus(), 0);
      unsetFocusedItemId();
    }
  }, [focusedItemId, inputRef, product, unsetFocusedItemId]);

  return (
    <View style={styles.container} testID={product.id.toString()}>
      <View style={styles.wrapper}>
        <Pressable
          style={styles.cta}
          onLongPress={drag}
          accessibilityRole="button">
          <Icon name="grip-horizontal" size={16} color="lightgrey" />
        </Pressable>
        <TextInput
          ref={inputRef}
          style={styles.nameInput}
          value={product.name}
          onChangeText={(newName) => {
            if (newName !== product.name)
              updateProduct({ ...product, name: newName });
          }}
          onBlur={() => {
            if (!product.name)
              updateProduct({ ...product, name: 'New product' });
          }}
        />
      </View>
      <View style={styles.wrapper}>
        <Text>x{product.quantity}</Text>
        <View style={styles.quantityCtaContainer}>
          <Pressable
            style={styles.cta}
            onPress={() =>
              updateProduct({ ...product, quantity: product.quantity + 1 })
            }
            accessibilityRole="button"
            accessibilityLabel={`Add one ${product.name}`}>
            <Icon name="plus" size={16} />
          </Pressable>
          {product.quantity > 0 && (
            <Pressable
              style={styles.cta}
              onPress={() =>
                updateProduct({
                  ...product,
                  quantity: product.quantity - 1,
                })
              }
              accessibilityRole="button"
              accessibilityLabel={`Remove one ${product.name}`}>
              <Icon name="minus" size={16} />
            </Pressable>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 8,
    gap: 8,
    backgroundColor: 'white',
    borderRadius: 8,
  },
  wrapper: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  cta: {
    padding: 8,
  },
  nameInput: {
    padding: 0,
    height: '100%',
  },
  quantityCtaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 100,
    backgroundColor: 'lightgray',
  },
});

export default ProductItemContent;
