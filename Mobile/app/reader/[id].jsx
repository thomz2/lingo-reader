/*
COISAS QUE TENHO QUE PEGAR AQUI AINDA E MUDAR NA ESTRUTURA DE DADOS DO LIVRO

- página que usuário parou
- porcentagem de leitura do usuário
- incrementar a quantidade de vezes que ele leu
- timestamp da ultima leitura

*/

import util from 'util'


import { View, Text, SafeAreaView, ActivityIndicator } from 'react-native'
import React, { forwardRef, useEffect, useRef, useState } from 'react'

import { Reader, useReader, ReaderProvider } from '@epubjs-react-native/core';
import { useFileSystem } from '@epubjs-react-native/expo-file-system'; // for Expo project

import { Redirect, useLocalSearchParams } from 'expo-router';
import { useAuth } from '../hooks/AuthContext';
import dicionarioInglesAlemao from '../../assets/english_german.json'

class DictionaryHandler {

    constructor(dictionary){
        this.palavras = new Set();

        this.traducoes = {};

        this.dictionary = dictionary;
    }

    put(palavra){

        if(this.palavras.has(palavra)) console.log("palavra repetida");

        if(this.dictionary[palavra]){
            this.traducoes[palavra] = this.dictionary[palavra]
        }
        else{
            this.traducoes[palavra] = "a ser traduzida..."
        }

        this.palavras.add(palavra);
    }
}

const dicionario = new DictionaryHandler(dicionarioInglesAlemao);

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

    return (
        <ReaderProvider>
            
            <SafeAreaView style={{ flex: 1 }}>

                {menuAparece > 0 && <View className=''>
                    <Text>ola mundo</Text>
                </View>}

                <Reader
                    src={src} // "https://s3.amazonaws.com/moby-dick/OPS/package.opf"
                    fileSystem={useFileSystem}
                    
                    // Text selection feature
                    enableSelection={true}
                    onSelected={(selectedText) => {

                        dicionario.put(selectedText);
                        setMenuAparece(2)
                        console.log(dicionario.traducoes, dicionario.palavras)
                    }}

                    onSingleTap={() => {
                        console.log('clicou')
                        setMenuAparece((menuState) => {
                            if (menuState == 0) return 1;
                            else return 0;
                        })
                    }}
                    onPress={() => {
                        console.log('clicou')
                        setMenuAparece((menuState) => {
                            if (menuState == 0) return 1;
                            else return 0;
                        })
                    }}
                    onDoubleTap={() => {
                        console.log('clicou')
                        setMenuAparece((menuState) => {
                            if (menuState == 0) return 1;
                            else return 0;
                        })
                    }}
                    onLongPress={() => {
                        console.log('clicou')
                        setMenuAparece((menuState) => {
                            if (menuState == 0) return 1;
                            else return 0;
                        })
                    }}
                />
            </SafeAreaView>
        </ReaderProvider>
    )
}