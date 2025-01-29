import { Tabs, useRouter } from 'expo-router';
import React from 'react';
import { Platform, TouchableOpacity, Text, StyleSheet } from 'react-native';
//import { useNavigation } from '@react-navigation/native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { UserProvider } from '@/context/UserContext';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  //const navigation = useNavigation();
  const router = useRouter();

  

  return (

    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: true,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        headerStyle: {
          backgroundColor: '#5100C2',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: '600',
        },
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
          },
          default: {},
        }),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'explore',
          headerRight: () => (
           <TouchableOpacity
                     style={styles.loginButton}
                     //onPress={() => navigation.navigate('login')}
                      onPress={() => router.push('/login')}
                   >
                     <Text style={styles.loginText}>Login</Text>
                   </TouchableOpacity>
          ),
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="person.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="login"
        options={{
          title: 'login',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="person.fill" color={color} />,
        }}
        />
    </Tabs>
    

  );
}

const styles = StyleSheet.create({
  loginButton: {
    backgroundColor: '#fff',
    paddingVertical: 9,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginRight: 20,
  },
  loginText: {
    color: '#6200ea',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
