import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Score = () => {
    const [scores, setScores] = useState([]);
    const [highScores, setHighScores] = useState({});

    useEffect(() => {
        const fetchScores = async () => {
            try {
                const bestMale = await AsyncStorage.getItem('BestMale');
                const bestFemale = await AsyncStorage.getItem('BestFemale');

                const scoresArray = [];
                if (bestMale) {
                    scoresArray.push({ gender: 'Male', ...JSON.parse(bestMale) });
                }
                if (bestFemale) {
                    scoresArray.push({ gender: 'Female', ...JSON.parse(bestFemale) });
                }

                setScores(scoresArray);

                // Fetch all high scores
                const keys = [
                    'highScore-Anime Popularity',
                    'highScore-Anime Score',
                    'highScore-Character Favorites',
                    'highScore-Manga Popularity',
                    'highScore-Manga Score',
                    'highScore-guess-name',
                    'highScore-guess-name_kanji',
                    'highScore-guess-nicknames',
                ];

                const fetchedHighScores = await AsyncStorage.multiGet(keys);
                const highScoresObj = {};

                fetchedHighScores.forEach(([key, value]) => {
                    highScoresObj[key] = value ? JSON.parse(value) : null;
                });

                setHighScores(highScoresObj);
            } catch (error) {
                console.error('Error fetching scores from local storage:', error);
            }
        };

        fetchScores();
    }, []);

    const renderScoreCard = ({ item }) => (
        <View>
            <Text style={styles.genderTitle}>Best {item.gender}</Text>
            <View style={styles.scoreCard}>
                <Image source={{ uri: item.image_url }} style={styles.characterImage} />
            </View>
            <Text style={styles.name}>{item.name}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Scores</Text>
            <FlatList
                data={scores}
                keyExtractor={(item) => item.gender}
                renderItem={renderScoreCard}
                contentContainerStyle={styles.listContainer}
                horizontal
            />
            <View style={styles.highScoresContainer}>
                <Text style={styles.highScoreTitle}>High Scores</Text>
                {Object.entries(highScores).map(([key, value]) => (
                    value !== null && (
                        <Text key={key} style={styles.highScoreItem}>{`${key.replace('highScore-', '').replace(/_/g, ' ')}: ${value}`}</Text>
                    )
                ))}
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
        marginTop: 20,
    },
    listContainer: {
        flexDirection: 'row',
        marginTop: 20,
    },
    scoreCard: {
        width: 170,
        height: 230,
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
        marginHorizontal: 10,
    },
    genderTitle: {
        fontSize: 18,
        textAlign: 'center',
        fontWeight: 'bold',
        marginBottom: 6,
    },
    characterImage: {
        width: '100%',
        height: '100%',
        borderRadius: 10,
    },
    name: {
        fontSize: 18,
        textAlign: 'center',
        fontWeight: 'bold',
        marginTop: 6,
    },
    highScoresContainer: {
        marginTop: 20,
        alignItems: 'center',
    },
    highScoreTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    highScoreItem: {
        fontSize: 16,
        marginVertical: 5,
    },
});

export default Score;