import { Slot, Stack } from 'expo-router';
import { AuthProvider } from './hooks/AuthContext';
import { useEffect, useContext } from 'react';

export default function RootLayout() {

    return (
      <AuthProvider>
        <Slot />
      </AuthProvider>
    );
}
