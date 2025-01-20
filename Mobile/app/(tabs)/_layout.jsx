import { Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#282A36',
        tabBarInactiveTintColor: '#282A36',
        tabBarStyle: {
          backgroundColor: '#EFC229', // amarelo
        },
        headerShown: false
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
              name={focused ? 'bookmark-sharp' : 'bookmark-outline'} 
              color={color} 
              size={24} 
            />
          ),
        }} 
      />
      {/* <Tabs.Screen 
        name="reader" 
        options={{ 
          title: 'Read',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? 'book-sharp' : 'book-outline'} 
              color={color} 
              size={24} 
            />
          ), 
        }} 
      /> */}
    </Tabs>
  );
}
