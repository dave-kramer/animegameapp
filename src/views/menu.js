import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, Image } from 'react-native';

const Menu = ({ navigation }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedGender, setSelectedGender] = useState('');

  const handleOptionPress = (option) => {
    setSelectedOption(option);
  };

  const handleSettingsPress = () => {
    navigation.navigate('Settings');
  };

  const handleGuessOptionPress = (option) => {
    navigation.navigate('Guess', { guessType: option });
  };

  const handleGenderOptionPress = (gender) => {
    setSelectedGender(gender);
    handleOptionPress('Rounds'); // Automatically select Rounds after selecting gender
  };

  const handleRoundsOptionPress = (rounds) => {
    navigation.navigate('Rounds', { gender: selectedGender, rounds });
  };

  const handleScoresPress = () => {
    navigation.navigate('Score');
  };

  // Style for the Back button
  const backButton = {
    ...styles.menuItem,
    backgroundColor: 'rgba(255, 0, 0, 0.5)', // Red background color with transparency
  };

  // Render different sets of buttons based on selectedOption
  const renderButtons = () => {
    if (selectedOption === null) {
      // Initial state, render main menu buttons
      return (
        <>
          <TouchableOpacity style={styles.menuItem} onPress={() => handleOptionPress('HigherOrLower')}>
            <Text style={styles.menuText}>Higher or Lower</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => handleOptionPress('Guess')}>
            <Text style={styles.menuText}>Guess the ...</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => handleOptionPress('Gender')}>
            <Text style={styles.menuText}>Who's the best?</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={handleScoresPress}>
            <Text style={styles.menuText}>Scores</Text>
          </TouchableOpacity>
        </>
      );
    } else if (selectedOption === 'HigherOrLower') {
      // Show options for Higher or Lower
      return (
        <>
          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Game', { option: 'Anime Score' })}>
            <Text style={styles.menuText}>Anime Score</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Game', { option: 'Anime Popularity' })}>
            <Text style={styles.menuText}>Anime Popularity</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Game', { option: 'Manga Score' })}>
            <Text style={styles.menuText}>Manga Score</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Game', { option: 'Manga Popularity' })}>
            <Text style={styles.menuText}>Manga Popularity</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Game', { option: 'Character Favorites' })}>
            <Text style={styles.menuText}>Character Favorites</Text>
          </TouchableOpacity>
          <TouchableOpacity style={backButton} onPress={() => setSelectedOption(null)}>
            <Text style={styles.menuText}>Back</Text>
          </TouchableOpacity>
        </>
      );
    } else if (selectedOption === 'Guess') {
      // Show options for Guess the ...
      return (
        <>
          <TouchableOpacity style={styles.menuItem} onPress={() => handleGuessOptionPress('name')}>
            <Text style={styles.menuText}>Name</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => handleGuessOptionPress('nicknames')}>
            <Text style={styles.menuText}>Nicknames</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => handleGuessOptionPress('name_kanji')}>
            <Text style={styles.menuText}>Name Kanji</Text>
          </TouchableOpacity>
          <TouchableOpacity style={backButton} onPress={() => setSelectedOption(null)}>
            <Text style={styles.menuText}>Back</Text>
          </TouchableOpacity>
        </>
      );
    } else if (selectedOption === 'Gender') {
      // Show options for Who's the best?
      return (
        <>
          <TouchableOpacity style={styles.menuItem} onPress={() => handleGenderOptionPress('Female')}>
            <Text style={styles.menuText}>Best Female</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => handleGenderOptionPress('Male')}>
            <Text style={styles.menuText}>Best Male</Text>
          </TouchableOpacity>
          <TouchableOpacity style={backButton} onPress={() => setSelectedOption(null)}>
            <Text style={styles.menuText}>Back</Text>
          </TouchableOpacity>
        </>
      );
    } else if (selectedOption === 'Rounds') {
      // Show options for Rounds
      return (
        <>
          <TouchableOpacity style={styles.menuItem} onPress={() => handleRoundsOptionPress(16)}>
            <Text style={styles.menuText}>16 Rounds</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => handleRoundsOptionPress(32)}>
            <Text style={styles.menuText}>32 Rounds</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => handleRoundsOptionPress(64)}>
            <Text style={styles.menuText}>64 Rounds</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => handleRoundsOptionPress(128)}>
            <Text style={styles.menuText}>128 Rounds</Text>
          </TouchableOpacity>
          <TouchableOpacity style={backButton} onPress={() => setSelectedOption('Gender')}>
            <Text style={styles.menuText}>Back</Text>
          </TouchableOpacity>
        </>
      );
    }
  };

  return (
    <ImageBackground source={require('../../assets/13.png')} style={styles.background}>
      <View style={styles.container}>
        {renderButtons()}

        {/* Custom Settings Icon */}
        <TouchableOpacity style={styles.settingsIcon} onPress={handleSettingsPress}>
          <Image source={require('../../assets/menu/gear-256.webp')} style={styles.settingsIconImage} />
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover', // or 'stretch'
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.25)', // fallback background color
  },
  menuItem: {
    margin: 10,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 15,
    width: 175,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.3)'
  },
  menuText: {
    fontFamily: 'akaDylan-Plain',
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  settingsIcon: {
    position: 'absolute',
    top: 40,
    right: 20,
    width: 50, // Same width as menuItem
    paddingVertical: 5, // Same padding as menuItem
    paddingHorizontal: 5, // Same padding as menuItem
    borderRadius: 15, // Same borderRadius as menuItem
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.3)' // Same background color as menuItem
  },
  settingsIconImage: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
});

export default Menu;