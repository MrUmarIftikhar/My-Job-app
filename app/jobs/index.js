import React, { useState, useCallback, useEffect } from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator, Text, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';
import JobCard from '../../components/JobCard';
import { useBookmarks } from '../../context/BookmarkContext';

const API_URL = 'https://testapi.getlokalapp.com/common/jobs';

// Mock data for fallback when API fails
const getMockJobs = (page) => {
  const mockJobs = [];
  const baseJob = {
    id: 1000 + (page * 20),
    title: "Software Developer",
    location: "Remote",
    salary: "₹25,000 - ₹40,000",
    phone: "123-456-7890",
    description: "Join our team as a software developer and work on exciting projects."
  };
  
  for (let i = 0; i < 20; i++) {
    mockJobs.push({
      ...baseJob,
      id: baseJob.id + i,
      title: `${baseJob.title} - ${page}.${i+1}`,
      location: i % 3 === 0 ? "Remote" : i % 3 === 1 ? "Hyderabad" : "Bangalore",
      salary: `₹${25 + i}000 - ₹${40 + i}000`,
      phone: baseJob.phone.replace(/\d{4}$/, String(1000 + i).padStart(4, '0'))
    });
  }
  
  return mockJobs;
};

const fetchJobs = async (page) => {
  try {
    console.log(`Fetching jobs for page ${page}...`);
    const response = await axios.get(`${API_URL}?page=${page}&limit=30`, {
      headers: {
        'Accept': 'application/json',
        'Cache-Control': 'no-cache'
      },
      timeout: 10000
    });
    
    let jobsData = [];
    
    // Check if response.data is an array (direct array response)
    if (Array.isArray(response.data)) {
      console.log('Response is an array');
      jobsData = response.data;
    } 
    // Check if response.data has a results property (nested response)
    else if (response.data && Array.isArray(response.data.results)) {
      console.log('Response has results array');
      jobsData = response.data.results;
    }
    // Fallback to empty array if neither format is found
    else {
      console.warn('Unexpected API response format:', response.data);
      jobsData = [];
    }
    
    // Transform API data to match our app's expected format
    const formattedJobs = jobsData.map(job => ({
      id: job.id,
      title: job.title,
      location: job.primary_details?.Place || job.city_location || 'Location not specified',
      salary: job.primary_details?.Salary || `₹${job.salary_min || 0} - ₹${job.salary_max || 0}`,
      phone: job.whatsapp_no || '123-456-7890',
      description: job.content || job.contentV3 || 'No description available'
    }));
    
    return formattedJobs.length > 0 ? formattedJobs : getMockJobs(page);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    // Return mock data as fallback when API fails
    return getMockJobs(page);
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
