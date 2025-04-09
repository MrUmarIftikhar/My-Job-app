import { Tabs } from 'expo-router';
import { BookmarkProvider } from '../context/BookmarkContext';

export const unstable_settings = {
  initialRouteName: 'bookmarks',
};

export default function AppLayout() {
  return (
    <BookmarkProvider>
      <Tabs>
        <Tabs.Screen
          name="jobs"
          options={{
            title: 'Jobs',
          }}
        />
        <Tabs.Screen
          name="bookmarks"
          options={{
            title: 'Bookmarks',
          }}
        />
      </Tabs>
    </BookmarkProvider>
  );
}
