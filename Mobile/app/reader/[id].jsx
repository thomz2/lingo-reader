import { View, Text, SafeAreaView } from 'react-native'
import React, { useEffect, useState } from 'react'

import { Reader, useReader, ReaderProvider } from '@epubjs-react-native/core';
import { useFileSystem } from '@epubjs-react-native/expo-file-system'; // for Expo project

import { Redirect, useLocalSearchParams } from 'expo-router';
import { useAuth } from '../hooks/AuthContext';

export default function BookReader() {

    const { authState } = useAuth();
    
    if (!authState || !authState.authenticated) {
        return (<Redirect href={'/auth/login'} />);
    }

    const onlineBooks = [
        { 
          title: 'Book One',
          imageUrl: 'https://m.media-amazon.com/images/I/61kif0Iav7L._AC_UF1000,1000_QL80_.jpg',
          src: 'https://s3.amazonaws.com/moby-dick/OPS/package.opf' 
        },
        { 
          title: 'Book Two',
          imageUrl: 'https://picsum.photos/400' 
        },
        { 
          title: 'Book Three',
          imageUrl: 'https://picsum.photos/200' 
        },
        { 
          title: 'Book 4',
          imageUrl: 'https://picsum.photos/200' 
        },
    ];

    const { id } = useLocalSearchParams();
    const src = onlineBooks[id].src;

    if (!src) return (
        <View className='flex justify-center items-center my-auto'>
            <Text className='text-3xl text-neutral-800 font-semibold'>
                Nenhum livro selecionado!
            </Text>
        </View>
    )

    const { goToLocation } = useReader();

    const [ghAparece, setGhAparece] = useState(0)

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