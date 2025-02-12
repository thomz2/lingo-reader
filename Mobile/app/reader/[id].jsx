import { View, Text, SafeAreaView, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'

import { Reader, useReader, ReaderProvider } from '@epubjs-react-native/core';
import { useFileSystem } from '@epubjs-react-native/expo-file-system'; // for Expo project

import { Redirect, useLocalSearchParams } from 'expo-router';
import { useAuth } from '../hooks/AuthContext';

export default function BookReader() {

    const { authState, onGetBookByIdAndEmail } = useAuth();
    
    if (!authState || !authState.authenticated) {
        return (<Redirect href={'/auth/login'} />);
    }

    const { id } = useLocalSearchParams();

    const [src, setSrc] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getBook = async () => {
            try {
                const res = await onGetBookByIdAndEmail(authState.email, id);
                console.log("ID", id);
                console.log("BOOK", res);

                if (res.error) {
                    console.error(res.error);
                    return;
                }

                setSrc(res.book.uri);
            } catch (error) {
                console.error('Error fetching book:', error);
            } finally {
                setLoading(false);
            }
        }

        getBook();
    });

    const { goToLocation } = useReader();

    const [ghAparece, setGhAparece] = useState(0)

    if (loading) {
        return <ActivityIndicator />
    }

    if (!src) return (
        <View className='flex justify-center items-center my-auto'>
            <Text className='text-3xl text-neutral-800 font-semibold'>
                Nenhum livro selecionado!
            </Text>
        </View>
    )

    return (
        <ReaderProvider>
            <SafeAreaView style={{ flex: 1 }}>
                <Reader
                    src={src} // "https://s3.amazonaws.com/moby-dick/OPS/package.opf"
                    fileSystem={useFileSystem}
                    
                    // Text selection feature
                    enableSelection={true}
                    onSelected={() => {
                        setGhAparece(ghAparece + 1)
                    }}

                    // Single tap feature (open menu)
                    enableTap={true}
                    onSingleTap={() => {
                        setGhAparece(120)
                    }}
                />
            </SafeAreaView>
        </ReaderProvider>
    )
}