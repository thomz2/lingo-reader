import { View, Text, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useAuth } from './hooks/AuthContext';
import { Redirect, router, useRootNavigationState } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const index = () => {

    const DEBUG = false;
    const WIPE_STORAGE = false;

    const rootNavigationState = useRootNavigationState();
    
    const { authState, onLogout } = useAuth();

    if (!rootNavigationState?.key) {
        return (<ActivityIndicator />);
    }

    if (WIPE_STORAGE) {
        const clearAll = async () => {
            AsyncStorage.clear();
            onLogout();
        }
        clearAll();
    }

    if (!authState || !authState.authenticated) {
        return (<Redirect href={'/auth/login'} />);
    }

    if (DEBUG) {
        return (
            <View>
                <Text>index</Text>
                <Text>
                    {JSON.stringify(authState)}
                </Text>
            </View>
        );
    }

    return (
        <Redirect href={'(tabs)/books'} />
    );
}

export default index