import { Stack } from "expo-router";

export default function MainLayout() {

  return (
    <Stack screenOptions={{ headerShown: false , animation: 'fade'}}>
      <Stack.Screen name="home" />
      <Stack.Screen name="profile" options={{animation:"fade_from_bottom"}} />
      <Stack.Screen name="create" options={{animation:"fade_from_bottom"}} />
      <Stack.Screen name="edit/[id]" options={{animation:"fade_from_bottom"}} />
      <Stack.Screen name="search" options={{animation:"fade_from_bottom"}} />
    </Stack>
  );
}
