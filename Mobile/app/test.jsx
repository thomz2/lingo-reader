import { View, Text } from 'react-native'
import React, { useEffect } from 'react'

import { SafeAreaView } from 'react-native';
import { Reader, useReader } from '@epubjs-react-native/core';
import { useFileSystem } from '@epubjs-react-native/expo-file-system'; // for Expo project
import { ReaderProvider } from '@epubjs-react-native/core';


export default function test() {
    const { goToLocation } = useReader();

    return (
        <ReaderProvider>
            <SafeAreaView style={{ flex: 1 }}>
                <Reader
                    src="https://s3.amazonaws.com/moby-dick/OPS/package.opf"
                    fileSystem={useFileSystem}
                />
            </SafeAreaView>
        </ReaderProvider>
    )
}