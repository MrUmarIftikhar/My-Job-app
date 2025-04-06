
import React, { useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useBookmarks } from '../context/BookmarkContext';
import JobCard from '../components/JobCard';
import { useNavigation } from '@react-navigation/native';

const BookmarksScreen = () => {
  const {
    bookmarks,
    loading,
    removeBookmark,
    isBookmarked,
    refreshBookmarks
  } = useBookmarks();
  const navigation = useNavigation();

  useEffect(() => {
    refreshBookmarks();
  }, []);

  const renderItem = ({ item }) => (
    <JobCard
      job={item}
      onPress={() => navigation.navigate('JobDetail', { job: item })}
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
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default BookmarksScreen;