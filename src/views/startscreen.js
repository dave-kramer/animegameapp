import React, { useState } from 'react';
import { View, ImageBackground, StyleSheet, TouchableOpacity, Text } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { useFonts } from 'expo-font';

const StartScreen = ({ navigation }) => {
  const [loaded] = useFonts({
    'akaDylan-Plain': require('../../assets/fonts/akaDylan-Plain.ttf'),
  });

  const handlePress = () => {
    navigation.replace('Menu');
  };

  // Check if the font is loaded
  if (!loaded) {
    return null; // You can return a loading indicator or null until the font is loaded
  }

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
    fontFamily: 'akaDylan-Plain',
    fontSize: 26,
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 12,
  },
});

export default StartScreen;