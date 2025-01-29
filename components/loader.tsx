import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

const Loader = () => {
  return (
    <View style={styles.loaderContainer}>
      <ActivityIndicator size="large" color="#6200ea" />
    </View>
  );
};

const styles = StyleSheet.create({
  loaderContainer: {
    position: 'absolute',
    top: '40%',
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Loader;

