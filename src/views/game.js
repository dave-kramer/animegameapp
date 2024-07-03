import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Animated } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import topAnime from '../../assets/top_1000_anime.json';
import topManga from '../../assets/top_1000_manga.json';
import topChar from '../../assets/top_1000_char.json';
import { CountUp } from 'use-count-up';

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
  const [scoreContainerColor, setScoreContainerColor] = useState('#007bff');
  const [lastGuessCorrect, setLastGuessCorrect] = useState(null);
  const [lastImagePressed, setLastImagePressed] = useState(null);
  const [gameOverGif, setGameOverGif] = useState(null);
  const [countUpComplete, setCountUpComplete] = useState(false);
  const [showPlusOne, setShowPlusOne] = useState(false);

  const plusOnePosition = useRef(new Animated.Value(0)).current;
  const plusOneOpacity = useRef(new Animated.Value(1)).current;

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

  useEffect(() => {
    const fetchGameOverGif = async () => {
      try {
        const response = await fetch('https://api.otakugifs.xyz/gif?reaction=sad');
        const data = await response.json();
        setGameOverGif(data.url);
      } catch (error) {
        console.error('Failed to fetch game over GIF:', error);
      }
    };

    if (gameOver) {
      fetchGameOverGif();
    }
  }, [gameOver]);

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

    setTimeout(() => {
      if (isHigher === isCorrect) {
        setScore(score + 1);
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
      setCountUpComplete(false);
    }, 2500);
  };

  useEffect(() => {
    if (countUpComplete && lastGuessCorrect) {
      setScoreContainerColor('green');
      setShowPlusOne(true);
  
      Animated.parallel([
        Animated.timing(plusOnePosition, {
          toValue: -30,
          duration: 1250,
          useNativeDriver: true,
        }),
        Animated.timing(plusOneOpacity, {
          toValue: 0,
          duration: 1250,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setShowPlusOne(false);
        plusOnePosition.setValue(0);
        plusOneOpacity.setValue(1);
      });
    } else if (countUpComplete) {
      setScoreContainerColor('red');
    }
  }, [countUpComplete, lastGuessCorrect]);

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
    setCountUpComplete(false);
  };

  if (!currentItem || !nextItem) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      {gameOver ? (
        <View style={styles.gameOverContainer}>
          {gameOverGif && <Image source={{ uri: gameOverGif }} style={{ width: 200, height: 200 }} />}
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
            {showPlusOne && (
              <Animated.Text style={[styles.plusOneText, { transform: [{ translateY: plusOnePosition }], opacity: plusOneOpacity }]}>
                +1
              </Animated.Text>
            )}
          </View>
          <TouchableOpacity
            style={styles.itemContainer}
            onPress={() => !imagePressed && handleGuess(false, 'current')}
          >
            <Image
              source={{ uri: currentItem.image_url }}
              style={styles.itemImage}
            />
            {imagePressed && lastImagePressed === 'current' && countUpComplete && (
              <View style={lastGuessCorrect ? styles.overlayGreen : styles.overlayRed} />
            )}
            <Text style={styles.itemText}>{option === 'Character Favorites' ? currentItem.name : currentItem.title}</Text>
            {showScores && (
              <Text style={styles.scoreTextOverlay}>
                {option.includes('Score') ? (
                  <CountUp
                    isCounting
                    start={Number((currentItem.score * 0.8).toFixed(2))}
                    end={currentItem.score}
                    duration={1}
                    onComplete={() => setCountUpComplete(true)}
                  />
                ) : option.includes('Popularity') ? (
                  <CountUp
                    isCounting
                    end={currentItem.popularity}
                    duration={1.5}
                    onComplete={() => setCountUpComplete(true)}
                  />
                ) : (
                  <CountUp
                    isCounting
                    end={currentItem.favorites}
                    duration={1.5}
                    onComplete={() => setCountUpComplete(true)}
                  />
                )}
              </Text>
            )}
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
            {imagePressed && lastImagePressed === 'next' && countUpComplete && (
              <View style={lastGuessCorrect ? styles.overlayGreen : styles.overlayRed} />
            )}
            <Text style={styles.itemText}>{option === 'Character Favorites' ? nextItem.name : nextItem.title}</Text>
            {showScores && (
              <Text style={styles.scoreTextOverlay}>
                {option.includes('Score') ? (
                  <CountUp
                    isCounting
                    start={Number((nextItem.score * 0.8).toFixed(2))}
                    end={nextItem.score}
                    duration={1}
                    onComplete={() => setCountUpComplete(true)}
                  />
                ) : option.includes('Popularity') ? (
                  <CountUp
                    isCounting
                    end={nextItem.popularity}
                    duration={1.5}
                    onComplete={() => setCountUpComplete(true)}
                  />
                ) : (
                  <CountUp
                    isCounting
                    end={nextItem.favorites}
                    duration={1.5}
                    onComplete={() => setCountUpComplete(true)}
                  />
                )}
              </Text>
            )}
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
    justifyContent: 'center',
    color: '#fff',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 5,
    borderRadius: 5,
  },
  scoreTextOverlay: {
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#fff',
    position: 'absolute',
    bottom: 85,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: 5,
    borderRadius: 5,
  },
  divider: {
    width: '100%',
    height: 4,
    backgroundColor: '#fff',
  },
  scoreContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    width: 60,
    height: 60,
    borderRadius: 40,
    zIndex: 1,
    borderWidth: 2,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  scoreText: {
    fontSize: 24,
    color: '#fff',
  },
  plusOneText: {
    fontSize: 20,
    color: '#fff',
    position: 'absolute',
    top: 20,
    right: -35,
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
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