/*
COISAS QUE TENHO QUE PEGAR AQUI AINDA E MUDAR NA ESTRUTURA DE DADOS DO LIVRO

- página que usuário parou
- porcentagem de leitura do usuário
- incrementar a quantidade de vezes que ele leu
- timestamp da ultima leitura

- Lista de flashcards ser um slider autocontido, para não atrapalhar ver outros decks
*/


import { View, Text, SafeAreaView, ActivityIndicator, TouchableOpacity, ScrollView, Keyboard, InteractionManager  } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'

import { Reader, useReader, ReaderProvider } from '@epubjs-react-native/core';
import { useFileSystem } from '@epubjs-react-native/expo-file-system'; // for Expo project

import { Redirect, useLocalSearchParams, useRouter } from 'expo-router';

import { Gesture, GestureDetector } from 'react-native-gesture-handler';

import { useAuth } from '../hooks/AuthContext';
import dicionarioInglesAlemao from '../../assets/english_german.json'


import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import Entypo from '@expo/vector-icons/Entypo';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import { Picker } from "@react-native-picker/picker";

import { getBackCardFromText } from "../services/chatGpt"
import { DictionaryHandler } from './dictionary';
import SaveNotification from '../components/SaveNotification';

// import { translate } from 'translate-google-api';

const dicionario = new DictionaryHandler(dicionarioInglesAlemao);

