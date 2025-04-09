import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import axios from 'axios';

const API_URL = 'https://testapi.getlokalapp.com/common/jobs';

export default function JobDetailScreen() {
  const { id } = useLocalSearchParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobDetail = async () => {
      try {
        const response = await axios.get(`${API_URL}?page=1`);
        const jobs = response.data.data || [];
        const foundJob = jobs.find(j => j.id === parseInt(id));
        setJob(foundJob);
      } catch (err) {
        console.error('Error fetching job details:', err);
        setError('Failed to load job details');
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetail();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text>{error}</Text>
      </View>
    );
  }

  if (!job) {
    return (
      <View style={styles.centered}>
        <Text>Job not found</Text>
      </View>
    );
  }

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
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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