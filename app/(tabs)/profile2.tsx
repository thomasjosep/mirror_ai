import React, { useState } from 'react';
import {
  NativeBaseProvider,
  Box,
  Text,
  Image,
  Pressable,
  Input,
  VStack,
  HStack,
  Icon,
  useTheme,
  Center,
  KeyboardAvoidingView,
  ScrollView
} from 'native-base';
import { VictoryPie } from 'victory-native';
import { Feather } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  withSpring,
  useAnimatedStyle
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Dimensions, Platform, StyleSheet } from 'react-native';

const { width } = Dimensions.get('window');
const PRIMARY_COLOR = '#5100C2';

const AnimatedBox = Animated.createAnimatedComponent(Box);

const ProfilePage = () => {
  const [isFirstLogin, setIsFirstLogin] = useState(true);
  const [profile, setProfile] = useState({
    name: '',
    height: '',
    weight: '',
    age: '',
    experience: '',
    goldTrophies: 0,
    silverTrophies: 0
  });
  const [selectedPeriod, setSelectedPeriod] = useState('1M');
  const rotation = useSharedValue(0);

  const performanceData = {
    '1W': { correct: 85, incorrect: 15 },
    '1M': { correct: 75, incorrect: 25 },
    '3M': { correct: 80, incorrect: 20 },
    '1Y': { correct: 78, incorrect: 22 }
  };

  const handlePeriodChange = async (period: React.SetStateAction<string>) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    rotation.value = withSpring(rotation.value + 360);
    setSelectedPeriod(period);
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotateY: `${rotation.value}deg` }],
  }));

  const handleSaveProfile = () => {
    if (!profile.name || !profile.height || !profile.weight || !profile.age) {
      alert("Please fill all required fields!");
      return;
    }
    setIsFirstLogin(false);
  };

  if (isFirstLogin) {
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        flex={1}
      >
        <ScrollView>
          <Box p={6}>
            <VStack space={4}>
              <Input
                placeholder="Name"
                value={profile.name}
                onChangeText={(text) => setProfile({ ...profile, name: text })}
              />
              <HStack space={4}>
                <Input
                  flex={1}
                  placeholder="Height (cm)"
                  keyboardType="numeric"
                  value={profile.height}
                  onChangeText={(text) => setProfile({ ...profile, height: text })}
                />
                <Input
                  flex={1}
                  placeholder="Weight (kg)"
                  keyboardType="numeric"
                  value={profile.weight}
                  onChangeText={(text) => setProfile({ ...profile, weight: text })}
                />
              </HStack>
              <HStack space={4}>
                <Input
                  flex={1}
                  placeholder="Age"
                  keyboardType="numeric"
                  value={profile.age}
                  onChangeText={(text) => setProfile({ ...profile, age: text })}
                />
                <Input
                  flex={1}
                  placeholder="Experience Level"
                  value={profile.experience}
                  onChangeText={(text) => setProfile({ ...profile, experience: text })}
                />
              </HStack>
              <Pressable
                bg={PRIMARY_COLOR}
                p={4}
                borderRadius="lg"
                onPress={handleSaveProfile}
              >
                <Text color="white" textAlign="center" fontWeight="600">
                  Save Profile
                </Text>
              </Pressable>
            </VStack>
          </Box>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Box bg={PRIMARY_COLOR} p={6}>
        <HStack justifyContent="space-between" alignItems="center">
          <HStack space={4} alignItems="center">
            <Image
              source={{ uri: 'https://via.placeholder.com/64' }}
              alt="Profile"
              size={"64px"}
              borderRadius="full"
            />
            <Text color="white" fontSize="2xl" fontWeight="bold">
              {profile.name}
            </Text>
          </HStack>
          <Pressable accessibilityLabel="Edit Profile">
            <Icon as={Feather} name="edit-2" size={6} color="white" />
          </Pressable>
        </HStack>
      </Box>

      <Box p={4}>
        <HStack flexWrap="wrap" justifyContent="space-between">
          {['Height', 'Weight', 'Age', 'Experience'].map((label, index) => (
            <Box
              key={index}
              w={width / 2 - 24}
              bg="white"
              p={4}
              borderRadius="lg"
              shadow={2}
              mb={4}
            >
              <Text fontWeight="600" textAlign="center" mb={2}>
                {label}
              </Text>
              <Text textAlign="center">{(label.toLowerCase() as keyof typeof profile) in profile ? profile[label.toLowerCase() as keyof typeof profile] : '--'}</Text>
            </Box>
          ))}
        </HStack>

        <AnimatedBox style={animatedStyle}>
          <VictoryPie
            animate={{ duration: 800, easing: "circleOut" }}
            data={[
              { x: 'Correct', y: performanceData[selectedPeriod].correct, color: '#4CAF50' },
              { x: 'Incorrect', y: performanceData[selectedPeriod].incorrect, color: '#FF5252' }
            ]}
            width={300}
            height={300}
            colorScale={['#4CAF50', '#FF5252']}
            innerRadius={70}
            labels={({ datum }) => `${datum.y}%`}
          />
        </AnimatedBox>

        <HStack justifyContent="center" space={8} mt={6}>
          {['Gold', 'Silver'].map((type, index) => (
            <Center key={index}>
              <Icon
                as={Feather}
                name="award"
                size={width * 0.08}
                color={type === 'Gold' ? 'yellow.400' : 'gray.400'}
              />
              <Text fontWeight="600" mt={2}>{type}</Text>
              <Text>{profile[`${type.toLowerCase()}Trophies`] || '--'}</Text>
            </Center>
          ))}
        </HStack>
      </Box>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FF',
  },
});

export default () => (
  <NativeBaseProvider>
    <ProfilePage />
  </NativeBaseProvider>
);
