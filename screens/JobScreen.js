import React, { useEffect, useState } from 'react';
import { View, FlatList, ActivityIndicator, Text, StyleSheet, RefreshControl } from 'react-native';
import axios from 'axios';
import JobCard from '../components/JobCard';
import { useNavigation } from '@react-navigation/native';
import { useBookmarks } from '../context/BookmarkContext';

const JobsScreen = () => {
  const [jobs, setJobs] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const { addBookmark, removeBookmark, isBookmarked } = useBookmarks();
  const navigation = useNavigation();

  const fetchJobs = async (pageNum = 1, append = false) => {
    try {
      if (!append) setLoading(true);
      const res = await axios.get('https://testapi.getlokalapp.com/common/jobs?page=${pageNum}');
      const newJobs = res.data?.data || [];
      setJobs(prev => append ? [...prev, ...newJobs] : newJobs);
      setPage(pageNum);
      setError(null);
    } catch (err) {
      setError('Failed to fetch jobs');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleLoadMore = () => {
    fetchJobs(page + 1, true);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchJobs(1);
  };

  const renderItem = ({ item }) => (
    <JobCard
      job={item}
      onPress={() => navigation.navigate('JobDetail', { job: item })}
      onBookmark={() =>
        isBookmarked(item.id) ? removeBookmark(item.id) : addBookmark(item)
      }
      bookmarked={isBookmarked(item.id)}
    />
  );

  if (loading && jobs.length === 0) {
    return <ActivityIndicator style={styles.centered} size="large" />;
  }

  if (error && jobs.length === 0) {
    return (
      <View style={styles.centered}>
        <Text>{error}</Text>
      </View>
    );
  }

  if (jobs.length === 0) {
    return (
      <View style={styles.centered}>
        <Text>No jobs found</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={jobs}
      renderItem={renderItem}
      keyExtractor={(item) => item.id.toString()}
      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.5}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
    />
  );
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default JobsScreen;