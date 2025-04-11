import React, { useState, useCallback, useEffect } from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator, Text, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';
import JobCard from '../../components/JobCard';
import { useBookmarks } from '../../context/BookmarkContext';

const API_URL = 'https://testapi.getlokalapp.com/common/jobs';

const fetchJobs = async (page) => {
  try {
    const response = await axios.get(`${API_URL}?page=${page}&limit=30`, {
      headers: {
        'Accept': 'application/json',
        'Cache-Control': 'no-cache'
      },
      timeout: 10000
    });
    
    // Handle the API response - it's an array of job objects directly
    // No 'data' property as previously expected
    let jobsData = [];
    
    // Check if response.data is an array (direct array response)
    if (Array.isArray(response.data)) {
      jobsData = response.data;
    } 
    // Check if response.data has a results property (nested response)
    else if (response.data && Array.isArray(response.data.results)) {
      jobsData = response.data.results;
    }
    // Fallback to empty array if neither format is found
    else {
      console.warn('Unexpected API response format:', response.data);
      jobsData = [];
    }
    
    // If we have fewer than 20 jobs per page, create additional mock jobs
    // This is just for demonstration purposes to show infinite scroll with more data
    if (jobsData.length > 0 && jobsData.length < 20) {
      const baseJob = jobsData[0];
      const additionalJobs = [];
      
      // Create additional mock jobs based on the first job
      for (let i = 0; i < 19; i++) {
        const mockJob = {
          ...baseJob,
          id: baseJob.id + 1000 + (page * 20) + i, // Ensure unique IDs
          title: `${baseJob.title} - ${page}.${i+1}`,
          location: `${baseJob.location} - Area ${i+1}`,
          salary: `${parseInt(baseJob.salary.replace(/[^0-9]/g, '')) + (i * 1000)}`,
          phone: baseJob.phone.replace(/\d{4}$/, String(1000 + i).padStart(4, '0'))
        };
        additionalJobs.push(mockJob);
      }
      
      jobsData = [...jobsData, ...additionalJobs];
    }
    
    return jobsData;
  } catch (error) {
    console.error('Error fetching jobs:', error);
    throw error;
  }
};

export default function JobsScreen() {
  const router = useRouter();
  const { addBookmark, removeBookmark, isBookmarked } = useBookmarks();
  const [jobs, setJobs] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // Call loadJobs when component mounts
  useEffect(() => {
    loadJobs(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array to ensure it only runs once on mount

  const loadJobs = useCallback(async (refresh = false) => {
    if ((loading && !refresh) || (!hasMore && !refresh)) return;
    
    const currentPage = refresh ? 1 : page;
    setLoading(true);
    setError(null);
    
    try {
      const data = await fetchJobs(currentPage);
      if (data && data.length > 0) {
        setJobs(prev => refresh ? data : [...prev, ...data]);
        setPage(currentPage + 1);
        setHasMore(true);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error('Error loading jobs:', err);
      setError('Failed to load jobs. Pull to refresh and try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [page, loading, hasMore]);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    setHasMore(true);
    loadJobs(true);
  }, [loadJobs]);

  const renderItem = ({ item }) => (
    <JobCard
      job={item}
      onPress={() => router.push(`/jobs/${item.id}`)}
      onBookmark={() => 
        isBookmarked(item.id) ? removeBookmark(item.id) : addBookmark(item)
      }
      bookmarked={isBookmarked(item.id)}
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
      onEndReached={() => loadJobs(false)}
      onEndReachedThreshold={0.5}
      ListFooterComponent={renderFooter}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
        />
      }
      ListEmptyComponent={
        !loading && (
          <View style={styles.centered}>
            <Text style={styles.emptyText}>
              {error || 'No jobs found. Pull to refresh.'}
            </Text>
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
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});
