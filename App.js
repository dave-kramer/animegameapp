import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Menu from './src/views/menu';
import Game from './src/views/game';
import Guess from './src/views/guess';
import Settings from './src/views/settings';

const Stack = createStackNavigator();

const App = () => {
  return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Menu">
          <Stack.Screen name="Menu" component={Menu} options={{ headerShown: false }}/>
          <Stack.Screen name="Game" component={Game} options={{ headerShown: false }}/>
          <Stack.Screen name="Guess" component={Guess} options={{ headerShown: false }}/>
          <Stack.Screen name="Settings" component={Settings} />
        </Stack.Navigator>
      </NavigationContainer>
  );
};

export default App;
