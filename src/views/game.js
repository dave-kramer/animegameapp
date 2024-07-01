import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import topAnime from '../../assets/top_1000_anime.json';

const getRandomAnime = (animeList, excludeId) => {
  const filteredList = animeList.filter(anime => anime.mal_id !== excludeId);
  const randomIndex = Math.floor(Math.random() * filteredList.length);
  return filteredList[randomIndex];
};

const Game = () => {
  const [currentAnime, setCurrentAnime] = useState(null);
  const [nextAnime, setNextAnime] = useState(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [showScores, setShowScores] = useState(false);
  const [imagePressed, setImagePressed] = useState(false);
  const [scoreContainerColor, setScoreContainerColor] = useState('#298acd');
  const [lastGuessCorrect, setLastGuessCorrect] = useState(null);
  const [lastImagePressed, setLastImagePressed] = useState(null);

  useEffect(() => {
    const loadHighScore = async () => {
      try {
        const savedHighScore = await AsyncStorage.getItem('highScore');
        if (savedHighScore !== null) {
          setHighScore(parseInt(savedHighScore, 10));
        }
      } catch (error) {
        console.error('Failed to load high score:', error);
      }
    };

    loadHighScore();

    const initialAnime = getRandomAnime(topAnime);
    setCurrentAnime(initialAnime);
    setNextAnime(getRandomAnime(topAnime, initialAnime.mal_id));
  }, []);

  const saveHighScore = async (newHighScore) => {
    try {
      await AsyncStorage.setItem('highScore', newHighScore.toString());
    } catch (error) {
      console.error('Failed to save high score:', error);
    }
  };

  const handleGuess = (isHigher, pressedImage) => {
    const isCorrect = nextAnime.score > currentAnime.score;
    setLastGuessCorrect(isHigher === isCorrect);
    setLastImagePressed(pressedImage);

    setShowScores(true);
    setImagePressed(true);

    if (isHigher === isCorrect) {
      setScore(score + 1);
      setScoreContainerColor('green');
    } else {
      setScoreContainerColor('red');
    }

    setTimeout(() => {
      if (isHigher === isCorrect) {
        setCurrentAnime(nextAnime);
        setNextAnime(getRandomAnime(topAnime, nextAnime.mal_id));
      } else {
        setGameOver(true);
        if (score > highScore) {
          setHighScore(score);
          saveHighScore(score);
        }
      }
      setShowScores(false);
      setImagePressed(false);
      setScoreContainerColor('#298acd');
      setLastImagePressed(null);
    }, 2500);
  };

  const restartGame = () => {
    const initialAnime = getRandomAnime(topAnime);
    setCurrentAnime(initialAnime);
    setNextAnime(getRandomAnime(topAnime, initialAnime.mal_id));
    setScore(0);
    setGameOver(false);
    setShowScores(false);
    setScoreContainerColor('#298acd');
    setLastGuessCorrect(null);
  };

  if (!currentAnime || !nextAnime) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      {gameOver ? (
        <View style={styles.gameOverContainer}>
          <Text style={styles.gameOverText}>Game Over!</Text>
          <Text style={styles.gameOverText}>Your score: {score}</Text>
          <Text style={styles.gameOverText}>High Score: {highScore}</Text>
          <TouchableOpacity style={styles.button} onPress={restartGame}>
            <Text style={styles.buttonText}>Play Again</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.gameContainer}>
          <View style={[styles.scoreContainer, { backgroundColor: scoreContainerColor }]}>
            <Text style={styles.scoreText}>{score}</Text>
          </View>
          <TouchableOpacity
            style={styles.animeContainer}
            onPress={() => !imagePressed && handleGuess(false, 'current')}
          >
            <Image
              source={{ uri: currentAnime.image_url }}
              style={styles.animeImage}
            />
            {imagePressed && lastImagePressed === 'current' && (
              <View style={lastGuessCorrect ? styles.overlayGreen : styles.overlayRed} />
            )}
            <Text style={styles.animeText}>{currentAnime.title}</Text>
            {showScores && <Text style={styles.scoreTextOverlay}>Score: {currentAnime.score}</Text>}
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity
            style={styles.animeContainer}
            onPress={() => !imagePressed && handleGuess(true, 'next')}
          >
            <Image
              source={{ uri: nextAnime.image_url }}
              style={styles.animeImage}
            />
            {imagePressed && lastImagePressed === 'next' && (
              <View style={lastGuessCorrect ? styles.overlayGreen : styles.overlayRed} />
            )}
            <Text style={styles.animeText}>{nextAnime.title}</Text>
            {showScores && <Text style={styles.scoreTextOverlay}>Score: {nextAnime.score}</Text>}
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gameContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  animeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  animeImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  overlayRed: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 0, 0, 0.2)',
  },
  overlayGreen: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 255, 0, 0.2)',
  },
  animeText: {
    fontSize: 22,
    textAlign: 'center',
    position: 'absolute',
    color: '#fff',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 5,
    borderRadius: 5,
  },
  scoreTextOverlay: {
    fontSize: 18,
    textAlign: 'center',
    position: 'absolute',
    color: '#fff',
    bottom: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 5,
    borderRadius: 5,
  },
  divider: {
    width: '100%',
    height: 5,
    backgroundColor: '#000',
  },
  scoreContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    width: 60,
    height: 60,
    borderRadius: 40,
    zIndex: 1,
  },
  scoreText: {
    fontSize: 24,
    color: '#fff',
  },
  button: {
    padding: 15,
    backgroundColor: '#007bff',
    borderRadius: 5,
    marginHorizontal: 10,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 12,
    textAlign: 'center',
  },
  gameOverContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gameOverText: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 10,
  },
});

export default Game;
