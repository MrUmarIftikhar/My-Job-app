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
        // First try to get the job from the API
        const response = await axios.get(`${API_URL}?page=1&limit=50`, {
          headers: {
            'Accept': 'application/json',
            'Cache-Control': 'no-cache'
          },
          timeout: 10000
        });
        
        let jobs = [];
        
        // Handle different API response formats
        if (Array.isArray(response.data)) {
          jobs = response.data;
        } else if (response.data && Array.isArray(response.data.results)) {
          jobs = response.data.results;
        } else {
          console.warn('Unexpected API response format:', response.data);
        }
        
        // Transform job data to match our app's format
        const formattedJobs = jobs.map(job => ({
          id: job.id,
          title: job.title,
          location: job.primary_details?.Place || job.city_location || 'Location not specified',
          salary: job.primary_details?.Salary || `₹${job.salary_min || 0} - ₹${job.salary_max || 0}`,
          phone: job.whatsapp_no || '123-456-7890',
          description: job.content || job.contentV3 || 'No description available'
        }));
        
        const foundJob = formattedJobs.find(j => j.id === parseInt(id));
        
        if (foundJob) {
          setJob(foundJob);
        } else {
          // If job not found in API, create a mock job
          const mockJob = {
            id: parseInt(id),
            title: `Job #${id}`,
            location: "Remote",
            salary: "₹25,000 - ₹40,000",
            phone: "123-456-7890",
            description: "This is a mock job description created as a fallback when the actual job details cannot be retrieved from the API."
          };
          setJob(mockJob);
        }
      } catch (err) {
        console.error('Error fetching job details:', err);
        // Create a mock job as fallback
        const mockJob = {
          id: parseInt(id),
          title: `Job #${id}`,
          location: "Remote",
          salary: "₹25,000 - ₹40,000",
          phone: "123-456-7890",
          description: "This is a mock job description created as a fallback when the API request fails."
        };
        setJob(mockJob);
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