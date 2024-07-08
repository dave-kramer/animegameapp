import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import StartScreen from './src/views/startscreen';
import Menu from './src/views/menu';
import Game from './src/views/game';
import Guess from './src/views/guess';
import Rounds from './src/views/rounds';
import Settings from './src/views/settings';
import Score from './src/views/score';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="StartScreen">
        <Stack.Screen name="StartScreen" component={StartScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="Menu" component={Menu} options={{ headerShown: false }}/>
        <Stack.Screen name="Game" component={Game} options={{ headerShown: false }}/>
        <Stack.Screen name="Guess" component={Guess} options={{ headerShown: false }}/>
        <Stack.Screen name="Rounds" component={Rounds} options={{ headerShown: false }}/>
        <Stack.Screen name="Score" component={Score} options={{ headerShown: false }}/>
        <Stack.Screen name="Settings" component={Settings}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
