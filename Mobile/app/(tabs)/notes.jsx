// import React from 'react'
// import { View, Text, ScrollView, Image } from 'react-native';

// export default function Notes() {
//   return (
//     <Text className='mx-4 mt-8 mb-4 text-4xl font-light text-neutral-800'>
//       Decks
//     </Text>
//   )
// }

import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Button, TextInput, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useAuth } from '../hooks/AuthContext';
import { Pressable } from 'react-native-gesture-handler';

import Entypo from '@expo/vector-icons/Entypo';

export default function Notes() {

  const { authState, createDeck, getDecks, deleteDeck, exportFlashcardsToAnki } = useAuth();

  const [decks, setDecks] = useState([]);
  const [newDeckName, setNewDeckName] = useState('');
  const userEmail = authState.email;

  useEffect(() => {
    loadDecks();
  }, []);

  const loadDecks = async () => {
    const loadedDecks = await getDecks(userEmail);
    setDecks(loadedDecks);
  };

  const handleCreateDeck = async () => {
    if (newDeckName.trim() !== '') {
      await createDeck(userEmail, newDeckName);
      setNewDeckName('');
      loadDecks();
    }
  };

  const handleDeleteDeck = async (deckId) => {
    await deleteDeck(userEmail, deckId);
    loadDecks();
  };

  return (
    <View className="flex-1 p-4 bg-white">
      <Text className=' mt-4 mb-4 text-4xl font-light text-neutral-800'>
        Decks
      </Text>
      <TextInput
        className="border-gray-300 border-2 rounded-xl p-3 mt-2 mb-4"
        placeholder="Deck name"
        value={newDeckName}
        onChangeText={setNewDeckName}
      />
      <TouchableOpacity
        onPress={handleCreateDeck}
        className=' w-full flex justify-center items-center p-3 bg-violet-400 rounded-xl'
      >
        <Text className='text-white font-semibold text-lg'>
          Create deck
        </Text>
      </TouchableOpacity>
      <ScrollView className="mt-4">
        {decks.map((deck) => (
          <View key={deck.id} className="relative mb-4 p-4 border-2 border-gray-300 rounded-xl">
            <TouchableOpacity
              onPress={() => {
                const exportToAnki = async () => {
                  await exportFlashcardsToAnki(authState.email, deck.id);
                }
                exportToAnki();
              }}
              className='absolute z-[5] top-4 right-4'
            >
              <Entypo name="export" size={34} color="#a78bfa" />
            </TouchableOpacity>
            <Text className="text-4xl text-neutral-800 font-light">{deck.title}</Text>
            <TouchableOpacity 
              onPress={() => handleDeleteDeck(deck.id)}
              className="mt-4 p-2 rounded-lg"
              style={{ backgroundColor: "#ef4444" }}
            >
              <Text className="text-white text-center w-full">Delete Deck</Text>
            </TouchableOpacity>
            <FlashCards deck={deck} userEmail={userEmail} loadDecks={loadDecks} />
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

function FlashCards({ deck, userEmail, loadDecks }) {

  const { authState, createDeck, getDecks, deleteDeck, getFlashCardsFromDeck, putFlashCardOnDeck, deleteFlashCardFromDeck } = useAuth();

  const [flashcards, setFlashcards] = useState([]);

  useEffect(() => {
    loadFlashCards();
  }, []);

  const loadFlashCards = async () => {
    // console.log('FLASHCARDS:', loadedFlashcards);

    const loadedFlashcards = await getFlashCardsFromDeck(userEmail, deck.id);
    console.log('FLASHCARDS:', loadedFlashcards);
    setFlashcards(loadedFlashcards);
  };

  const handleDeleteFlashCard = async (flashcardId) => {
    await deleteFlashCardFromDeck(userEmail, deck.id, flashcardId);
    loadFlashCards();
    loadDecks();
  };

  return (
    <View className="mt-4">
      {flashcards.map((flashcard) => (
        <View key={flashcard.id} className="mt-4 rounded-lg p-4 bg-gray-100">
          <Text className="text-lg font-medium"><Text className='text-violet-400'>Question:</Text> {flashcard.question}</Text>
          <Text className="text-lg mt-2"><Text className='text-violet-400 font-medium'>Answer:</Text> {flashcard.answer}</Text>
          <TouchableOpacity 
            onPress={() => handleDeleteFlashCard(flashcard.id)}
            className="mt-2 p-2 rounded-lg"
            style={{ backgroundColor: "#ef4444" }}
          >
            <Text className="text-white text-center w-full">Delete Flashcard</Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
}
