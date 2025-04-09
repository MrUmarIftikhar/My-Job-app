import React, { useState, useCallback } from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';
import JobCard from '../../components/JobCard';

const API_URL = 'https://testapi.getlokalapp.com/common/jobs';

const fetchJobs = async (page) => {
  try {
    const response = await axios.get(`${API_URL}?page=${page}`);
    return response.data.data || [];
  } catch (error) {
    console.error('Error fetching jobs:', error);
    throw error;
  }
};

export default function JobsScreen() {
  const router = useRouter();
  const [jobs, setJobs] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  const loadJobs = useCallback(async () => {
    if (loading || !hasMore) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await fetchJobs(page);
      if (data && data.length > 0) {
        setJobs(prev => [...prev, ...data]);
        setPage(prev => prev + 1);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error('Error loading jobs:', err);
      setError('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  }, [page, loading, hasMore]);

  const renderItem = ({ item }) => (
    <JobCard
      job={item}
      onPress={() => router.push(`/jobs/${item.id}`)}
    />
  );

  const renderFooter = () => {
    if (!loading) return null;
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="small" />
      </View>
    );
  };

  if (error) {
    return (
      <View style={styles.centered}>
        <Text>{error}</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={jobs}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderItem}
      contentContainerStyle={styles.container}
      onEndReached={loadJobs}
      onEndReachedThreshold={0.5}
      ListFooterComponent={renderFooter}
      ListEmptyComponent={
        !loading && (
          <View style={styles.centered}>
            <Text>No jobs found</Text>
          </View>
        )
      }
    />
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
    flexGrow: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  footer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
});