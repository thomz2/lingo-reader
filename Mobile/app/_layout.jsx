import { Slot, Stack } from 'expo-router';
import { AuthProvider } from './hooks/AuthContext';
import { useEffect, useContext } from 'react';
import { TestContext, TestProvider } from './hooks/TestContext';

export default function RootLayout() {

    const { teste } = useContext(TestContext);

    useEffect(() => {
      console.log(teste);
    }, [])

    return (
      <AuthProvider>
        <TestProvider>
          {/* <Stack>
              {authState?.authenticated ? (
                  <Stack.Screen name='(tabs)/profile' />
              ) : (
                  <Stack.Screen name='auth/login' />
              )}
          </Stack> */}
          <Slot />
        </TestProvider>
      </AuthProvider>
    );
}
