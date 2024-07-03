import React from 'react';
import { View, ImageBackground, StyleSheet, TouchableOpacity } from 'react-native';
import * as Animatable from 'react-native-animatable';

const StartScreen = ({ navigation }) => {
  const handlePress = () => {
    navigation.replace('Menu');
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <ImageBackground
        source={require('../../assets/12.png')}
        style={styles.background}
      >
        <Animatable.View animation="pulse" iterationCount="infinite" iterationDelay={1000} style={styles.textContainer}>
          <Animatable.Text style={styles.text}>Click to play</Animatable.Text>
        </Animatable.View>
      </ImageBackground>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  textContainer: {
    marginBottom: 25,
    alignItems: 'center',
  },
  text: {
    fontSize: 28,
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 12,
  },
});

export default StartScreen;
