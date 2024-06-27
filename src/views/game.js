import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

const topAnime = [{
    "mal_id": 52991,
    "image_url": "https://cdn.myanimelist.net/images/anime/1015/138006.webp",
    "title": "Sousou no Frieren",
    "type": "TV",
    "score": 9.35,
    "popularity": 247
},
{
    "mal_id": 5114,
    "image_url": "https://cdn.myanimelist.net/images/anime/1208/94745.webp",
    "title": "Fullmetal Alchemist: Brotherhood",
    "type": "TV",
    "score": 9.09,
    "popularity": 3
},
{
    "mal_id": 9253,
    "image_url": "https://cdn.myanimelist.net/images/anime/1935/127974.webp",
    "title": "Steins;Gate",
    "type": "TV",
    "score": 9.07,
    "popularity": 13
},
{
    "mal_id": 28977,
    "image_url": "https://cdn.myanimelist.net/images/anime/3/72078.webp",
    "title": "Gintama\u00b0",
    "type": "TV",
    "score": 9.06,
    "popularity": 342
},
{
    "mal_id": 38524,
    "image_url": "https://cdn.myanimelist.net/images/anime/1517/100633.webp",
    "title": "Shingeki no Kyojin Season 3 Part 2",
    "type": "TV",
    "score": 9.05,
    "popularity": 21
}]

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

  const handleGuess = (guess) => {
    const isHigher = nextAnime.score > currentAnime.score;

    if ((guess === 'higher' && isHigher) || (guess === 'lower' && !isHigher)) {
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
                <Image
                  source={{ uri: currentAnime.image_url }}
                  style={styles.animeImage}
                />
                <Text style={styles.scoreText}>Score: {score}</Text>
              </View>
              <View style={styles.buttonsContainer}>
                <TouchableOpacity style={styles.button} onPress={() => handleGuess('higher')}>
                  <Text style={styles.buttonText}>Higher</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => handleGuess('lower')}>
                  <Text style={styles.buttonText}>Lower</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.animeContainer}>
                <Text style={styles.animeText}>{nextAnime.title}</Text>
                <Image
                  source={{ uri: nextAnime.image_url }}
                  style={styles.animeImage}
                />
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
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginVertical: 20,
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
  },
});

export default Game;
