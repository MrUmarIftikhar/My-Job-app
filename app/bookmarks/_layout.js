import { Stack } from 'expo-router';

export default function BookmarksLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="bookmarks-screen" 
        options={{
          title: 'Bookmarks'
        }}
      />
    </Stack>
  );
}