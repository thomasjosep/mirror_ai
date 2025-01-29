import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useLocalSearchParams } from 'expo-router';// Import useRouter for navigation
import { collection, query, where, getDocs, DocumentData, updateDoc, arrayUnion, doc } from 'firebase/firestore';
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

  // Example workout name
  const workoutName = "Selected Workout Name";

  // Random leaderboard data
  const leaderboard = [
    { id: 1, name: "Alice", score: 120 },
    { id: 2, name: "Bob", score: 100 },
    { id: 3, name: "Charlie", score: 95 },
    { id: 4, name: "David", score: 85 },
    { id: 5, name: "Eve", score: 80 },
  ];

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
          setRoomData(roomDoc.data());

          // Add current user to participants array in the room document
          const roomRef = doc(db, 'rooms', roomDoc.id);
          await updateDoc(roomRef, {
            participants: arrayUnion({ name: userName, score: userScore || 0 })
          });

          // Get updated participants data
          const updatedRoomSnapshot = await getDocs(roomQuery);
          const updatedRoomDoc = updatedRoomSnapshot.docs[0];
          setParticipants(updatedRoomDoc.data().participants);
        }
      } catch (error) {
        console.error('Error fetching room data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRoomData();
  }, [roomCode, userScore, user.name]);

  // Navigate back to the Room tab
  const navigateBack = () => {
    router.push('/room'); // Navigate to room.tsx
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
  }
});

export default InRoomTab;
