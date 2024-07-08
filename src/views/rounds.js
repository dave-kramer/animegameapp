import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Animated, Easing } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import characters from '../../assets/top_1000_char.json';

const Rounds = ({ route }) => {
  const { gender, rounds } = route.params;
  const [currentRound, setCurrentRound] = useState(0);
  const [selectedCharacters, setSelectedCharacters] = useState([]);
  const [currentPair, setCurrentPair] = useState([null, null]);
  const [winner, setWinner] = useState(null);
  const [slideAnimations, setSlideAnimations] = useState([new Animated.Value(0), new Animated.Value(0)]);

  useEffect(() => {
    const filteredCharacters = characters.filter(char => char.gender === gender);
    const shuffledCharacters = filteredCharacters.sort(() => 0.5 - Math.random());
    const selected = shuffledCharacters.slice(0, rounds);
    setSelectedCharacters(selected);
    setCurrentPair([selected[0], selected[1]]);
  }, [gender, rounds]);

  const saveWinnerToStorage = async (winner, gender) => {
    const key = gender === 'Male' ? 'BestMale' : 'BestFemale';
    try {
      await AsyncStorage.setItem(key, JSON.stringify(winner));
    } catch (error) {
      console.error('Error saving winner to local storage:', error);
    }
  };

  const slideAnimationHandler = (winnerIndex) => {
    const correctIndex = winnerIndex;
    const incorrectIndex = 1 - winnerIndex;
  
    Animated.parallel([
      Animated.timing(slideAnimations[correctIndex], {
        toValue: 500,
        duration: 400,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnimations[incorrectIndex], {
        toValue: -500,
        duration: 400,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ]).start(() => {
      handleCharacterSelect(winnerIndex);
    });
  };

  const handleCharacterSelect = (winnerIndex) => {
    const nextRound = currentRound + 2;
    const remainingCharacters = selectedCharacters.filter(char => char !== currentPair[0] && char !== currentPair[1]);
    const winner = currentPair[winnerIndex];
    remainingCharacters.push(winner);
    
    if (remainingCharacters.length === 1) {
      setWinner(remainingCharacters[0]);
      saveWinnerToStorage(remainingCharacters[0], gender);  // Save winner to local storage
    } else {
      setSelectedCharacters(remainingCharacters);
      setCurrentRound(nextRound);
      setCurrentPair([remainingCharacters[0], remainingCharacters[1]]);
      
      Animated.parallel([
        Animated.timing(slideAnimations[0], {
          toValue: 0,
          duration: 400,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnimations[1], {
          toValue: 0,
          duration: 400,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };

  if (winner) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Winner</Text>
        <View style={styles.winnerCard}>
          <Image source={{ uri: winner.image_url }} style={styles.characterImage} />
          <Text style={styles.name}>{winner.name}</Text>
        </View>
      </View>
    );
  }

  if (!currentPair[0] || !currentPair[1]) return null;

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <Animated.View style={{ transform: [{ translateX: slideAnimations[0] }] }}>
          <TouchableOpacity onPress={() => slideAnimationHandler(0)}>
            <View style={styles.card}>
              <Image source={{ uri: currentPair[0].image_url }} style={styles.characterImage} />
            </View>
          </TouchableOpacity>
        </Animated.View>
      </View>
      <View style={styles.middleContainer}>
        <Text style={styles.name}>{currentPair[0].name}</Text>
        <Text style={styles.roundText}>Round {currentRound / 2 + 1}</Text>
        <Text style={styles.name}>{currentPair[1].name}</Text>
      </View>
      <View style={styles.bottomContainer}>
        <Animated.View style={{ transform: [{ translateX: slideAnimations[1] }] }}>
          <TouchableOpacity onPress={() => slideAnimationHandler(1)}>
            <View style={styles.card}>
              <Image source={{ uri: currentPair[1].image_url }} style={styles.characterImage} />
            </View>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  topContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  middleContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: 200,
    height: 270,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  winnerCard: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,
    width: '80%',
    height: '60%',
  },  
  characterImage: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  name: {
    fontSize: 18,
    textAlign: 'center',
  },
  roundText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default Rounds;