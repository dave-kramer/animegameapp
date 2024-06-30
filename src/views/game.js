import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
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
  const [gameOver, setGameOver] = useState(false);
  const [showScores, setShowScores] = useState(false);
  const [imagePressed, setImagePressed] = useState(false);
  const [scoreContainerColor, setScoreContainerColor] = useState('#298acd');

  useEffect(() => {
    const initialAnime = getRandomAnime(topAnime);
    setCurrentAnime(initialAnime);
    setNextAnime(getRandomAnime(topAnime, initialAnime.mal_id));
  }, []);

  const handleGuess = (isHigher) => {
    const isCorrect = nextAnime.score > currentAnime.score;

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
      }
      setShowScores(false);
      setImagePressed(false);
      setScoreContainerColor('#298acd');
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
  };

  if (!currentAnime || !nextAnime) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      {gameOver ? (
        <View>
          <Text style={styles.gameOverText}>Game Over! Your score: {score}</Text>
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
            onPress={() => !imagePressed && handleGuess(false)}
          >
            <Image
              source={{ uri: currentAnime.image_url }}
              style={styles.animeImage}
            />
            <Text style={styles.animeText}>{currentAnime.title}</Text>
            {showScores && <Text style={styles.scoreTextOverlay}>Score: {currentAnime.score}</Text>}
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity
            style={styles.animeContainer}
            onPress={() => !imagePressed && handleGuess(true)}
          >
            <Image
              source={{ uri: nextAnime.image_url }}
              style={styles.animeImage}
            />
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
  },
  buttonText: {
    color: '#fff',
    fontSize: 12,
    textAlign: 'center',
  },
  gameOverText: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default Game;
