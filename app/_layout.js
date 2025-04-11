import { Tabs } from 'expo-router';
import { BookmarkProvider } from '../context/BookmarkContext';
import { FontAwesome } from '@expo/vector-icons';
import { View } from 'react-native';

export const unstable_settings = {
  initialRouteName: 'jobs',
};

export default function AppLayout() {
  return (
    <BookmarkProvider>
      <Tabs 
        screenOptions={({ route }) => {
          // Only show tab bar for jobs and bookmarks-tab routes
          const tabBarVisible = 
            route.name === 'jobs' || 
            route.name === 'bookmarks-tab';
            
          return {
            headerShown: true,
            tabBarActiveTintColor: '#007AFF',
            tabBarInactiveTintColor: '#8E8E93',
            // Hide tab bar for routes other than jobs and bookmarks-tab
            tabBarStyle: tabBarVisible ? { height: 60 } : { display: 'none' },
            // Only show icon and label for jobs and bookmarks-tab
            tabBarButton: tabBarVisible ? undefined : () => null,
          };
        }}
      >
        <Tabs.Screen
          name="jobs"
          options={{
            title: 'Jobs',
            tabBarIcon: ({ color }) => (
              <FontAwesome name="briefcase" size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="bookmarks-tab"
          options={{
            title: 'Bookmarks',
            tabBarIcon: ({ color }) => (
              <FontAwesome name="bookmark" size={24} color={color} />
            ),
            headerShown: true,
          }}
        />
      </Tabs>
    </BookmarkProvider>
  );
}
