import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const JobDetailScreen = ({ route }) => {
  const { job } = route.params;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{job.title}</Text>
      <Text style={styles.label}>Location:</Text>
      <Text style={styles.value}>{job.location}</Text>

      <Text style={styles.label}>Salary:</Text>
      <Text style={styles.value}>{job.salary}</Text>

      <Text style={styles.label}>Phone:</Text>
      <Text style={styles.value}>{job.phone}</Text>

      <Text style={styles.label}>Description:</Text>
      <Text style={styles.value}>{job.description || 'No description provided.'}</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  label: {
    fontWeight: 'bold',
    marginTop: 12,
  },
  value: {
    fontSize: 16,
    marginTop: 4,
  },
});

export default JobDetailScreen;