export default function BookReader() {


    const router = useRouter();

    const { authState, onGetBookByIdAndEmail, getDecks, putFlashCardOnDeck, exportFlashcardsToAnki} = useAuth();
    
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
    }, []);

    // const { goToLocation } = useReader();

    const [menuAparece, setMenuAparece] = useState(0);

    const languages = [
        { code: "placeholder", label: "Select language", disabled: true },
        { code: "us", label: "English" },
        { code: "fr", label: "Français" },
        { code: "es", label: "Español" },
        { code: "de", label: "Deutsch" },
        { code: "br", label: "Português" },
    ];

    const [selectedLanguage, setSelectedLanguage] = useState("placeholder");

    const [decks, setDecks] = useState(null);

    const [trigger, saveTrigger] = useState(false);

    const ref = useRef(null);


    useEffect(() => {
        const getAndSetDecks = async () => {
            const userDecks = await getDecks(authState.email);
            setDecks([
                { id: -1, title: "Select deck", disabled: true },
                ...userDecks
            ]);
        }
        getAndSetDecks();
    }, []);

    const [selectedDeck, setSelectedDeck] = useState(0);

    // 0 para nao clicou em gerar
    // 1 para carregando
    // 2 para carregamento finalizado
    const [cardGenerationState, setCardGenerationState] = useState(0);
    const [back, setBack] = useState("lorem ipsum");
      
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



    const defaultSaveNewCard = async () => {

        await dicionario.put(selectedText);

        await putFlashCardOnDeck(authState.email, selectedDeck, {
            id: selectedText,
            question: selectedText,
            answer: dicionario.getTranslation(selectedText)
        });
        console.log(dicionario.traducoes);

        // dicionario.traducoes = {};
        // await dicionario.saveTranslations();
        // TODO: colocar componente que desaparece depois que leva para a rota de decks do caba
    }


    return (
        <ReaderProvider >
            <SafeAreaView className='flex-1 relative'>

                {menuAparece == 1 && <View className='flex flex-row items-center bg-violet-400 absolute bottom-4 p-1 self-center z-10 rounded-xl'>
                    <TouchableOpacity onPress={() => setMenuAparece(0)}>
                        <Ionicons name="close" size={50} color="red" className='mr-3' />
                    </TouchableOpacity>
                    <TouchableOpacity className='mr-4 mb-1' onPress={() => router.replace('/(tabs)/books')}>
                        <Entypo name="home" size={36} color="white" />
                    </TouchableOpacity>
                    {selectedText != '' && <TouchableOpacity 
                        className='mr-3 mb-1' 
                        onPress={() => {
                            const callSaveCard = async () => {
                                await defaultSaveNewCard();
                            }
                            callSaveCard();
                        }}
                    >
                        <MaterialCommunityIcons name="note-plus-outline" size={40} color="white" />
                    </TouchableOpacity>}
                    {selectedText != '' && <TouchableOpacity onPress={() => setMenuAparece(2)}>
                        <MaterialIcons name="edit-note" size={54} color="white" />
                    </TouchableOpacity>}
                </View>}

                {menuAparece == 2 && <View className='flex items-center justify-center absolute h-screen w-screen z-10 bg-black/55'>
                    <TouchableOpacity 
                        className='top-3 -right-1 absolute' 
                        onPress={() => {
                            setMenuAparece(0);
                            setCardGenerationState(0);
                        }}
                    >
                        <Ionicons name="close" size={50} color="red" className='mr-6' />
                    </TouchableOpacity>

                    <View className='p-3 flex bg-white shadow-2xl shadow-black w-[90%]  rounded-lg overflow-hidden'>
                    {/* <ScrollView className='p-5' contentContainerStyle={{ paddingBottom: 30 }}> */}
                        <Text className='font-light mb-1'>Last selected (Front)</Text>
                        <View className='h-24'> {/* Se quiser mudar o tamanho da caixa que aparece a seleção, é aqui */}
                            <ScrollView contentContainerStyle={{ paddingBottom: 30 }} className='border-2 rounded-md border-gray-200 bg-neutral-100 p-3'>
                                <Text>{selectedText}</Text>
                            </ScrollView>
                        </View>
                    
                        <View className='w-full flex flex-row mt-2 justify-between'>
                            <View className="w-full border border-gray-300 rounded-lg overflow-hidden">
                                <Picker
                                    selectedValue={selectedLanguage}
                                    onValueChange={(itemValue) => setSelectedLanguage(itemValue)}
                                    className="bg-white"
                                    placeholder='select language'
                                >
                                    {languages.map((lang) => (
                                        <Picker.Item
                                            key={lang.code}
                                            label={lang.label}
                                            value={lang.code}
                                            enabled={!lang.disabled}
                                        />
                                    ))}
                                </Picker>
                            </View>

                            
                        </View>

                        <TouchableOpacity
                            onPress={() => {
                                const getBackCard = async () => {
                                    setCardGenerationState(1);

                                    //Muda a linguagem do dicionário
                                    dicionario.changeLanguage(selectedLanguage);

                                    //Se já houver uma tradução válida no dicionário, retorna ela
                                    console.log(dicionario.hasValidTranslation(palavra))
                                    if(dicionario.hasValidTranslation(palavra)){
                                        setBack(dicionario.traducoes[selectedText]);
                                        setCardGenerationState(2);
                                        return;
                                    } 

                                    //Caso contrário, pega resposta da IA
                                    const backText = await getBackCardFromText(selectedText, selectedLanguage);

                                    setBack(backText);
                                    setCardGenerationState(2);

                                    //Salva tradução da IA no dicionário e dá update no dicionário para lidar com prefixos e sufixos dela
                                    dicionario.receiveAITranslation(selectedText, backText);
                                }
                                getBackCard();
                            }} 
                            className='mt-2 w-full flex justify-center items-center p-4 bg-violet-400 rounded-xl'
                        >
                            <Text className='text-white font-semibold text-lg'>
                                Generate Card Back
                            </Text>
                        </TouchableOpacity>

                        {cardGenerationState == 1 && <ActivityIndicator className='w-full p-4 mt-2'/>}
                        {cardGenerationState == 2 && <View className='flex mt-auto justify-end'>
                            <View className='w-full mt-2'>
                                <Text className='font-light mb-1'>Translated text (Back)</Text>
                                <View className='h-24'>
                                    <ScrollView contentContainerStyle={{ paddingBottom: 30 }} className='border-2 rounded-md border-gray-200 bg-neutral-100 p-3'>
                                        <Text>{back}</Text>
                                    </ScrollView>
                                </View>
                            </View>
                            <View className='mt-2 w-full border border-gray-300 rounded-lg overflow-hidden'>
                                {decks != null ? <Picker
                                    selectedValue={selectedDeck}
                                    onValueChange={
                                        (itemValue) => setSelectedDeck(itemValue)
                                    }
                                    className="bg-white"
                                >
                                    {decks.map((deck) => (
                                        <Picker.Item
                                            key={deck.id}
                                            label={deck.title}
                                            value={deck.id}
                                            enabled={!deck.disabled}
                                        />
                                    ))}
                                </Picker>
                                :
                                <ActivityIndicator />}
                            </View>
                            <TouchableOpacity
                                onPress={() => {
                                    const saveFlashcard = async () => {
                                        await putFlashCardOnDeck(authState.email, selectedDeck, {
                                            id: selectedText,
                                            question: selectedText,
                                            answer: back
                                        });
                                        console.log("Alo");
                                        setMenuAparece(0);
                                        // TODO: colocar componente que desaparece depois que leva para a rota de decks do caba
                                    }
                                    saveFlashcard();
                                }} 
                                className='mt-2 w-full flex justify-center items-center p-4 bg-violet-400 rounded-xl'
                            >
                                <Text className='text-white font-semibold text-lg'>
                                    Save flashcard
                                </Text>
                            </TouchableOpacity>
                        </View>
                        }

                        {/* para ultima view, so fazer um flex w-full com justify-end */}
                    {/* </ScrollView> */}
                    </View>

                    

                </View>}

                <GestureDetector gesture={Gesture.Exclusive(singleTap)}>
                    <Reader
                        src={src} // "https://s3.amazonaws.com/moby-dick/OPS/package.opf"
                        fileSystem={useFileSystem}
                        // allowPopups={false}
                        allowScriptedContent={true}
                        ref={ref}
                        injectedJavaScript={`
                            // Adiciona a metatag para evitar tradução
                            console.log("teste")
                          `}

                        enableSelection={true}
                        onSelected={(selectedText) => {
                            setMenuAparece(1)
                            console.log('TEXTO SELECIONADO:', selectedText);

                            console.log(ref)

                            const texto = selectedText.replace(/[\t\n\r\f\v]+/g, " ").trim();
                            setSelectedText(texto);
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