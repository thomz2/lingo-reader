/*
COISAS QUE TENHO QUE PEGAR AQUI AINDA E MUDAR NA ESTRUTURA DE DADOS DO LIVRO

- página que usuário parou
- porcentagem de leitura do usuário
- incrementar a quantidade de vezes que ele leu
- timestamp da ultima leitura

*/


import { View, Text, SafeAreaView, ActivityIndicator, TouchableOpacity, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'

import { Reader, useReader, ReaderProvider } from '@epubjs-react-native/core';
import { useFileSystem } from '@epubjs-react-native/expo-file-system'; // for Expo project

import { Redirect, useLocalSearchParams } from 'expo-router';

import { Gesture, GestureDetector } from 'react-native-gesture-handler';

import { useAuth } from '../hooks/AuthContext';

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function BookReader() {

    const { authState, onGetBookByIdAndEmail } = useAuth();
    
    if (!authState || !authState.authenticated) {
        return (<Redirect href={'/auth/login'} />);
    }

    const { id } = useLocalSearchParams();

    const [src, setSrc] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedText, setSelectedText] = useState('');
    const [canSelect, setCanSelect] = useState(true);
    const [actualPage, setActualPage] = useState(0);

    useEffect(() => {
        const getBook = async () => {
            try {
                const res = await onGetBookByIdAndEmail(authState.email, id);

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

    // const { goToLocation } = useReader();

    const [menuAparece, setMenuAparece] = useState(0);

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

    const singleTap = Gesture.Tap()
        .maxDuration(250)
        .runOnJS(true)
        .onStart(() => {
            console.log('tap');
            setMenuAparece((menuState) => {
                if (menuState > 0) return 0;
                else return 1;
            });
        });


    return (
        <ReaderProvider>
            <SafeAreaView className='flex-1 relative'>

                {menuAparece == 1 && <View className='flex flex-row items-center bg-violet-400 absolute bottom-4 p-1 self-center z-10 rounded-xl'>
                    <TouchableOpacity onPress={() => setMenuAparece(0)}>
                        <Ionicons name="close" size={50} color="red" className='mr-6' />
                    </TouchableOpacity>
                    {selectedText != '' && <TouchableOpacity onPress={() => setMenuAparece(2)}>
                        <MaterialIcons name="edit-note" size={54} color="white" />
                    </TouchableOpacity>}
                    <MaterialIcons name="drag-indicator" size={50} color="white" />
                </View>}

                {menuAparece == 2 && <View className='flex items-center justify-center absolute h-screen w-screen z-10 bg-black/55'>
                    <TouchableOpacity className='top-3 -right-1 absolute' onPress={() => setMenuAparece(0)}>
                        <Ionicons name="close" size={50} color="red" className='mr-6' />
                    </TouchableOpacity>
                    <View className='p-3 flex bg-white shadow-2xl shadow-black aspect-[3/2] h-[28%] rounded-lg overflow-hidden'>
                        <Text className='font-light mb-1'>Last selected</Text>
                        <View className='h-20'> {/* Se quiser mudar o tamanho da caixa que aparece a seleção, é aqui */}
                            <ScrollView className='border-2 rounded-md border-gray-200 bg-neutral-100 p-3'>
                                <Text>{selectedText}</Text>
                            </ScrollView>
                        </View>
                    </View>


                </View>}

                <GestureDetector gesture={Gesture.Exclusive(singleTap)}>
                    <Reader
                        src={src} // "https://s3.amazonaws.com/moby-dick/OPS/package.opf"
                        fileSystem={useFileSystem}

                        // onReady={() => {
                        //     if (actualPage != 0) {
                        //         console.log('OH, VAI PRA PAGINA', actualPage);
                        //         goToLocation(actualPage['end']['cfi']);
                        //     }
                        // }}
                        
                        enableSelection={true}
                        onSelected={(selectedText) => {
                            setMenuAparece(1)
                            console.log('TEXTO SELECIONADO:', selectedText);
                            setSelectedText(selectedText.replace(/[\t\n\r\f\v]+/g, " ").trim());
                        }}

                        onLocationChange={(totalLocations, currentLocation) => {
                            setActualPage(currentLocation);
                            console.log('ACTUAL PAGE:', actualPage);
                        }}
                    />
                </GestureDetector>
            </SafeAreaView>
        </ReaderProvider>
    )
}