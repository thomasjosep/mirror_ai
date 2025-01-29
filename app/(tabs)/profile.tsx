import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { getDoc, setDoc, doc,updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db} from '../../scripts/firebase';
const Profile = () => {
  const [isFirstLogin, setIsFirstLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState({
    name: '',
    height: '',
    weight: '',
    age: '',
    experience: '',
    goldTrophies: null,
    silverTrophies: null,
  });
  console.log('userid',auth.currentUser?.uid);

  useEffect(() => {
    checkExistingProfile();
  }, []);

  const checkExistingProfile = async () => {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) {
        setIsLoading(false);
        return;
      }

      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        // Specifically check if age exists and is not empty
        if (userData.profile?.age && userData.profile.age !== '') {
          setProfile(userData.profile);
          setIsFirstLogin(false);
        } else {
          // If no age, ensure we show the form
          setIsFirstLogin(true);
        }
      }
    } catch (error) {
      console.error('Error checking profile:', error);
      Alert.alert('Error', 'Failed to load profile data');
    } finally {
      setIsLoading(false);
    }
  };

  interface Profile {
    name: string;
    height: string;
    weight: string;
    age: string;
    experience: string;
    goldTrophies: number | null;
    silverTrophies: number | null;
  }

  const updateUserProfile = async (userId: string, newProfileData: Profile): Promise<boolean> => {
    try {
      // Query to find the user document with matching userId
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where("userId", "==", userId));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        throw new Error('User not found');
      }

      // Get the document reference and update only the profile field
      const userDocRef = querySnapshot.docs[0].ref;
      await updateDoc(userDocRef, {
        profile: newProfileData
      });

      return true;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  const handleSubmit = async () => {

    try {
      const userId = auth.currentUser?.uid;
      if (!userId) {
        Alert.alert('Error', 'User not authenticated');
        return;
      }

      // Convert age to number and prepare profile data

      // Save to Firestore
      await updateUserProfile(userId, profile);

      setIsFirstLogin(false);
      Alert.alert('Success', 'Profile saved successfully');
    } catch (error) {
      console.error('Error saving profile:', error);
      Alert.alert('Error', 'Failed to save profile data');
    }
  };
  if (isFirstLogin) {
    return (
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.container}
        >
          <ScrollView style={styles.formContainer}>
            <View style={styles.formInner}>
              <Text style={styles.formLabel}>Name</Text>
              <TextInput
                style={styles.input}
                value={profile.name}
                onChangeText={(text) => setProfile({...profile, name: text})}
                placeholder="Enter your name"
              />

              <View style={styles.row}>
                <View style={styles.halfWidth}>
                  <Text style={styles.formLabel}>Height (cm)</Text>
                  <TextInput
                    style={styles.input}
                    value={profile.height}
                    onChangeText={(text) => setProfile({...profile, height: text})}
                    placeholder="Height"
                    keyboardType="numeric"
                  />
                </View>
                <View style={styles.halfWidth}>
                  <Text style={styles.formLabel}>Weight (kg)</Text>
                  <TextInput
                    style={styles.input}
                    value={profile.weight}
                    onChangeText={(text) => setProfile({...profile, weight: text})}
                    placeholder="Weight"
                    keyboardType="numeric"
                  />
                </View>
              </View>

              <View style={styles.row}>
                <View style={styles.halfWidth}>
                  <Text style={styles.formLabel}>Age</Text>
                  <TextInput
                    style={styles.input}
                    value={profile.age}
                    onChangeText={(text) => setProfile({...profile, age: text})}
                    placeholder="Age"
                    keyboardType="numeric"
                  />
                </View>
                <View style={styles.halfWidth}>
                  <Text style={styles.formLabel}>Experience Level</Text>
                  <TextInput
                    style={styles.input}
                    value={profile.experience}
                    onChangeText={(text) => setProfile({...profile, experience: text})}
                    placeholder="Experience"
                  />
                </View>
              </View>

              <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                <Text style={styles.submitButtonText}>Save Profile</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <View style={styles.profileInfo}>
            <Image
              source={{ uri: 'https://via.placeholder.com/64' }}
              style={styles.avatar}
            />
            <Text style={styles.name}>{profile.name}</Text>
          </View>
          <TouchableOpacity style={styles.editButton}>
            <Icon name="edit-2" size={24} color="#000" />
          </TouchableOpacity>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Height</Text>
            <Text style={styles.statValue}>{profile.height} cm</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Weight</Text>
            <Text style={styles.statValue}>{profile.weight} kg</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Age</Text>
            <Text style={styles.statValue}>{profile.age} years</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Experience</Text>
            <Text style={styles.statValue}>{profile.experience}</Text>
          </View>
        </View>

        <View style={styles.trophiesContainer}>
          <View style={styles.trophyBox}>
            <Icon name="award" size={48} color="#FFD700" />
            <Text style={styles.trophyLabel}>Gold</Text>
            <Text style={styles.trophyCount}>{profile.goldTrophies ?? '--'}</Text>
          </View>
          <View style={styles.trophyBox}>
            <Icon name="award" size={48} color="#C0C0C0" />
            <Text style={styles.trophyLabel}>Silver</Text>
            <Text style={styles.trophyCount}>{profile.silverTrophies ?? '--'}</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  formContainer: {
    flex: 1,
    padding: 16,
  },
  formInner: {
    padding: 16,
  },
  formLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  halfWidth: {
    flex: 1,
  },
  submitButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  editButton: {
    padding: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 16,
  },
  statCard: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 16,
    width: '47%',
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 16,
  },
  trophiesContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 32,
    padding: 16,
  },
  trophyBox: {
    alignItems: 'center',
  },
  trophyLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8,
  },
  trophyCount: {
    fontSize: 16,
    marginTop: 4,
  },
});

export default Profile;