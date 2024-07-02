import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import topAnime from '../../assets/top_1000_anime.json';
import topManga from '../../assets/top_1000_manga.json';
import topChar from '../../assets/top_1000_char.json';

const getRandomItem = (list, excludeId = null) => {
  const filteredList = excludeId ? list.filter(item => item.mal_id !== excludeId) : list;
  const randomIndex = Math.floor(Math.random() * filteredList.length);
  return filteredList[randomIndex];
};

const Game = ({ route }) => {
  const { option } = route.params;
  const [currentItem, setCurrentItem] = useState(null);
  const [nextItem, setNextItem] = useState(null);
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
        const savedHighScore = await AsyncStorage.getItem(`highScore-${option}`);
        if (savedHighScore !== null) {
          setHighScore(parseInt(savedHighScore, 10));
        }
      } catch (error) {
        console.error('Failed to load high score:', error);
      }
    };

    loadHighScore();

    let initialItem;
    if (option === 'Anime Score' || option === 'Anime Popularity') {
      initialItem = getRandomItem(topAnime);
    } else if (option === 'Manga Score' || option === 'Manga Popularity') {
      initialItem = getRandomItem(topManga);
    } else if (option === 'Character Favorites') {
      initialItem = getRandomItem(topChar);
    }
    setCurrentItem(initialItem);
    setNextItem(getRandomItem(option === 'Character Favorites' ? topChar : (option.includes('Anime') ? topAnime : topManga), initialItem.mal_id));
  }, [option]);

  const saveHighScore = async (newHighScore) => {
    try {
      await AsyncStorage.setItem(`highScore-${option}`, newHighScore.toString());
    } catch (error) {
      console.error('Failed to save high score:', error);
    }
  };

  const handleGuess = (isHigher, pressedImage) => {
    let isCorrect;
    if (option.includes('Score')) {
      isCorrect = nextItem.score > currentItem.score;
    } else if (option.includes('Popularity')) {
      isCorrect = nextItem.popularity < currentItem.popularity;
    } else if (option === 'Character Favorites') {
      isCorrect = nextItem.favorites > currentItem.favorites;
    }

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
        setCurrentItem(nextItem);
        setNextItem(getRandomItem(option === 'Character Favorites' ? topChar : (option.includes('Anime') ? topAnime : topManga), nextItem.mal_id));
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
    let initialItem;
    if (option === 'Anime Score' || option === 'Anime Popularity') {
      initialItem = getRandomItem(topAnime);
    } else if (option === 'Manga Score' || option === 'Manga Popularity') {
      initialItem = getRandomItem(topManga);
    } else if (option === 'Character Favorites') {
      initialItem = getRandomItem(topChar);
    }
    setCurrentItem(initialItem);
    setNextItem(getRandomItem(option === 'Character Favorites' ? topChar : (option.includes('Anime') ? topAnime : topManga), initialItem.mal_id));
    setScore(0);
    setGameOver(false);
    setShowScores(false);
    setScoreContainerColor('#298acd');
    setLastGuessCorrect(null);
  };

  if (!currentItem || !nextItem) {
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
            style={styles.itemContainer}
            onPress={() => !imagePressed && handleGuess(false, 'current')}
          >
            <Image
              source={{ uri: currentItem.image_url }}
              style={styles.itemImage}
            />
            {imagePressed && lastImagePressed === 'current' && (
              <View style={lastGuessCorrect ? styles.overlayGreen : styles.overlayRed} />
            )}
            <Text style={styles.itemText}>{option === 'Character Favorites' ? currentItem.name : currentItem.title}</Text>
            {showScores && <Text style={styles.scoreTextOverlay}>{option.includes('Score') ? `Score: ${currentItem.score}` : option.includes('Popularity') ? `Popularity: ${currentItem.popularity}` : `Favorites: ${currentItem.favorites}`}</Text>}
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity
            style={styles.itemContainer}
            onPress={() => !imagePressed && handleGuess(true, 'next')}
          >
            <Image
              source={{ uri: nextItem.image_url }}
              style={styles.itemImage}
            />
            {imagePressed && lastImagePressed === 'next' && (
              <View style={lastGuessCorrect ? styles.overlayGreen : styles.overlayRed} />
            )}
            <Text style={styles.itemText}>{option === 'Character Favorites' ? nextItem.name : nextItem.title}</Text>
            {showScores && <Text style={styles.scoreTextOverlay}>{option.includes('Score') ? `Score: ${nextItem.score}` : option.includes('Popularity') ? `Popularity: ${nextItem.popularity}` : `Favorites: ${nextItem.favorites}`}</Text>}
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
  itemContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  itemImage: {
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
  itemText: {
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
