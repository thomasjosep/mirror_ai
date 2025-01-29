import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const ExerciseButtons = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Choose Your Exercise</Text>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Squats</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Push-up</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f7f7f7', // Adjust based on your previous theme
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 32,
    color: '#333', // Adjust based on your previous theme
  },
  button: {
    backgroundColor: '#4CAF50', // Adjust based on your theme
    padding: 16,
    borderRadius: 8,
    marginVertical: 10,
    width: '80%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default ExerciseButtons;
