import React from 'react';
import { KeyboardAvoidingView, Platform } from 'react-native';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome5';

import { ProductProvider } from './src/contexts/ProductsContext';
import { PantryScreen } from './src/screens/PantryScreen';
import { ProductsScreen } from './src/screens/ProductsScreen';

enum Route {
  PRODUCTS = 'Products',
  PANTRY = 'Pantry',
}

type TabParamList = {
  [_ in Route]: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

const getTabBarIcon = (route: { name: Route }, color: string, size: number) => {
  let iconName;

  switch (route.name) {
    case Route.PRODUCTS:
      iconName = 'list-ul';
      break;
    case Route.PANTRY:
      iconName = 'snowflake';
      break;
    default:
      iconName = 'warning';
      break;
  }

  return <Icon name={iconName} size={size} color={color} />;
};

function App(): React.JSX.Element {
  return (
    <ProductProvider>
      <SafeAreaProvider>
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <GestureHandlerRootView style={styles.container}>
            <NavigationContainer>
              <Tab.Navigator
                initialRouteName={Route.PRODUCTS}
                screenOptions={({ route }) => ({
                  headerShown: false,
                  tabBarIcon: ({ color, size }) =>
                    getTabBarIcon(route, color, size),
                })}>
                <Tab.Screen
                  name={Route.PRODUCTS}
                  component={ProductsScreen}
                  options={{ tabBarTestID: 'tab-bar-products' }}
                />
                <Tab.Screen
                  name={Route.PANTRY}
                  component={PantryScreen}
                  options={{ tabBarTestID: 'tab-bar-pantry' }}
                />
              </Tab.Navigator>
            </NavigationContainer>
          </GestureHandlerRootView>
        </KeyboardAvoidingView>
      </SafeAreaProvider>
    </ProductProvider>
  );
}

const styles = {
  container: {
    flex: 1,
  },
};

export default App;
