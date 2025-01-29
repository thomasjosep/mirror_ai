import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import { auth, db } from '../../scripts/firebase'; // Assuming firebase is set up in this path
import { signInWithEmailAndPassword } from 'firebase/auth';
import { getDoc, doc, collection, query, where, getDocs } from 'firebase/firestore';
import { useUser } from '../../context/UserContext'; // Import useUser hook

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();
  const { setUser } = useUser(); // Get setUser from context

  const handleLogin = async () => {
    console.log('Logging in with:', email, password);

    if (!email || !password) {
      Alert.alert('Error', 'Both fields are required');
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Removed redundant auth.signInWithEmailAndPassword call

      // Now check if the email exists in Firestore (optional, for more validation)
      const userQuery = query(collection(db, 'users'),where('email', '==', email));
      const querySnapshot = await getDocs(userQuery);

      if (querySnapshot.empty) {
        Alert.alert('Error', 'No user found with this email in the database.');
        return;
      }

      // If user found, proceed to login successful action
      const userData = querySnapshot.docs[0].data();
      setUser({ email: userData.email, name: userData.name }); // Save user data in context
      Alert.alert('Success', 'Logged in successfully!');
      console.log('User logged in:', email);
      navigation.navigate('index');  // Navigate to the home screen or main page

    } catch (error) {
      Alert.alert('Login Error', (error as any).message);
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Mirror AI</Text>
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
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.signupLink}
        onPress={() => navigation.navigate('signup')}
      >
        <Text style={styles.signupText}>Don't have an account? Sign Up</Text>
      </TouchableOpacity>
    </View>
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
  signupLink: {
    marginTop: 15,
  },
  signupText: {
    color: '#6200ea',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LoginPage;

