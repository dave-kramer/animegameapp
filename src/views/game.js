import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import topAnime from '../../assets/top_1000_anime.json'

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

  useEffect(() => {
    const initialAnime = getRandomAnime(topAnime);
    setCurrentAnime(initialAnime);
    setNextAnime(getRandomAnime(topAnime, initialAnime.mal_id));
  }, []);

  const handleGuess = (isHigher) => {
    const isCorrect = nextAnime.score > currentAnime.score;

    if (isHigher === isCorrect) {
      setScore(score + 1);
      setCurrentAnime(nextAnime);
      setNextAnime(getRandomAnime(topAnime, nextAnime.mal_id));
    } else {
      setGameOver(true);
    }
  };

  const restartGame = () => {
    const initialAnime = getRandomAnime(topAnime);
    setCurrentAnime(initialAnime);
    setNextAnime(getRandomAnime(topAnime, initialAnime.mal_id));
    setScore(0);
    setGameOver(false);
  };

  if (!currentAnime || !nextAnime) {
    return <Text>Loading...</Text>;
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          {gameOver ? (
            <View>
              <Text style={styles.gameOverText}>Game Over! Your score: {score}</Text>
              <TouchableOpacity style={styles.button} onPress={restartGame}>
                <Text style={styles.buttonText}>Play Again</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View>
              <View style={styles.animeContainer}>
                <Text style={styles.animeText}>{currentAnime.title}</Text>
                <TouchableOpacity onPress={() => handleGuess(false)}>
                  <Image
                    source={{ uri: currentAnime.image_url }}
                    style={styles.animeImage}
                  />
                </TouchableOpacity>
                <Text style={styles.scoreText}>Score: {score}</Text>
              </View>
              <View style={styles.animeContainer}>
                <Text style={styles.animeText}>{nextAnime.title}</Text>
                <TouchableOpacity onPress={() => handleGuess(true)}>
                  <Image
                    source={{ uri: nextAnime.image_url }}
                    style={styles.animeImage}
                  />
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  animeContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  animeImage: {
    width: 200,
    height: 300,
    resizeMode: 'cover',
    borderRadius: 10,
  },
  animeText: {
    fontSize: 22,
    textAlign: 'center',
    position: 'absolute',
    top: 100,
    color: '#fff',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 5,
    borderRadius: 5,
    zIndex: 10,
  },
  scoreText: {
    fontSize: 18,
    marginTop: 10,
  },
  button: {
    padding: 15,
    backgroundColor: '#007bff',
    borderRadius: 5,
    marginHorizontal: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
  gameOverText: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default Game;
