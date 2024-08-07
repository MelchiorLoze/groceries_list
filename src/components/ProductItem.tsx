import React, { useEffect, useRef } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { OpacityDecorator } from 'react-native-draggable-flatlist';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useProductContext } from '../contexts/ProductsContext';
import { Product } from '../types/Product';

interface ProductItemProps {
  product: Product;
  drag?: () => void;
}

const ProductItem: React.FC<ProductItemProps> = ({ product, drag }) => {
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
    <OpacityDecorator activeOpacity={0.5}>
      <View style={styles.container}>
        <Pressable
          style={styles.cta}
          onLongPress={drag}
          accessibilityRole="button">
          <Icon name="grip-horizontal" size={16} />
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
        <Text>x{product.quantity}</Text>
        <View style={styles.quantityCtaSection}>
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
              style={styles.cta}
              onPress={() => updateProduct({ ...product, quantity: 0 })}
              accessibilityRole="button"
              accessibilityLabel={`Mark ${product.name} as bought`}>
              <Icon name="cart-plus" color="green" size={16} />
            </Pressable>
          )}
          <Pressable
            style={styles.cta}
            onPress={() => removeProduct(product.id)}
            accessibilityRole="button"
            accessibilityLabel={`Remove product ${product.name}`}>
            <Icon name="trash" color="red" size={16} />
          </Pressable>
        </View>
      </View>
    </OpacityDecorator>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 8,
    gap: 8,
    backgroundColor: 'white',
    borderRadius: 8,
    alignItems: 'center',
  },
  cta: {
    padding: 8,
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
});

export default ProductItem;
