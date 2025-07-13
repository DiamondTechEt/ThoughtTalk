import React from 'react';
import { View, StyleSheet, useColorScheme } from 'react-native';
import { ActivityIndicator } from 'react-native';

export function LoadingSpinner() {
  const colorScheme = useColorScheme();
  const styles = createStyles(colorScheme);

  return (
    <View style={styles.container}>
      <ActivityIndicator 
        size="large" 
        color="#3B82F6" 
      />
    </View>
  );
}

function createStyles(colorScheme: 'light' | 'dark' | null) {
  return StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
}