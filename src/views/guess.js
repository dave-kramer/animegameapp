import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import characters from '../../assets/top_1000_char.json';

const getRandomCharacters = (num, guessType) => {
    let filteredCharacters = characters;

    if (guessType === 'nicknames') {
        filteredCharacters = characters.filter(character => (
            character.nicknames && character.nicknames.length > 0
        ));
    }

    const shuffled = filteredCharacters.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, num);
};

const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};

const Guess = ({ route }) => {
    const { guessType } = route.params;
    const [currentCharacter, setCurrentCharacter] = useState(null);
    const [options, setOptions] = useState([]);
    const [currentScore, setCurrentScore] = useState(0);
    const [highScore, setHighScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);

    useEffect(() => {
        loadHighScore();
        loadNewCharacter();
    }, []);

    const loadHighScore = async () => {
        try {
            const savedHighScore = await AsyncStorage.getItem(`highScore-guess-${guessType}`);
            if (savedHighScore !== null) {
                setHighScore(parseInt(savedHighScore, 10));
            }
        } catch (error) {
            console.error('Failed to load high score:', error);
        }
    };

    const loadNewCharacter = () => {
        const randomCharacters = getRandomCharacters(4, guessType);
        setCurrentCharacter(randomCharacters[0]);
        setOptions(shuffleArray(randomCharacters));
    };

    const handleGuess = (selectedCharacter) => {
        let correctAnswer;

        if (guessType === 'name') {
            correctAnswer = currentCharacter.name;
        } else if (guessType === 'nicknames') {
            // Choose a random nickname from the current character's list
            const randomIndex = Math.floor(Math.random() * currentCharacter.nicknames.length);
            correctAnswer = currentCharacter.nicknames[randomIndex];
        } else {
            correctAnswer = currentCharacter.name_kanji;
        }

        if (
            guessType === 'nicknames'
                ? selectedCharacter.nicknames.includes(correctAnswer)
                : selectedCharacter[guessType] === correctAnswer
        ) {
            setCurrentScore(currentScore + 1);
            loadNewCharacter();
        } else {
            handleGameOver();
        }
    };


    const handleGameOver = async () => {
        if (currentScore > highScore) {
            setHighScore(currentScore);
            try {
                await AsyncStorage.setItem(`highScore-guess-${guessType}`, currentScore.toString());
            } catch (error) {
                console.error('Failed to save high score:', error);
            }
        }
        setGameOver(true);
    };

    const restartGame = () => {
        setCurrentScore(0);
        setGameOver(false);
        loadNewCharacter();
    };

    if (gameOver) {
        return (
            <View style={styles.gameOverContainer}>
                <Text style={styles.gameOverText}>Game Over!</Text>
                <Text style={styles.gameOverText}>Your score: {currentScore}</Text>
                <Text style={styles.gameOverText}>High Score: {highScore}</Text>
                <TouchableOpacity style={styles.button} onPress={restartGame}>
                    <Text style={styles.buttonText}>Play Again</Text>
                </TouchableOpacity>
            </View>
        );
    }

    if (!currentCharacter) return null;

    return (
        <View style={styles.container}>
            <Image source={{ uri: currentCharacter.image_url }} style={styles.characterImage} />
            <View style={styles.optionsContainer}>
                {options.map((option) => (
                    <TouchableOpacity
                        key={option.mal_id}
                        style={styles.optionButton}
                        onPress={() => handleGuess(option)}
                    >
                        <Text style={styles.optionText}>
                            {guessType === 'name' && option.name}
                            {guessType === 'nicknames' && (
                                <>
                                    {option.nicknames.length > 0 && option.nicknames[Math.floor(Math.random() * option.nicknames.length)]}
                                </>
                            )}
                            {guessType === 'name_kanji' && option.name_kanji}
                        </Text>
                    </TouchableOpacity>
                ))}

            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8f8f8',
    },
    characterImage: {
        width: 200,
        height: 300,
        marginBottom: 20,
    },
    optionsContainer: {
        width: '80%',
    },
    optionButton: {
        padding: 15,
        marginVertical: 10,
        backgroundColor: '#007bff',
        borderRadius: 5,
        alignItems: 'center',
    },
    optionText: {
        color: '#fff',
        fontSize: 18,
    },
    gameOverContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8f8f8',
    },
    gameOverText: {
        fontSize: 24,
        marginBottom: 20,
    },
    button: {
        padding: 15,
        backgroundColor: '#007bff',
        borderRadius: 5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
    },
});

export default Guess;