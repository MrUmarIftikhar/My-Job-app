import { Stack } from 'expo-router';

export default function JobsLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: 'Jobs',
          headerShown: false, // Hide the header for the jobs index
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          title: 'Job Details',
          headerShown: true, // Keep the header for job details
        }}
      />
    </Stack>
  );
}
