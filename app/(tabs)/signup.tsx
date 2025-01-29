import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView, Alert, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { auth, db } from '../../scripts/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { createUserWithEmailAndPassword } from 'firebase/auth';

const SignupPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profile, setProfile] = useState({
      name: '',
      height: '',
      weight: '',
      age: '',
      experience: '',
      goldTrophies: null,
      silverTrophies: null,
    });
  const [loading, setLoading] = useState(false);  // State for loading
  const navigation = useNavigation();

  const handleSignup = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'All fields are required');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    try {
      setLoading(true);  // Start loading
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const userId = userCredential.user.uid;

      await addDoc(collection(db, 'users'), {
        name: name,
        email: email,
        userId: userId,
        profile: profile,
        
      });

      Alert.alert('Success', 'Account created successfully!');
      console.log('User created:', name, email);
      navigation.navigate('index');  // Navigate to the home screen or main page
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      Alert.alert('Signup Error', errorMessage);
      console.error(error);
    } finally {
      setLoading(false);  // Stop loading after the operation
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Create an Account</Text>
      <View style={styles.inputContainer}>
        <Icon name="user" size={20} color="#666" style={styles.icon} />
        <TextInput
          placeholder="Name"
          style={styles.input}
          value={name}
          onChangeText={setName}
        />
      </View>
      <View style={styles.inputContainer}>
        <Icon name="envelope" size={20} color="#666" style={styles.icon} />
        <TextInput
          placeholder="Email"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
        />
      </View>
      <View style={styles.inputContainer}>
        <Icon name="lock" size={20} color="#666" style={styles.icon} />
        <TextInput
          placeholder="Password"
          secureTextEntry
          style={styles.input}
          value={password}
          onChangeText={setPassword}
        />
      </View>
      <View style={styles.inputContainer}>
        <Icon name="lock" size={20} color="#666" style={styles.icon} />
        <TextInput
          placeholder="Confirm Password"
          secureTextEntry
          style={styles.input}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
      </View>

      {/* Display loader when loading is true */}
      {loading ? (
        <ActivityIndicator size="large" color="#6200ea" />
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleSignup}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 10,
    paddingVertical: 8,
    width: '100%',
    elevation: 3,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  button: {
    backgroundColor: '#6200ea',
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default SignupPage;
