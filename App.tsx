import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome';
import ListScreen from './src/components/ListScreen';
import PantryScreen from './src/components/PantryScreen';

const Tab = createBottomTabNavigator();

enum Routes {
  LIST = 'List',
  PANTRY = 'Pantry',
}

const getTabBarIcon = (
  route: { name: string },
  color: string,
  size: number,
) => {
  let iconName;

  switch (route.name) {
    case Routes.LIST:
      iconName = 'list-ul';
      break;
    case Routes.PANTRY:
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
          initialRouteName={Routes.LIST}
          screenOptions={({ route }) => ({
            tabBarIcon: ({ color, size }) => getTabBarIcon(route, color, size),
          })}>
          <Tab.Screen name={Routes.LIST} component={ListScreen} />
          <Tab.Screen name={Routes.PANTRY} component={PantryScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default App;
