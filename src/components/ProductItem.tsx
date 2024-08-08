import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { OpacityDecorator } from 'react-native-draggable-flatlist';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useProductContext } from '../contexts/ProductsContext';
import { Product } from '../types/Product';

import SwipeableItem, {
  useSwipeableItemParams,
} from 'react-native-swipeable-item';
import ProductItemContent from './ProductItemContent';

const OVERSWIPE_DISTANCE = 10;
const SWIPEABLE_ITEM_HEIGHT = 48;

const UnderlayLeftRemoveProduct: React.FC = () => {
  const { item } = useSwipeableItemParams<Product>();
  const { removeProduct } = useProductContext();

  return (
    <Pressable
      style={[styles.underlay, styles.underlayLeft, styles.removeProductCta]}
      onPress={() => removeProduct(item.id)}
      accessibilityRole="button"
      accessibilityLabel={`Remove product ${item.name}`}>
      <Icon name="trash-alt" color="white" size={16} />
    </Pressable>
  );
};

const UnderlayRightMarkAsBought: React.FC = () => {
  const { item } = useSwipeableItemParams<Product>();
  const { updateProduct } = useProductContext();

  return (
    <Pressable
      style={[styles.underlay, styles.underlayRight, styles.markAsBoughtCta]}
      onPress={() => updateProduct({ ...item, quantity: 0 })}
      accessibilityRole="button"
      accessibilityLabel={`Mark ${item.name} as bought`}>
      <Icon name="cart-plus" color="white" size={16} />
    </Pressable>
  );
};

interface ProductItemProps {
  product: Product;
  drag: () => void;
}

const ProductItem: React.FC<ProductItemProps> = ({ product, drag }) => {
  const { itemRefs } = useProductContext();
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
        renderUnderlayLeft={() => <UnderlayLeftRemoveProduct />}
        snapPointsLeft={[SWIPEABLE_ITEM_HEIGHT]}
        renderUnderlayRight={() => <UnderlayRightMarkAsBought />}
        snapPointsRight={product.quantity > 0 ? [SWIPEABLE_ITEM_HEIGHT] : []}
        overSwipe={OVERSWIPE_DISTANCE}>
        <ProductItemContent product={product} drag={drag} />
      </SwipeableItem>
    </OpacityDecorator>
  );
};

const styles = StyleSheet.create({
  underlay: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
  },
  underlayLeft: {
    alignItems: 'flex-end',
  },
  underlayRight: {
    alignItems: 'flex-start',
  },
  markAsBoughtCta: {
    backgroundColor: 'green',
  },
  removeProductCta: {
    backgroundColor: 'red',
  },
});

export default ProductItem;
