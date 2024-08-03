import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome';

import ListScreen from './src/components/ListScreen';
import PantryScreen from './src/components/PantryScreen';

enum Route {
  LIST = 'List',
  PANTRY = 'Pantry',
}

type TabParamList = {
  [_ in Route]: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

const getTabBarIcon = (route: { name: Route }, color: string, size: number) => {
  let iconName;

  switch (route.name) {
    case Route.LIST:
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
          initialRouteName={Route.LIST}
          screenOptions={({ route }) => ({
            headerShown: false,
            tabBarIcon: ({ color, size }) => getTabBarIcon(route, color, size),
          })}>
          <Tab.Screen
            name={Route.LIST}
            component={ListScreen}
            options={{ tabBarTestID: 'tab-bar-list' }}
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
