import { useRef, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { signOut } from 'firebase/auth';
import { auth } from '../../scripts/firebase';

const Dashboard = () => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const navigation = useNavigation();

  // Sample avatar URL - replace with actual user avatar
  const [avatarUrl, setAvatarUrl] = useState(null);

  useEffect(() => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.05,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          }),
        ])
      ),
    ]).start();
  }, []);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const handleLogout = () => {
    console.log('Logging out...');
    signOut(auth);
  };

  const navigateToProfile = () => {
    navigation.navigate('profile'); // Navigate to Profile screen
  };

  return (
    <LinearGradient
      colors={['#1E1E2E', '#2D2D44', '#363654']}
      style={styles.container}
    >
      {/* Header Section */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.profileSection} onPress={navigateToProfile}>
          <View style={styles.avatarContainer}>
            {avatarUrl ? (
              <Image source={{ uri: avatarUrl }} style={styles.avatar} />
            ) : (
              <View style={styles.profileIcon}>
                <Ionicons name="person-circle" size={40} color="#E0E7FF" />
              </View>
            )}
          </View>
          <Text style={styles.welcomeText}>Welcome back!</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color="#E0E7FF" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Main Content - Workout Options */}
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        {/* Quick Workout */}
        <Animated.View style={[{ transform: [{ scale: scaleAnim }] }, styles.optionContainer]}>
          <TouchableOpacity
            style={styles.workoutOption}
            onPress={() => navigation.navigate('quick-workout')}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
          >
            <LinearGradient
              colors={['#4A90E2', '#357ABD']}
              style={styles.gradientOption}
            >
              <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                <Ionicons name="flash" size={32} color="#fff" />
              </Animated.View>
              <Text style={styles.optionTitle}>Quick Workout</Text>
              <Text style={styles.optionDescription}>
                Start an instant personalized workout session
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

        {/* Collaborative Workout */}
        <Animated.View style={[{ transform: [{ scale: scaleAnim }] }, styles.optionContainer]}>
          <TouchableOpacity
            style={styles.workoutOption}
            onPress={() => navigation.navigate('room')} // Navigate to Room screen
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
          >
            <LinearGradient
              colors={['#7B61FF', '#5B41FF']}
              style={styles.gradientOption}
            >
              <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                <Ionicons name="people" size={32} color="#fff" />
              </Animated.View>
              <Text style={styles.optionTitle}>Collaborative Workout</Text>
              <Text style={styles.optionDescription}>
                Train together with friends or join community workouts
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
    paddingTop: 40,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    marginRight: 10,
    borderRadius: 25,
    overflow: 'hidden',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  profileIcon: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeText: {
    color: '#E0E7FF',
    fontSize: 18,
    fontWeight: '600',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  logoutText: {
    color: '#E0E7FF',
    marginLeft: 5,
    fontSize: 14,
  },
  content: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    gap: 20,
  },
  optionContainer: {
    height: 160,
  },
  workoutOption: {
    flex: 1,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
  gradientOption: {
    flex: 1,
    padding: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 12,
    textAlign: 'center',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  optionDescription: {
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 20,
  },
});

export default Dashboard;
