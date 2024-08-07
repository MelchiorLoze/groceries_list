import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const PantryScreen: React.FC = () => (
  <View style={styles.container}>
    <Text style={styles.title}>Pantry Screen</Text>
    {/* Add your components and logic here */}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
});

export default PantryScreen;
