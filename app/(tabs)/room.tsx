import { useState } from 'react';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Clipboard,
  Alert,
  Modal,
  FlatList,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../scripts/firebase';
import { getAuth } from 'firebase/auth';



const RoomPage = () => {
  const router = useRouter();
  const [currentView, setCurrentView] = useState('main'); // Tracks the current view
  const [roomCode, setRoomCode] = useState('');
  const [copiedMessage, setCopiedMessage] = useState('');
  const [numPersons, setNumPersons] = useState('');
  const [workout, setWorkout] = useState('');
  const [joinRoomCode, setJoinRoomCode] = useState('');
  const [showPersonSuggestions, setShowPersonSuggestions] = useState(false);
  const [showWorkoutSuggestions, setShowWorkoutSuggestions] = useState(false);
  const [workoutSuggestions] = useState(['Push-up', 'Pull-up', 'Squats']);

  const generateRoomCode = async () => {
    if (numPersons && workout) {
      try {
        const auth = getAuth();
        const currentUser = auth.currentUser;

        if (!currentUser) {
          Alert.alert('Error', 'User is not authenticated');
          return;
        }

        // Generate the room code
        const code = `${Math.floor(1000 + Math.random() * 9000)}`;
        setRoomCode(code);
        setCopiedMessage('');
  
        // Add the room data to Firestore
        await addDoc(collection(db, 'rooms'), {
          roomCode: code,
          numPersons: parseInt(numPersons, 10), // Ensure it's an integer
          workout: workout.trim(), // Ensure it's a string
          createdAt: new Date(), // Optional: Add a timestamp
          participants: [], // Add an empty array for future data storage
          creatorId: currentUser.uid, // Add creatorId to identify the creator
        });
  
        Alert.alert('Success', 'Room created and saved in Firebase!');
      } catch (error) {
        console.error('Error creating room:', error);
        Alert.alert('Error', 'Failed to create room. Please try again.');
      }
    } else {
      Alert.alert('Error', 'Please select both number of persons and workout type!');
    }
  };
  

  const copyToClipboard = () => {
    if (roomCode) {
      Clipboard.setString(roomCode);
      setCopiedMessage('Copied to Clipboard!');
      Alert.alert('Success', 'Code copied to clipboard!');
    } else {
      Alert.alert('Error', 'No room code to copy!');
    }
  };

  const renderPersonSuggestions = () => {
    const persons = Array.from({ length: 9 }, (_, i) => (i + 1).toString());
    return (
      <Modal transparent visible={showPersonSuggestions} animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowPersonSuggestions(false)}
            >
              <Text style={styles.closeButtonText}>X</Text>
            </TouchableOpacity>
            <FlatList
              data={persons}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => handlePersonSelection(item)}>
                  <Text style={styles.suggestionItem}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    );
  };

  const handlePersonSelection = (person: React.SetStateAction<string>) => {
    setNumPersons(person);
    setShowPersonSuggestions(false);
  };

  const renderWorkoutSuggestions = () => (
    <Modal transparent visible={showWorkoutSuggestions} animationType="fade">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setShowWorkoutSuggestions(false)}
          >
            <Text style={styles.closeButtonText}>X</Text>
          </TouchableOpacity>
          {workoutSuggestions.map((item) => (
            <TouchableOpacity key={item} onPress={() => handleWorkoutSelection(item)}>
              <Text style={styles.suggestionItem}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </Modal>
  );

  const handleWorkoutSelection = (workoutType: React.SetStateAction<string>) => {
    setWorkout(workoutType);
    setShowWorkoutSuggestions(false);
  };

  const validateJoinRoomCode = async () => {
    if (joinRoomCode.trim() === '') {
      Alert.alert('Error', 'Please enter a valid room code!');
      return;
    }
  
    try {
      const q = query(collection(db, 'rooms'), where('roomCode', '==', joinRoomCode.trim()));
      const querySnapshot = await getDocs(q);
  
      if (querySnapshot.empty) {
        Alert.alert('Error', 'Invalid room code!');
      } else {
        const roomData = querySnapshot.docs[0].data();
        if (roomData.participants.length >= roomData.numPersons) {
          Alert.alert('Error', 'Room is full!');
        } else {
          Alert.alert('Success', `You have joined room: ${joinRoomCode}`);
          router.push({ pathname: '/inroom', params: { roomCode: joinRoomCode } });
        }
      }
    } catch (error) {
      console.error('Error validating room code:', error);
      Alert.alert('Error', 'Failed to validate room code. Please try again.');
    }
  };

  return (
    <LinearGradient colors={['#FFFFFF', '#87CEEB']} style={styles.container}>
      {currentView === 'main' && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => setCurrentView('createRoom')}
          >
            <Text style={styles.buttonText}>Create Room</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => setCurrentView('joinRoom')}
          >
            <Text style={styles.buttonText}>Join Room</Text>
          </TouchableOpacity>
        </View>
      )}

      {currentView === 'createRoom' && (
        <>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setCurrentView('main')}
          >
            <Text style={styles.backButtonText}>{'< Back'}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.inputBox}
            onPress={() => setShowPersonSuggestions(true)}
          >
            <Text style={styles.inputText}>
              {numPersons || 'Select Number of Persons'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.inputBox}
            onPress={() => setShowWorkoutSuggestions(true)}
          >
            <Text style={styles.inputText}>{workout || 'Select Workout'}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={generateRoomCode}>
            <Text style={styles.buttonText}>Create Room Code</Text>
          </TouchableOpacity>

          {roomCode !== '' && (
            <View style={styles.codeContainer}>
              <Text style={styles.arrow}>↓</Text>
              <Text style={styles.roomCodeText}>Room Code: {roomCode}</Text>

              <TouchableOpacity style={styles.copyButton} onPress={copyToClipboard}>
                <Text style={styles.copyButtonText}>Copy Code</Text>
              </TouchableOpacity>

              {copiedMessage !== '' && (
                <>
                  <Text style={styles.copiedMessage}>{copiedMessage}</Text>
                  <TouchableOpacity
                    style={styles.enterRoomButton}
                    onPress={() =>
                      router.push({
                        pathname: '/inroom',
                        params: { workout, roomCode },
                      })
                    }
                  >
                    <Text style={styles.enterRoomButtonText}>Enter Room</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          )}

          {renderPersonSuggestions()}
          {renderWorkoutSuggestions()}
        </>
      )}

      {currentView === 'joinRoom' && (
        <>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setCurrentView('main')}
          >
            <Text style={styles.backButtonText}>{'< Back'}</Text>
          </TouchableOpacity>

          <Text style={styles.inputPrompt}>Enter Room Code:</Text>
          <TextInput
            style={styles.inputField}
            placeholder="Room Code"
            placeholderTextColor="#888"
            value={joinRoomCode}
            onChangeText={setJoinRoomCode}
          />

          <TouchableOpacity style={styles.button} onPress={validateJoinRoomCode}>
            <Text style={styles.buttonText}>Join Room</Text>
          </TouchableOpacity>
        </>
      )}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    backgroundColor: '#4169E1',
    padding: 10,
    borderRadius: 10,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  inputBox: {
    width: '80%',
    backgroundColor: '#008',
    borderRadius: 8,
    padding: 10,
    marginVertical: 10,
  },
  inputText: {
    color: '#fff',
    fontSize: 18,
  },
  inputPrompt: {
    color: '#333',
    fontSize: 18,
    marginBottom: 10,
  },
  inputField: {
    width: '80%',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    marginBottom: 20,
    color: '#000',
  },
  button: {
    backgroundColor: '#4169E1',
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  codeContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  arrow: {
    fontSize: 24,
    color: '#fff',
    marginBottom: 10,
  },
  roomCodeText: {
    fontSize: 20,
    color: '#110',
  },
  copyButton: {
    backgroundColor: '#444',
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
  },
  copyButtonText: {
    color: '#fff',
  },
  copiedMessage: {
    color: '#32CD32',
    fontSize: 14,
    marginVertical: 5,
  },
  enterRoomButton: {
    backgroundColor: '#32CD32',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  enterRoomButtonText: {
    color: '#fff',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#121212',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  suggestionItem: {
    color: '#fff',
    fontSize: 18,
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#444',
  },
  closeButton: {
    alignSelf: 'flex-end',
    backgroundColor: '#444',
    borderRadius: 15,
    padding: 5,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default RoomPage;
