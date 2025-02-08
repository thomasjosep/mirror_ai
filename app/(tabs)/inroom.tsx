import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useLocalSearchParams } from 'expo-router';// Import useRouter for navigation
import { collection, query, where, getDocs, DocumentData, updateDoc, arrayUnion, doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../scripts/firebase';
import { getAuth } from 'firebase/auth';
import { useUser } from '../../context/UserContext'; // Import useUser hook

const InRoomTab = () => {
  const router = useRouter(); // Initialize router for navigation
  const { roomCode, userScore } = useLocalSearchParams();
  const [roomData, setRoomData] = useState<DocumentData | null>(null);
  const [participants, setParticipants] = useState<Array<{ id: number; [key: string]: any }>>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser(); // Get user data from context
  const [isCreator, setIsCreator] = useState(false);
  const [roomEnded, setRoomEnded] = useState(false);

  useEffect(() => {
    const fetchRoomData = async () => {
      if (!roomCode) {
        console.error('Room code is undefined');
        setLoading(false);
        return;
      }

      try {
        const auth = getAuth();
        const currentUser = auth.currentUser;

        if (!currentUser) {
          console.error('User is not authenticated');
          setLoading(false);
          return;
        }

        const userName = user.name || 'Anonymous';

        // Get room data
        const roomQuery = query(
          collection(db, 'rooms'),
          where('roomCode', '==', roomCode)
        );
        const roomSnapshot = await getDocs(roomQuery);
        
        if (!roomSnapshot.empty) {
          const roomDoc = roomSnapshot.docs[0];
          const roomData = roomDoc.data();
          roomData.id = roomDoc.id; // Ensure the id is set
          setRoomData(roomData);

          // Check if the current user is the creator of the room
          if (roomData.creatorId === currentUser.uid) {
            setIsCreator(true);
          }

          // Add current user to participants array in the room document
          const roomRef = doc(db, 'rooms', roomDoc.id);
          await updateDoc(roomRef, {
            participants: arrayUnion({ name: userName, score: userScore || 0 })
          });

          // Listen for real-time updates to the participants
          onSnapshot(roomRef, (doc) => {
            const updatedRoomData = doc.data();
            if (updatedRoomData) {
              setParticipants(updatedRoomData.participants);
            }
          });
        }
      } catch (error) {
        console.error('Error fetching room data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRoomData();
  }, [roomCode, userScore, user.name]);

  const exitRoom = async () => {
    if (!roomData || !roomData.id) return;

    try {
      const roomRef = doc(db, 'rooms', roomData.id);
      await updateDoc(roomRef, {
        participants: []
      });

      Alert.alert('Room Closed', 'The room has been closed by the creator.');
      router.push('/room'); // Navigate to room.tsx
    } catch (error) {
      console.error('Error exiting room:', error);
    }
  };

  const endRoom = async () => {
    if (!roomData || !roomData.id) return;

    try {
      const roomRef = doc(db, 'rooms', roomData.id);
      await updateDoc(roomRef, {
        participants: []
      });

      Alert.alert('Room Ended', 'The room has been ended by the creator.');
      router.push('/room'); // Navigate to room.tsx
    } catch (error) {
      console.error('Error ending room:', error);
    }
  };

  useEffect(() => {
    const checkRoomStatus = async () => {
      if (!roomCode || roomEnded) return;

      try {
        const roomQuery = query(
          collection(db, 'rooms'),
          where('roomCode', '==', roomCode)
        );
        const roomSnapshot = await getDocs(roomQuery);

        if (!roomSnapshot.empty) {
          const roomDoc = roomSnapshot.docs[0];
          const roomData = roomDoc.data();

          if (roomData.participants.length === 0) {
            setRoomEnded(true);
            Alert.alert('Room Ended', 'The room has been ended by the creator.');
            router.push('/room'); // Navigate to room.tsx
          }
        }
      } catch (error) {
        console.error('Error checking room status:', error);
      }
    };

    const interval = setInterval(checkRoomStatus, 5000); // Check every 5 seconds

    return () => clearInterval(interval);
  }, [roomCode, roomEnded]);

  // Navigate back to the Room tab
  const navigateBack = () => {
    router.push('/room'); // Navigate to room.tsx
  };

  const startWorkout = () => {
    Alert.alert('Workout Started', 'The workout has been started!');
    // Add any additional logic for starting the workout here
  };

  return (
    <View style={styles.mainContainer}>
      <LinearGradient
        colors={['#FFFFFF', '#87CEEB']}
        style={styles.gradientContainer}
      >
        <TouchableOpacity style={styles.backButton} onPress={navigateBack}>
          <Text style={styles.backButtonText}>{"< Back"}</Text>
        </TouchableOpacity>

        {isCreator && (
          <>
            <TouchableOpacity style={styles.exitButton} onPress={exitRoom}>
              <Text style={styles.exitButtonText}>Exit Room</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.endButton} onPress={endRoom}>
              <Text style={styles.endButtonText}>End Room</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.startButton} onPress={startWorkout}>
              <Text style={styles.startButtonText}>START WORKOUT</Text>
            </TouchableOpacity>
          </>
        )}

        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>
            {roomData ? roomData.workout : 'Loading...'}
          </Text>
          <Text style={styles.roomCodeText}>Room: {roomCode}</Text>
        </View>

        <ScrollView style={styles.leaderboardContainer}>
          <View style={styles.leaderboardHeader}>
            <Text style={[styles.leaderboardText, styles.headerCol]}>S.No</Text>
            <Text style={[styles.leaderboardText, styles.headerCol]}>Name</Text>
            <Text style={[styles.leaderboardText, styles.headerCol]}>Score</Text>
          </View>
          
          {loading ? (
            <Text style={styles.loadingText}>Loading participants...</Text>
          ) : participants.length > 0 ? (
            participants.map((person, index) => (
              <View key={index} style={styles.leaderboardRow}>
                <Text style={[styles.leaderboardText, styles.rowCol]}>{index + 1}</Text>
                <Text style={[styles.leaderboardText, styles.rowCol]}>{person.name}</Text>
                <Text style={[styles.leaderboardText, styles.rowCol]}>{person.score || 0}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.noDataText}>No participants yet</Text>
          )}
        </ScrollView>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  gradientContainer: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    backgroundColor: '#4169E1', // Royal blue for back button
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
  },
  backButtonText: {
    color: '#fff', // White text
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  headerContainer: {
    marginVertical: 70,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#4169E1', // Royal blue for header
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
  },
  headerText: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  leaderboardContainer: {
    width: '100%',
    marginTop: 10,
  },
  leaderboardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#4169E1', // Royal blue for header row
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 10,
  },
  leaderboardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#F0F8FF', // Light background for rows
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  leaderboardText: {
    fontSize: 16,
    fontWeight: '600',
  },
  headerCol: {
    color: '#fff',
    textAlign: 'center',
    flex: 1,
  },
  rowCol: {
    textAlign: 'center',
    flex: 1,
  },
  roomCodeText: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
    textAlign: 'center',
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#666',
  },
  noDataText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#666',
  },
  exitButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    backgroundColor: '#FF6347', // Tomato color for exit button
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
  },
  exitButtonText: {
    color: '#fff', // White text
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  endButton: {
    position: 'absolute',
    top: 40,
    right: 100,
    backgroundColor: '#FF4500', // Orange red color for end button
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
  },
  endButtonText: {
    color: '#fff', // White text
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  startButton: {
    position: 'absolute',
    top: 40,
    right: 180,
    backgroundColor: '#32CD32', // Lime green color for start button
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
  },
  startButtonText: {
    color: '#fff', // White text
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default InRoomTab;
