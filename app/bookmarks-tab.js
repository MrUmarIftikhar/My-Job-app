import React, { useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useBookmarks } from '../context/BookmarkContext';
import JobCard from '../components/JobCard';

export default function BookmarksScreen() {
  const {
    bookmarks,
    loading,
    removeBookmark,
    isBookmarked,
    refreshBookmarks
  } = useBookmarks();
  const router = useRouter();

  useEffect(() => {
    refreshBookmarks();
  }, []);

  const renderItem = ({ item }) => (
    <JobCard
      job={item}
      onPress={() => router.push(`/jobs/${item.id}`)}
      onBookmark={() => removeBookmark(item.id)}
      bookmarked={isBookmarked(item.id)}
    />
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <Text>Loading bookmarks...</Text>
      </View>
    );
  }

  if (bookmarks.length === 0) {
    return (
      <View style={styles.centered}>
        <Text>No bookmarks yet</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={bookmarks}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderItem}
    />
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});