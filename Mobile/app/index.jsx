import { View, Text, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useAuth } from './hooks/AuthContext';
import { Redirect, router, useRootNavigationState } from 'expo-router';

const index = () => {

    const rootNavigationState = useRootNavigationState();
    
    const { authState } = useAuth();

    if (!rootNavigationState?.key) {
        return (<ActivityIndicator />);
    }

    if (!authState || !authState.authenticated) {
        return (<Redirect href={'/auth/login'} />);
    }

    return (
        <View>
            <Text>index</Text>
            <Text>
                {JSON.stringify(authState)}
            </Text>
        </View>
    )
}

export default index