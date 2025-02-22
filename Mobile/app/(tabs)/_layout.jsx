import { Redirect, Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useAuth } from '../hooks/AuthContext';

import '../../global.css'

export default function TabLayout() {

  const { authState } = useAuth();

  if (!authState || !authState.authenticated) {
    return (<Redirect href={'/auth/login'} />);
  }
  
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#fff',
        tabBarInactiveTintColor: '#fff',
        tabBarStyle: {
          backgroundColor: '#a78bfa', // violeta claro
        },
        headerShown: false,
      }}
    >
      {/* <Tabs.Screen 
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
      /> */}
      <Tabs.Screen 
        name="books" 
        options={{ 
          title: 'Books',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? 'book-sharp' : 'book-outline'} 
              color={color} 
              size={24} 
            />
          ),
        }} 
      />
      <Tabs.Screen 
        name="notes" 
        options={{ 
          title: 'Notes',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? 'documents-sharp' : 'documents-outline'} 
              color={color} 
              size={24} 
            />
          ),
        }} 
      />
    </Tabs>
  );
}
