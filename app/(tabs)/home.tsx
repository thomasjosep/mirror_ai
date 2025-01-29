//



{/*
  //------------------------------ OLD DESIGN -----------------------
import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, ImageBackground, Dimensions, Modal, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { db } from '../../scripts/firebase';
import { collection, getDocs, query, where, } from 'firebase/firestore';
import { useUser } from '../../context/UserContext';
import Loader from '@/components/Loader';
//----------------------------------------------------------------------------------------------------------------------------  ------

const { width } = Dimensions.get('window');

//--------------------------------- I M A G E AND E V E N T C A R O U S E L ------------------------------------------------------
const eventData = [
  { id: 1, title: "Community Meeting", time: "2:00 PM", date: "May 15, 2023" },
  { id: 2, title: "Marraige Funciton", time: "4:30 PM", date: "May 18, 2023" },
  { id: 3, title: "Maintenance Check", time: "10:00 AM", date: "May 20, 2023" },
  { id: 4, title: "Retirement Party", time: "7:00 PM", date: "May 22, 2023" },
  { id: 5, title: "Emergency Response Training", time: "9:00 AM", date: "May 25, 2023" },
];

const optionsData = [
  { id: 1, title: "Add People", icon: "person-add", route: 'addpeople' },
  { id: 2, title: "Emergency", icon: "alert-circle", route: 'Emergency' },
  { id: 3, title: "Reports", icon: "document-text", route: 'reports' },
  { id: 4, title: "Guest Access", icon: "people", route: 'guest' },
  { id: 5, title: "Chat", icon: "chatbubbles", route: 'chat' },
  { id: 6, title: "Add Event", icon: "calendar", route: 'addevent' },
  { id: 7, title: "Parcel Request", icon: "cube", route: 'parcel' },
  { id: 8, title: "Other Facility", icon: "business", route: 'facility' },
  { id: 9, title: "RFID req", icon: "scan", route: 'rfid' },
  { id: 10, title: "Maintenance", icon: "hammer", route: 'maintenance' },
  { id: 11, title: "Complaint", icon: "warning", route: 'complaint' },
  { id: 12, title: "Settings", icon: "settings", route: 'settings' },
];

const carouselImages = [
  require('../../assets/images/zut.jpg'),
  require('../../assets/images/ai.jpg'),
  require('../../assets/images/hack.jpg'),
];

//-------------------------------------------------------------------------------------------------------------------------------
const HomePage = () => {
  const [currentEvent, setCurrentEvent] = useState(eventData[0]);
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(50)).current;
  const [userData,setUserData] = useState(null);
  const { user } = useUser(); 
  
  //console.log('User Data:', user);

  
  

  
  useEffect(() => {
    const eventInterval = setInterval(() => {
      setCurrentEvent((prevEvent) => {
        const nextIndex = (eventData.findIndex(e => e.id === prevEvent.id) + 1) % eventData.length;
        return eventData[nextIndex];
      });
    }, 5000);

    const imageInterval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % carouselImages.length);
    }, 5000);

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(translateY, {
        toValue: 0,
        speed: 1,
        bounciness: 8,
        useNativeDriver: true,
      }),
    ]).start();

    return () => {
      clearInterval(eventInterval);
      clearInterval(imageInterval);
    };
  }, []);

  const [fontsLoaded] = useFonts({
    'Poppins-Regular': require('../../assets/fonts/Poppins-Regular.ttf'),
    'Poppins-Bold': require('../../assets/fonts/Poppins-Bold.ttf'),
    'Poppins-Medium': require('../../assets/fonts/Poppins-Regular.ttf'),
  });


  // -------------------------------- I M A G E  C A R O U S E L -------------------------------------
  const renderHeader = () => (
    <ImageBackground
      source={carouselImages[currentImageIndex]}
      style={styles.header}
    >
      <LinearGradient
        colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.8)']}
        style={styles.headerGradient}
      >
        <TouchableOpacity style={styles.bellIcon}>
          <MaterialCommunityIcons name="bell" size={24} color="#F4F3F2" />
        </TouchableOpacity>
       
        <Text style={styles.headerTitle}>Welcome Back</Text>
        <Text style={styles.headerSubtitle}>{user?.fullName}</Text>
      </LinearGradient>
    </ImageBackground>
  );

  // -------------------------------- E V E N T  L O G I C ------------------------------------
  const renderEventCard = () => (
    <Animated.View style={[styles.eventCard, { opacity: fadeAnim, transform: [{ translateY }] }]}>
      <View style={styles.eventCardHeader}>
        <Text style={styles.eventCardTitle}>Upcoming Event</Text>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Text style={styles.viewAllText}>View All</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.eventDetails}>
        <MaterialCommunityIcons name="calendar-clock" size={24} color="#D27B72" style={styles.eventIcon} />
        <View>
          <Text style={styles.eventCardInfo}>{currentEvent.title}</Text>
          <Text style={styles.eventCardTime}>{currentEvent.time} - {currentEvent.date}</Text>
        </View>
      </View>
    </Animated.View>
  );

  const renderQuickActions = () => (
    <Animated.View style={[styles.quickActions, { opacity: fadeAnim, transform: [{ translateY }] }]}>
      <Text style={styles.quickActionsTitle}>Quick Actions</Text>
      <View style={styles.quickActionsGrid}>
        {optionsData.map((option) => (
          <TouchableOpacity
            key={option.id}
            style={styles.quickActionItem}
            onPress={() => navigation.navigate(option.route)}
          >
            <LinearGradient
                 colors={['#D27B72', '#7C7C7C']}
              style={styles.quickActionIconContainer}
            >
              <Ionicons name={option.icon} size={24} color="#fff" />
            </LinearGradient>
            <Text style={styles.quickActionText}>{option.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </Animated.View>
  );

  //----------------------L I S T  E  V E N T ------------------------
  const renderEventModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>All Events</Text>
          {eventData.map((event) => (
            <View key={event.id} style={styles.modalEventItem}>
              <Text style={styles.modalEventTitle}>{event.title}</Text>
              <Text style={styles.modalEventTime}>{event.time} - {event.date}</Text>
            </View>
          ))}
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setModalVisible(false)}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  if (!user) {
    return <Loader/>
  }
  


  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {renderHeader()}
        {renderEventCard()}
        {renderQuickActions()}
      </ScrollView>
      {renderEventModal()}
    </SafeAreaView>
  );
};


//------------------------- S T Y L I N G -------------------------------------------------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F3F2',
  },  
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    height: 511,
  },
  headerGradient: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 20,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
    position:'relative',
    left:-8,
  },
  headerSubtitle: {
    fontSize: 20,
    color: '#fff',
    opacity: 0.9,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  bellIcon: {
    position: 'absolute',
    top: 40,
    right: 20,
  },
  titleContainer: {
    position: 'absolute',
    top: 20,
    left: 20,
  },
  title: {
    color: '#E8E8E8',
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    textShadowColor: '#000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 20,
  },
  subtitle: {
    color: '#D0D0D0',
    fontSize: 12,
    marginTop: -11.6,
    marginLeft: -8,
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  eventCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    margin: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  eventCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  eventCardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  viewAllText: {
    fontSize: 14,
    color: '#D27B72',
    fontWeight: '600',
  },
  eventDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eventIcon: {
    marginRight: 15,
  },
  eventCardInfo: {
    fontSize: 18,
    color: '#444',
    fontWeight: '600',
  },
  eventCardTime: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  quickActions: {
    padding: 20,
  },
  quickActionsTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionItem: {
    width: width / 3 - 20,
    alignItems: 'center',
    marginBottom: 25,
  },
  quickActionIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quickActionText: {
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
    fontWeight: '500',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    width: '80%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  modalEventItem: {
    marginBottom: 15,
  },
  modalEventTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#444',
  },
  modalEventTime: {
    fontSize: 14,
    color: '#666',
  },
  closeButton: {
    backgroundColor: '#D27B72',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 15,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default HomePage;

*/}