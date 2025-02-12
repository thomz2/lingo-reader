import { View, Text, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'

import * as DocumentPicker from 'expo-document-picker';

import { useAuth } from '../hooks/AuthContext';
import HorizontalList from '../components/HorizontalList';
import BookButton from '../components/BookButton';


const Books = () => {

  const { authState, onAddBookToUser, onGetUserBooks, onGetNewId } = useAuth();

  // const { getMeta } = useReader();
  
  const [error, setError] = useState(false);
  const [bookUri, setBookUri] = useState('');
  const [loadingBooks, setLoadingBooks] = useState(true);
  const [books, setBooks] = useState([]);

  // TODO: ajeitar situacao em que usuario acaba de colocar o livro e esse useEffect nao acontece
  useEffect(() => {
    loadBooks();
  }, []);

  useEffect(() => {
    loadBooks();
  }, [bookUri]);

  const loadBooks = async () => {
    const booksRes = await onGetUserBooks(authState.email);
    if (!booksRes || booksRes.error) {
      setError(booksRes.msg);
    }
    setBooks(booksRes);
    setLoadingBooks(false);
    console.log('user books:', books);
  }

  const pickDocument = async () => {
    try {
      const res = await DocumentPicker.getDocumentAsync();
      return res;
    } catch (err) {
      console.log('Erro:', err);
      return null;
    }
  };

  const chunkArray = (arr, size) => {
    return Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
      arr.slice(i * size, i * size + size)
    );
  };
  
  return (    
    <View className='relative h-full w-full'>
      <TouchableOpacity 
        className='z-50 absolute bottom-6 right-6' 
        onPress={async () => {      
          const press = async () => {
            const res = await pickDocument();

            if (!res) {
              setError('Unknown error.');
            }
            
            if (res.canceled) {
              setError('The operation was cancelled.');
              return;
            }
            
            if (!( res.assets[0].mimeType?.includes('epub') )) {
              setError('The selected document is not an epub file.');
            }

            setError(false);

            const newId = await onGetNewId(authState.email);

            // usando apenas o expo document picker temos essas infos sobre o livro.
            // se quisermos infos melhores podemos usar a lib do livro pra pegar metadata 
            const book = {
              'id': newId,
              'name': res.assets[0].name.replace('.epub', ''),
              'uri': res.assets[0].uri,
              'completion': 0,
              'cover': 'https://picsum.photos/id/' + newId % 500 + '/600'
            };
            console.log('book:', book);

            const addBookRes = await onAddBookToUser(authState.email, book);

            setBookUri(book.uri);

            if (addBookRes && addBookRes.error) {
              setError(addBookRes.msg);
            }

          }

          press();
        }}
      >
        <View className='rounded-full px-6 pt-4 pb-2 bg-violet-400'>
          <Text className='text-white text-5xl'>+</Text>
        </View>
      </TouchableOpacity>

      <Text className='mx-4 mt-8 mb-4 text-4xl font-light text-neutral-800'>
        Books
      </Text>

      {!loadingBooks && <ScrollView className="mx-auto flex-1 bg-gray-100">
        {chunkArray(books, 2).map((row, rowIndex) => (
          <View key={rowIndex} className="flex-row justify-between p-4">
            {row.map((book, itemIndex) => (
              <View key={itemIndex} className='-mb-3'>
                <BookButton 
                  bookId={book.id}
                  title={book.name.replace('.epub', '')} 
                  coverSource={book.cover}
                />
              </View>
            ))}

            {row.length < 2 &&
              Array.from({ length: 2 - row.length }).map((_, index) => (
                <View key={`empty-${index}`} className="flex-1 mx-2" />
              ))}
          </View>
        ))}
        <View className='p-4'/>
      </ScrollView>}


    </View>
  )
}

export default Books