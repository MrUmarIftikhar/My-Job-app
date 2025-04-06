import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const JobCard = ({ job, onPress, onBookmark, bookmarked }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        <Text style={styles.title}>{job.title}</Text>
        <TouchableOpacity onPress={onBookmark}>
          <FontAwesome
            name={bookmarked ? 'bookmark' : 'bookmark-o'}
            size={20}
            color={bookmarked ? 'orange' : 'gray'}
          />
        </TouchableOpacity>
      </View>
      <Text style={styles.detail}>Location: {job.location}</Text>
      <Text style={styles.detail}>Salary: {job.salary}</Text>
      <Text style={styles.detail}>Phone: {job.phone}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    marginVertical: 8,
    marginHorizontal: 12,
    padding: 16,
    borderRadius: 10,
    shadowColor: '#ccc',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  detail: {
    marginTop: 4,
    color: '#444',
  },
});

export default JobCard;