import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="profile" options={{ title: 'Home' }} />
      <Tabs.Screen name="bookshelf" options={{ title: 'Books' }} />
      <Tabs.Screen name="book" options={{ title: 'Book' }} />
    </Tabs>
  );
}
