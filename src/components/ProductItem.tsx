import React, { useEffect, useRef } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { OpacityDecorator } from 'react-native-draggable-flatlist';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useProductContext } from '../contexts/ProductsContext';
import { Product } from '../types/Product';

import SwipeableItem, {
  SwipeableItemImperativeRef,
  useSwipeableItemParams,
} from 'react-native-swipeable-item';

const OVERSWIPE_DISTANCE = 10;
const SWIPEABLE_ITEM_HEIGHT = 48;

interface UnderLayLeftProps {
  onPress: () => void;
}

const UnderLayLeft: React.FC<UnderLayLeftProps> = ({ onPress }) => {
  const { item } = useSwipeableItemParams<Product>();

  return (
    <Pressable
      style={styles.underlayLeftCta}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Remove product ${item.name}`}>
      <Icon name="trash" color="white" size={16} />
    </Pressable>
  );
};

interface UnderlayRightProps {
  onPress: () => void;
}

const UnderlayRight: React.FC<UnderlayRightProps> = ({ onPress }) => {
  const { item } = useSwipeableItemParams<Product>();

  return (
    <Pressable
      style={styles.underlayRightCta}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Mark ${item.name} as bought`}>
      <Icon name="cart-plus" color="white" size={16} />
    </Pressable>
  );
};

interface ProductItemProps {
  product: Product;
  drag?: () => void;
  itemRefs: React.MutableRefObject<
    Map<Product['id'], SwipeableItemImperativeRef>
  >;
}

const ProductItem: React.FC<ProductItemProps> = ({
  product,
  itemRefs,
  drag,
}) => {
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
      <SwipeableItem
        key={product.id}
        item={product}
        ref={(ref) => {
          if (ref && !itemRefs.current.get(product.id))
            itemRefs.current.set(product.id, ref);
        }}
        onChange={() => {
          // Close all other open items
          [...itemRefs.current.entries()].forEach(([key, ref]) => {
            if (key !== product.id && ref) ref.close();
          });
        }}
        renderUnderlayLeft={() => (
          <UnderLayLeft onPress={() => removeProduct(product.id)} />
        )}
        snapPointsLeft={[SWIPEABLE_ITEM_HEIGHT]}
        renderUnderlayRight={() => (
          <UnderlayRight
            onPress={() => updateProduct({ ...product, quantity: 0 })}
          />
        )}
        snapPointsRight={product.quantity > 0 ? [SWIPEABLE_ITEM_HEIGHT] : []}
        overSwipe={OVERSWIPE_DISTANCE}>
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
      </SwipeableItem>
    </OpacityDecorator>
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
  underlayLeftCta: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
    padding: 16,
    borderRadius: 8,
    backgroundColor: 'red',
  },
  underlayRightCta: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    padding: 16,
    borderRadius: 8,
    backgroundColor: 'green',
  },
});

export default ProductItem;
