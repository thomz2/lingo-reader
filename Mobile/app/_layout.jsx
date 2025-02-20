import { Slot, Stack } from 'expo-router';
import { AuthProvider } from './hooks/AuthContext';
import { useEffect, useContext } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function RootLayout() {

    return (
      <GestureHandlerRootView>
        <AuthProvider>
          <Slot />
        </AuthProvider>
      </GestureHandlerRootView>
    );
}
