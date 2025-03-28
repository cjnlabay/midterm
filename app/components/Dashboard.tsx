import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

export default function Home() {
  return (
    <View style={styles.container}>
      {/* App Title */}
      <Text style={styles.appTitle}>Welcome to MyApp</Text>
      
      {/* App Description */}
      <Text style={styles.appDescription}>
        MyApp helps you manage your daily tasks and activities.
        Start exploring all the amazing features we have for you!
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  appTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  appDescription: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
});