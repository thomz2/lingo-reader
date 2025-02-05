import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native'
import React, { useEffect, useState } from 'react'

import * as DocumentPicker from 'expo-document-picker';

import { useAuth } from '../hooks/AuthContext';
import HorizontalList from '../components/HorizontalList';
import BookButton from '../components/BookButton';


const Books = () => {

  const { authState, onAddBookToUser, onGetUserBooks } = useAuth();

  // const { getMeta } = useReader();
  
  const [error, setError] = useState(false);
  const [bookUri, setBookUri] = useState('');
  const [loadingBooks, setLoadingBooks] = useState(true);
  const [books, setBooks] = useState([]);

  // TODO: ajeitar situacao em que usuario acaba de colocar o livro e esse useEffect nao acontece
  useEffect(() => {
    const loadBooks = async () => {
      const booksRes = await onGetUserBooks(authState.email);
      if (!booksRes || booksRes.error) {
        setError(booksRes.msg);
      }
      setBooks(booksRes);
      setLoadingBooks(false);
      console.log('user books:', books);
    }

    loadBooks();
  }, []);

  const pickDocument = async () => {
    try {
      const res = await DocumentPicker.getDocumentAsync();
      return res;
    } catch (err) {
      console.log('Erro:', err);
      return null;
    }
  };
  
  return (    
    <View className='relative h-full w-full'>
      <TouchableOpacity 
        className='absolute bottom-6 right-6' 
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

            // usando apenas o expo document picker temos essas infos sobre o livro.
            // se quisermos infos melhores podemos usar a lib do livro pra pegar metadata 
            const book = {
              'name': res.assets[0].name,
              'uri': res.assets[0].uri,
              'completion': 0
            };
            console.log('book:', book);

            setBookUri(book.uri);

            const addBookRes = await onAddBookToUser(authState.email, book);
            
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

      {/* TODO: trocar essa horizontal list para uma lista que fique 3 na horizontal e scroll para baixo */}
      {!loadingBooks && <HorizontalList>
        {books.map((book, idx) => (
          <BookButton key={idx} bookId={book.uri} title={book.name} coverSource={"https://picsum.photos/400"}/>
        ))}
      </HorizontalList> }

    </View>
  )
}

export default Books