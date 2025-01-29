import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const explore = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>


      <View style={styles.content}>
        <Text style={styles.title}>Welcome to Mirror AI</Text>
        <TouchableOpacity
          style={styles.getStartedButton}
          onPress={() => navigation.navigate('login')}
        >
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    height: 80,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#6200ea',
  },
  loginButton: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  loginText: {
    color: '#6200ea',
    fontSize: 16,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 50,
    color: '#333',
  },
  getStartedButton: {
    backgroundColor: '#6200ea',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default explore;
