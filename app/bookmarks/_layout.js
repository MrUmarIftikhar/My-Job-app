import { Stack } from 'expo-router';
import { Redirect } from 'expo-router';

export default function BookmarksLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="index"
        options={{
          title: 'Bookmarks'
        }}
      />
    </Stack>
  );
}