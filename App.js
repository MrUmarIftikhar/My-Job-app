import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import JobsScreen from './screens/JobsScreen';
import BookmarksScreen from './screens/BookmarksScreen';
import JobDetailScreen from './screens/JobDetailScreen';
import { BookmarkProvider } from './context/BookmarkContext';
import { initDB } from './utils/database';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function JobsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Jobs" component={JobsScreen} />
      <Stack.Screen name="JobDetail" component={JobDetailScreen} options={{ title: 'Job Details' }} />
    </Stack.Navigator>
  );
}

export default function App() {
  React.useEffect(() => {
    initDB();
  }, []);

  return (
    <BookmarkProvider>
      <NavigationContainer>
        <Tab.Navigator>
          <Tab.Screen name="JobsTab" component={JobsStack} options={{ title: 'Jobs' }} />
          <Tab.Screen name="Bookmarks" component={BookmarksScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </BookmarkProvider>
  );
}