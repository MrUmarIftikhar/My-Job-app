import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function BookmarksScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bookmarks</Text>
      <Text style={styles.emptyText}>No bookmarks saved yet</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
});
