import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome';

import ProductsScreen from './src/components/ProductsScreen/ProductsScreen';
import PantryScreen from './src/components/PantryScreen/PantryScreen';

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
      iconName = 'snowflake-o';
      break;
    default:
      iconName = 'warning';
      break;
  }

  return <Icon name={iconName} size={size} color={color} />;
};

function App(): React.JSX.Element {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Tab.Navigator
          initialRouteName={Route.PRODUCTS}
          screenOptions={({ route }) => ({
            headerShown: false,
            tabBarIcon: ({ color, size }) => getTabBarIcon(route, color, size),
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
    </SafeAreaProvider>
  );
}

export default App;
