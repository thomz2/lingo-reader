import { View, Text, ScrollView, Image } from 'react-native'
import React, { useState } from 'react'
import BookButton from '../components/BookButton';
import HorizontalList from '../components/HorizontalList';

export default function profile() {
  
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


  const [user, setUser] = useState({
    name: "GH120",
  })

  return (
    <View className="my-8 flex justify-between">
      <Text className='mx-4 text-4xl'>Bem vindo {user.name}</Text>

      <ScrollView className='mt-4'>
        <HorizontalList
          title={'Lista recente'}
        >
          {onlineBooks.map((val, idx) => (
            <BookButton
              key={idx}
              title={val.title}
              coverSource={val.imageUrl}
              onPress={() => (console.log('b'))}
            />
          ))}
        </HorizontalList>
      </ScrollView>
    </View>

  )
}