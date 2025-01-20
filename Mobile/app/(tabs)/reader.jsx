import { View, Text, SafeAreaView } from 'react-native'
import React, { useEffect, useState } from 'react'

import { Reader, useReader, ReaderProvider } from '@epubjs-react-native/core';
import { useFileSystem } from '@epubjs-react-native/expo-file-system'; // for Expo project


export default function reader({ bookSrc = null }) {
    
    useEffect(() => (console.log(bookSrc)))

    const { goToLocation } = useReader();

    const [ghAparece, setGhAparece] = useState(0)

    if (!bookSrc) return (
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
                    src={bookSrc} // "https://s3.amazonaws.com/moby-dick/OPS/package.opf"
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