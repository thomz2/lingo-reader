import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'

import { SafeAreaView } from 'react-native';
import { Reader, useReader } from '@epubjs-react-native/core';
import { useFileSystem } from '@epubjs-react-native/expo-file-system'; // for Expo project
import { ReaderProvider } from '@epubjs-react-native/core';


export default function test() {
    const { goToLocation } = useReader();

    const [ghAparece, setGhAparece] = useState(0)

    return (
        <>
            {ghAparece && <Text className="text-8xl text-red-700">
                GH{ghAparece}
            </Text>}
            <ReaderProvider>
                <SafeAreaView style={{ flex: 1 }}>
                    <Reader
                        src="https://s3.amazonaws.com/moby-dick/OPS/package.opf"
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
        </>
    )
}