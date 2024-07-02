import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';

const Menu = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [guessModalVisible, setGuessModalVisible] = useState(false);

  const handleHigherOrLowerPress = () => {
    setModalVisible(true);
  };

  const handleOptionPress = (option) => {
    setModalVisible(false);
    navigation.navigate('Game', { option });
  };

  const handleInformationPress = () => {
    navigation.navigate('Information');
  };

  const handleGuessPress = () => {
    setGuessModalVisible(true);
  };

  const handleGuessOptionPress = (option) => {
    setGuessModalVisible(false);
    navigation.navigate('Guess', { guessType: option });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.menuItem} onPress={handleHigherOrLowerPress}>
        <Text style={styles.menuText}>Higher or Lower</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.menuItem} onPress={handleGuessPress}>
        <Text style={styles.menuText}>Guess the ...</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.menuItem} onPress={handleInformationPress}>
        <Text style={styles.menuText}>Information</Text>
      </TouchableOpacity>

      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Choose an Option</Text>
            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => handleOptionPress('Anime Score')}
            >
              <Text style={styles.modalOptionText}>Anime Score</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => handleOptionPress('Anime Popularity')}
            >
              <Text style={styles.modalOptionText}>Anime Popularity</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => handleOptionPress('Manga Score')}
            >
              <Text style={styles.modalOptionText}>Manga Score</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => handleOptionPress('Manga Popularity')}
            >
              <Text style={styles.modalOptionText}>Manga Popularity</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => handleOptionPress('Character Favorites')}
            >
              <Text style={styles.modalOptionText}>Character Favorites</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        transparent={true}
        visible={guessModalVisible}
        animationType="slide"
        onRequestClose={() => setGuessModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Guess the Character</Text>
            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => handleGuessOptionPress('name')}
            >
              <Text style={styles.modalOptionText}>Name</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => handleGuessOptionPress('nicknames')}
            >
              <Text style={styles.modalOptionText}>Nicknames</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => handleGuessOptionPress('name_kanji')}
            >
              <Text style={styles.modalOptionText}>Name Kanji</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setGuessModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  menuItem: {
    margin: 10,
    padding: 15,
    backgroundColor: '#007bff',
    borderRadius: 5,
  },
  menuText: {
    color: '#fff',
    fontSize: 18,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 20,
  },
  modalOption: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#007bff',
    borderRadius: 5,
  },
  modalOptionText: {
    color: '#fff',
    fontSize: 18,
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#dc3545',
    borderRadius: 5,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default Menu;
