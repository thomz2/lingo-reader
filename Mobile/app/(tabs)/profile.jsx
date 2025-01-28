import { View, Text, ScrollView, Pressable } from 'react-native'
import React from 'react'
import BookButton from '../components/BookButton';
import HorizontalList from '../components/HorizontalList';
import { useAuth } from '../hooks/AuthContext';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';

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

  const { authState } = useAuth();

  const router = useRouter();

  return (
    <View className="my-8 flex justify-between relative">

      <Pressable
        className='absolute right-4 z-10'
        onPress={() => {
          router.replace('/config')
        }}
      >
        <Ionicons name="settings-outline" size={36} color="#a78bfa" />
      </Pressable>

      <Text className='mx-4 text-4xl font-light text-neutral-800'>
        Welcome, {authState.username.split(' ')[0]}
      </Text>

      <ScrollView className='mt-4'>
        <HorizontalList
          title={'Last books'}
        >
          {onlineBooks.map((val, idx) => (
            <BookButton
              key={idx}
              title={val.title}
              coverSource={val.imageUrl}
              bookId={idx}
            />
          ))}
        </HorizontalList>
      </ScrollView>
    </View>

  )
}