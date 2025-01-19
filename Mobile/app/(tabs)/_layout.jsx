import { Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#ffd33d',
        headerStyle: {
          backgroundColor: '#25292e',
        },
        headerShadowVisible: false,
        headerTintColor: '#fff',
        tabBarStyle: {
          backgroundColor: '#25292e',
        }
      }}
    >
      <Tabs.Screen 
        name="profile" // the .jsx file
        options={{ 
          title: 'Home', // the name that appears
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? 'home-sharp' : 'home-outline'} 
              color={color} 
              size={24} 
            />
          ),
        }} 
      />
      <Tabs.Screen 
        name="bookshelf" 
        options={{ 
          title: 'Books',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? 'home-sharp' : 'home-outline'} 
              color={color} 
              size={24} 
            />
          ),
        }} 
      />
      <Tabs.Screen 
        name="test" 
        options={{ 
          title: 'Book',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? 'home-sharp' : 'home-outline'} 
              color={color} 
              size={24} 
            />
          ), 
        }} 
      />
    </Tabs>
  );
}
